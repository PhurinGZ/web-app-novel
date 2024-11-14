// app/api/favorite/route.tsx
import dbConnect from "@/lib/dbConnect";
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
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  
  try {
    // Parse request body
    const { novelId, action } = await req.json();

    if (!novelId || !action) {
      return NextResponse.json(
        { message: "Novel ID and action are required" },
        { status: 400 }
      );
    }

    // Validate action type
    if (!['like', 'bookshelf'].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action type" },
        { status: 400 }
      );
    }

    // Find user and novel
    const [user, novel] = await Promise.all([
      User.findById(userId),
      Novel.findById(novelId)
    ]);

    if (!user || !novel) {
      return NextResponse.json(
        { message: "User or Novel not found" },
        { status: 404 }
      );
    }

    let isLiked = false;
    let isBookmarked = false;

    // Handle like action
    if (action === 'like') {
      isLiked = user.liked_novels.includes(novelId);
      if (isLiked) {
        // Remove like
        user.liked_novels = user.liked_novels.filter(
          (id) => id.toString() !== novelId.toString()
        );
        novel.likes = novel.likes.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        // Add like
        user.liked_novels.push(novelId);
        novel.likes.push(userId);
      }
    }

    // Handle bookshelf action
    if (action === 'bookshelf') {
      isBookmarked = user.novel_favorites.includes(novelId);
      if (isBookmarked) {
        // Remove from bookshelf
        user.novel_favorites = user.novel_favorites.filter(
          (id) => id.toString() !== novelId.toString()
        );
        novel.bookshelf = novel.bookshelf.filter(
          (id) => id.toString() !== userId.toString()
        );
      } else {
        // Add to bookshelf
        user.novel_favorites.push(novelId);
        novel.bookshelf.push(userId);
      }
    }

    // Save changes
    await Promise.all([user.save(), novel.save()]);

    // Return updated stats
    const stats = {
      likeCount: novel.likes.length,
      bookshelfCount: novel.bookshelf.length,
      isLiked: action === 'like' ? !isLiked : novel.likes.includes(userId),
      isBookmarked: action === 'bookshelf' ? !isBookmarked : novel.bookshelf.includes(userId)
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's interaction status with a novel
export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOption);
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const url = new URL(req.url);
    const novelId = url.searchParams.get('novelId');

    if (!novelId) {
      return NextResponse.json(
        { message: "Novel ID is required" },
        { status: 400 }
      );
    }

    const novel = await Novel.findById(novelId);
    if (!novel) {
      return NextResponse.json(
        { message: "Novel not found" },
        { status: 404 }
      );
    }

    const stats = {
      likeCount: novel.likes.length,
      bookshelfCount: novel.bookshelf.length,
      isLiked: novel.likes.includes(session.user.id),
      isBookmarked: novel.bookshelf.includes(session.user.id)
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}