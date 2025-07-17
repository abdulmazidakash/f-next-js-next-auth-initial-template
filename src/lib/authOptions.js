// app/lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { loginUser } from "@/app/actions/auth/loginUser";
import dbConnect, { collectionNameObject } from "./dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
	//   credentials: {
	// 	username: { label: "Username", type: "text", placeholder: "jsmith" },
	// 	password: { label: "Password", type: "password" },
	// 	email: { label: "Email", type: "email" }
	// 	},
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const result = await loginUser({ email, password });

        if (result.success) {
          // Return user object in the format expected by NextAuth
          return {
            id: result.user._id.toString(), // Ensure the ID is a string
            name: result.user.name,
            email: result.user.email,
            image: result.user.image || null,
          };
        }
        return null; // Return null if authentication fails
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
    async signIn({ user, account, profile, email, credentials}) {
		// Check if the user is signing in with a provider
      if (account) {
        const { providerAccountId, provider } = account;
        const { email:user_email, image, name } = user;
        const userCollection = await dbConnect(collectionNameObject.usersCollection);
        const isExistedUser = await userCollection.findOne({ providerAccountId });

        if (!isExistedUser) {
          const payload = { providerAccountId, provider, email:user_email, image, name };
          await userCollection.insertOne(payload);
        }
      }
      return true;
    },
    async session({ session, user }) {
      // Ensure the session includes the user ID
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};