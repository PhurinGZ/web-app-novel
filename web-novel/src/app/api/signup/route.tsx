// src/app/api/signup/route.tsx

import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { NextResponse,NextRequest } from "next/server";

// Mark route as dynamic
export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = await req.json();

  // Validate required fields
  if (!username || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Check if the email or username is already in use
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username or email already in use" },
        { status: 400 }
      );
    }

    // Hash the password before saving
    // const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

    // Create the new user with hashed password
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}
