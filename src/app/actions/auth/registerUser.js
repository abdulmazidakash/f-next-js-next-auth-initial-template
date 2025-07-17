'use server';

import bcrypt from 'bcrypt';
import dbConnect, { collectionNameObject } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const registerUser = async (payload) => {
  const { name, email, password, image } = payload;

  // Validation
  if (!name || !email || !password) {
    return { error: true, message: "All fields are required" };
  }

  // Connect to DB
  const userCollection = await dbConnect(collectionNameObject.usersCollection);

  // Check if user exists by email
  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return { error: true, message: "User with this email already exists" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user payload with consistent structure
  const userPayload = {
    _id: new ObjectId(),
    userId: new ObjectId().toString(),
    providerAccountId: null,
    provider: "credentials",
    email,
    name,
    image: image || null,
    password: hashedPassword,
    role: "user",
  };

  // Insert new user
  const response = await userCollection.insertOne(userPayload);
  console.log('server side: register user response--->', response);

  if (response.acknowledged) {
    return { acknowledged: true, message: "User registered successfully" };
  } else {
    return { error: true, message: "Registration failed" };
  }
};