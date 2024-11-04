import { getServerSession } from "next-auth/next";
import { authOption } from "../[...nextauth]/route";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Novel from "@/models/Novel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOption);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // First, let's find the user
    const user = await User.findOne({ email: session.user.email })
      .select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Then, let's find all the novels that are in the user's favorites
    const populatedFavorites = await Novel.find({
      _id: { $in: user.novel_favorites }
    }).select(["name","detail"]);

    // Create the response with populated favorites
    const responseUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePicture: user.profilePicture,
      novel_favorites: populatedFavorites, // This will contain all fields
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add debug logging
    console.log('User favorites IDs:', user.novel_favorites);
    console.log('Populated favorites:', populatedFavorites);

    return NextResponse.json({ user: responseUser });

  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}