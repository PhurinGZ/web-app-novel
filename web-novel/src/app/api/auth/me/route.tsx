// app/api/auth/me/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Novel from "@/models/Novel";
import { NextRequest, NextResponse } from "next/server";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find the user
    const user = await User.findOne({ email: session.user.email })
      .select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find novels in user's favorites
    const populatedFavorites = await Novel.find({
      _id: { $in: user.novel_favorites || [] }  // Add fallback for empty favorites
    }).select(["name", "detail"]);

    // Create response object
    const responseUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      profilePicture: user.profilePicture,
      novel_favorites: populatedFavorites,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // For debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('User favorites IDs:', user.novel_favorites);
      console.log('Populated favorites:', populatedFavorites);
    }

    return NextResponse.json({ user: responseUser }, { status: 200 });

  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}