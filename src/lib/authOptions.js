import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { loginUser } from "@/app/actions/auth/loginUser";
import { signIn } from "next-auth/react";
import dbConnect, { collectionNameObject } from "./dbConnect";

export const authOptions = {
  providers: [
	CredentialsProvider({
		// The name to display on the sign in form (e.g. 'Sign in with...')
		name: 'Credentials',
		// The credentials is used to generate a suitable form on the sign in page.
		// You can specify whatever fields you are expecting to be submitted.
		// e.g. domain, username, password, 2FA token, etc.
		// You can pass any HTML attribute to the <input> tag through the object.
		credentials: {
		username: { label: "Username", type: "text", placeholder: "jsmith" },
		password: { label: "Password", type: "password" },
		email: { label: "Email", type: "email" }
		},
		async authorize(credentials, req) {
			console.log('credentials --->',credentials);
		// You need to provide your own logic here that takes the credentials
		// submitted and returns either a object representing a user or value
		// that is false/null if the credentials are invalid.
		//   e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
		// const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
		const user = await loginUser(credentials);
		console.log('loginUser response--->', user);
		// You can also use the `req` object to obtain additional parameters
		// (i.e., the request IP address)
		//   const res = await fetch("/your/endpoint", {
		//     method: 'POST',
		//     body: JSON.stringify(credentials),
		//     headers: { "Content-Type": "application/json" }
		//   })
		//   const user = await res.json()

		// If no error and we have user data, return it
		if (user) {
			return user
		}
		// Return null if user data could not be retrieved
		return null
		}
	}),
	GoogleProvider({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET
	}),
	GitHubProvider({
		clientId: process.env.GITHUB_ID,
		clientSecret: process.env.GITHUB_SECRET
	})
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
			async signIn({ user, account, profile, email, credentials }) {
				console.log({user, account, profile, email, credentials}); //check all the data received from the provider
			if(account){
				const { providerAccountId, provider } = account;
				const { email: user_email, image, name} = user;
				const userCollection = dbConnect(collectionNameObject.usersCollection);
				const isExistedUser = await userCollection.findOne({providerAccountId})
				if(!isExistedUser){
					const payload = { providerAccountId, provider, email:user_email, image, name};
					await userCollection.insertOne(payload);
				}
			}
			return true },
		}

}