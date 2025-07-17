import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { loginUser } from "@/app/actions/auth/loginUser";
import dbConnect, { collectionNameObject } from "./dbConnect";
import { ObjectId } from "mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const result = await loginUser({ email, password });

        if (result.success) {
          return {
            id: result.user._id.toString(),
            name: result.user.name,
            email: result.user.email,
            image: result.user.image || null,
            userId: result.user.userId,
            role: result.user.role,
          };
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const userCollection = await dbConnect(collectionNameObject.usersCollection);

      // Check if user exists by email for all providers
      const existingUser = await userCollection.findOne({ email: user.email });

      if (account.provider === "credentials") {
        // For credentials-based login, rely on loginUser to handle authentication
        if (existingUser) {
          return true;
        }
        return false;
      } else {
        // For social logins (Google, GitHub)
        const { providerAccountId, provider } = account;
        const { email: user_email, image, name } = user;

        if (existingUser) {
          // Update providerAccountId, provider, userId, and role if needed
          if (!existingUser.providerAccountId || !existingUser.userId || !existingUser.role) {
            await userCollection.updateOne(
              { email: user_email },
              {
                $set: {
                  providerAccountId,
                  provider,
                  userId: existingUser.userId || new ObjectId().toString(),
                  role: existingUser.role || "user",
                },
              }
            );
          }
          return true;
        }

        // Create new user for social login
        const payload = {
          _id: new ObjectId(),
          userId: new ObjectId().toString(),
          providerAccountId,
          provider,
          email: user_email,
          image,
          name,
          role: "user",
        };
        await userCollection.insertOne(payload);
        return true;
      }
    },
    async session({ session, user }) {
      if (user) {
        // Fetch user from database to ensure userId and role are included
        const userCollection = await dbConnect(collectionNameObject.usersCollection);
        const dbUser = await userCollection.findOne({ email: session.user.email });

        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.userId = dbUser.userId;
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
  },
};