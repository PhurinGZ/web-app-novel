import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  await dbConnect();

  try {
    // Fetch comments by chapterId and populate the user field
    const comments = await Comment.find({
      chapterId: params.chapterId,
    }).populate("user");

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Error fetching comments" },
      { status: 500 }
    );
  }
}

export async function POST(req:Request, { params }: { params: { chapterId: string } }) {
  await dbConnect();

  const { text } = await req.json();

  // Get the authenticated user session
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in to post a comment." },
      { status: 401 }
    );
  }

  const user = session.user.id;

  try {
    const newComment = new Comment({ chapterId: params.chapterId, user: user, text });
    await newComment.save();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Error creating comment" },
      { status: 500 }
    );
  }
}
