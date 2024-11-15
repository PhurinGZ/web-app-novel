import dbConnect from "@/lib/dbConnect";
import Chapter from "@/models/Chapter";
import Novel from "@/models/Novel";
import { NextResponse } from "next/server";

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, content, novelId } = await req.json();

    // Validate required fields
    if (!name || !content || !novelId) {
      return NextResponse.json({ 
        message: "Missing required fields", 
        status: 400 
      });
    }

    // Start a session for transaction
    const session = await Chapter.startSession();
    let chapter;

    try {
      await session.withTransaction(async () => {
        // Create new chapter
        chapter = new Chapter({ 
          name, 
          content, 
          novel: novelId 
        });
        await chapter.save({ session });

        // Update novel's chapters array
        await Novel.findByIdAndUpdate(
          novelId,
          { 
            $push: { chapters: chapter._id },
            $set: { updatedAt: new Date() }
          },
          { session }
        );
      });

      await session.endSession();

      return NextResponse.json({ 
        message: "Chapter created successfully",
        chapter, 
        status: 201 
      });

    } catch (error) {
      await session.endSession();
      throw error;
    }

  } catch (error) {
    console.error("Error in POST /api/chapters:", error);
    return NextResponse.json({ 
      message: error instanceof Error && error.message || "Internal server error",
      status: 500 
    });
  }
}

export async function PUT(req: Request) {
  await dbConnect();

  try {
    const { id, name, content } = await req.json();

    if (!id || (!name && content === undefined)) {
      return NextResponse.json({ 
        message: "Missing required fields", 
        status: 400 
      });
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(
      id,
      { 
        ...(name && { name }),
        ...(content !== undefined && { content }),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedChapter) {
      return NextResponse.json({ 
        message: "Chapter not found", 
        status: 404 
      });
    }

    return NextResponse.json({ 
      message: "Chapter updated successfully",
      chapter: updatedChapter,
      status: 200 
    });

  } catch (error) {
    console.error("Error in PUT /api/chapters:", error);
    return NextResponse.json({ 
      message: error instanceof Error && error.message || "Internal server error",
      status: 500 
    });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const novelId = searchParams.get("novelId");

    if (!id || !novelId) {
      return NextResponse.json({ 
        message: "Missing required parameters", 
        status: 400 
      });
    }

    const session = await Chapter.startSession();

    try {
      await session.withTransaction(async () => {
        // Delete the chapter
        const deletedChapter = await Chapter.findByIdAndDelete(id, { session });

        if (!deletedChapter) {
          throw new Error("Chapter not found");
        }

        // Remove chapter reference from novel
        await Novel.findByIdAndUpdate(
          novelId,
          { 
            $pull: { chapters: id },
            $set: { updatedAt: new Date() }
          },
          { session }
        );
      });

      await session.endSession();

      return NextResponse.json({ 
        message: "Chapter deleted successfully", 
        status: 200 
      });

    } catch (error) {
      await session.endSession();
      throw error;
    }

  } catch (error) {
    console.error("Error in DELETE /api/chapters:", error);
    return NextResponse.json({ 
      message: error instanceof Error && error.message || "Internal server error",
      status: 500 
    });
  }
}