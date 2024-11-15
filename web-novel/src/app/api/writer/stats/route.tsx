// app/api/writer/stats/route.ts
import dbConnect from "@/lib/dbConnect";
import Novel from "@/models/Novel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";

// Mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get all novels by the current user
    const novels = await Novel.find({ createdBy: session.user.id });

    // Calculate total stats with safe fallbacks
    const stats = novels.reduce(
      (acc, novel) => ({
        viewCount: (acc.viewCount || 0) + (novel.viewCount || 0),
        likeCount: (acc.likeCount || 0) + (novel.likes?.length || 0),
        bookshelfCount:
          (acc.bookshelfCount || 0) + (novel.bookshelf?.length || 0),
        reviewCount: (acc.reviewCount || 0) + (novel.reviews?.length || 0),
      }),
      {
        viewCount: 0,
        likeCount: 0,
        bookshelfCount: 0,
        reviewCount: 0,
      }
    );

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching writer stats:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        stats: {
          viewCount: 0,
          likeCount: 0,
          bookshelfCount: 0,
          reviewCount: 0,
        }
      },
      { status: 500 }
    );
  }
}