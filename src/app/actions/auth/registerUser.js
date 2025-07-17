'use server';

import bcrypt from 'bcrypt';
import dbConnect, { collectionNameObject } from "@/lib/dbConnect";

export const registerUser = async (payload) => {
  const { name, email, password } = payload;

  // Validation
  if (!name || !email || !password) {
    return { error: true, message: "All fields are required" };
  }

  // Connect to DB
  const userCollection = await dbConnect(collectionNameObject.usersCollection);

  // Check if user exists
  const existingUser = await userCollection.findOne({ email });

  if (existingUser) {
    return { error: true, message: "User already exists" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  payload.password = hashedPassword;

  // Insert new user
  const response = await userCollection.insertOne(payload);

  if (response.acknowledged) {
    return { acknowledged: true, message: "User registered successfully" };
  } else {
    return { error: true, message: "Registration failed" };
  }
};
