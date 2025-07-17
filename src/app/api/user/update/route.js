import dbConnect, { collectionNameObject } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function PUT(request) {
  try {
    const { userId, name, email, password, image, role } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    const userCollection = await dbConnect(collectionNameObject.usersCollection);

    let objectId;
    try {
      objectId = new ObjectId(userId);
    } catch (error) {
      return new Response(JSON.stringify({ message: "Invalid User ID format" }), { status: 400 });
    }

    const existingUser = await userCollection.findOne({ _id: objectId });

    if (!existingUser) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    const updateData = { name, email, image, role };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const response = await userCollection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (response.modifiedCount > 0) {
      return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "No changes made" }), { status: 200 });
    }
  } catch (error) {
    console.error("Update error:", error);
    return new Response(JSON.stringify({ message: "Failed to update profile" }), { status: 500 });
  }
}