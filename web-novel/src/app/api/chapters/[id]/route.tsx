// pages/api/chapters/[id].js (for GET, PUT, DELETE on a specific chapter)
import dbConnect from "@/lib/dbConnect";
import Chapter from "@/models/Chapter";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const chapter = await Chapter.findById(id).populate("novel");
    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name, content } = await req.json();
  await dbConnect();

  console.log("ID:", params.id); // Debugging: Check if ID is correct
  console.log("Name:", name); // Debugging: Check if name is received correctly
  console.log("Content:", content); // Debugging: Check if content is received correctly

  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      params.id,
      { name, content },
      { new: true }
    );

    if (!updatedChapter) {
      console.error("Chapter not found");
      return NextResponse.json({ message: "Chapter not found", status: 404 });
    }

    return NextResponse.json({ updatedChapter, status: 200 });
  } catch (error ) {
    console.error("Error updating chapter:", error instanceof Error && error.message);
    return NextResponse.json({ message: error instanceof Error && error.message, status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    await Chapter.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Chapter deleted", status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error && error.message, status: 500 });
  }
}
