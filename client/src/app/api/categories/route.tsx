import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect(); // Connect to MongoDB

  try {
    // Fetch categories and populate related fields if necessary
    const categories = await Category.find()
    //   .populate("novels", "name") // Populate 'novels' field with only the 'name' field
    //   .populate("createdBy", "username") // Populate 'createdBy' with 'username' field
    //   .populate("updatedBy", "username"); // Populate 'updatedBy' with 'username' field

    return NextResponse.json({ success: true, data: categories, status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message, status: 500 });
  }
}
