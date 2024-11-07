// pages/api/favorite.tsx
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Novel from "@/models/Novel";
import { getServerSession } from "next-auth/next";
import { authOption } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOption);
  if (!session) {
    return NextResponse.json(
      {
        message: "You must be logged in to favorite a novel.",
      },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Parse the request body to get novelId
  const { novelId } = await req.json();

  if (!novelId) {
    return NextResponse.json(
      { message: "Novel ID is required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);
    const novel = await Novel.findById(novelId);

    if (!user || !novel) {
      return NextResponse.json(
        {
          message: "User or Novel not found.",
        },
        { status: 404 }
      );
    }

    // Check if novel is already in user's favorites
    const isFavorited = user.novel_favorites.includes(novelId);

    if (isFavorited) {
      // Remove favorite if already favorited
      user.novel_favorites.pull(novelId);
      novel.user_favorites.pull(userId);
    } else {
      // Add favorite if not already favorited
      user.novel_favorites.push(novelId);
      novel.user_favorites.push(userId);
    }

    console.log(isFavorited)

    await user.save();
    await novel.save();

    return NextResponse.json({ isFavorited: !isFavorited }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred while updating favorites.",
      },
      { status: 500 }
    );
  }
}
