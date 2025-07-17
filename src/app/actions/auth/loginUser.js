import dbConnect, { collectionNameObject } from "@/lib/dbConnect";
import bcrypt from 'bcrypt';

export const loginUser = async(payload)=>{
	  const { email, password } = payload;

  // Validation
  if (!email || !password) {
	return { error: true, message: "Email and password are required" };
  }

  // Connect to DB
  const userCollection = await dbConnect(collectionNameObject.usersCollection);

  // Find user by email
  const user = await userCollection.findOne({ email });

  if (!user) {
	return { error: true, message: "User not found" };
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
	return { error: true, message: "Invalid password" };
  }

  // Return user data without password
  const { password: _, ...userData } = user;
  console.log('login user data--->', user);
  
  return { success: true, user: userData };
}