//app/api/novels/[id]/route.tsx
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Novel from "@/models/Novel";
import Category from "@/models/Category";
import Rate from "@/models/Rate";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { Types } from "mongoose";
import Chapter from "@/models/Chapter";
import Review from "@/models/Review";

// Define valid types and statuses
const VALID_TYPES = ["novel", "webtoon"];
const VALID_STATUSES = ["ongoing", "completed", "dropped"];

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  // console.log(params.id)

  try {
    const novel = await Novel.findById(params.id)
      .populate("createdBy")
      .populate("rate")
      .populate("category")
      .populate("chapters", null, Chapter)
      .populate("reviews", null, Review); 

    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    return NextResponse.json({ novel }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching novel: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userSession = await getServerSession(authOption); // Renamed to userSession

  if (!userSession) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const novel = await Novel.findById(params.id);

    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // Check ownership
    if (novel.createdBy.toString() !== userSession.user.id) {
      return NextResponse.json({
        message: "Not authorized to edit this novel",
        status: 403,
      });
    }

    const body = await req.json();
    const { name, detail, type, status, tags, rate, category } = body;

    // Validation
    const errors: { [key: string]: string } = {};

    if (!name?.trim()) {
      errors.name = "Name is required";
    }

    if (!detail?.trim()) {
      errors.detail = "Detail is required";
    }

    if (!type || !VALID_TYPES.includes(type)) {
      errors.type = `Type must be one of: ${VALID_TYPES.join(", ")}`;
    }

    if (status && !VALID_STATUSES.includes(status)) {
      errors.status = `Status must be one of: ${VALID_STATUSES.join(", ")}`;
    }

    // Validate rate if provided
    if (rate) {
      if (!Types.ObjectId.isValid(rate)) {
        errors.rate = "Invalid rate ID";
      } else {
        const rateExists = await Rate.findById(rate);
        if (!rateExists) {
          errors.rate = "Rate not found";
        }
      }
    }

    // Validate category if provided
    if (category) {
      if (!Types.ObjectId.isValid(category)) {
        errors.category = "Invalid category ID";
      } else {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          errors.category = "Category not found";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Start a session for transaction
    const dbSession = await Novel.startSession(); // Renamed to dbSession
    dbSession.startTransaction();

    try {
      // If the novel had a previous category, remove the novel from that category's novels array
      if (novel.category) {
        await Category.findByIdAndUpdate(
          novel.category,
          { $pull: { novels: novel._id } },
          { session: dbSession }
        );
      }

      // If a new category is being set, add the novel to that category's novels array
      if (category) {
        await Category.findByIdAndUpdate(
          category,
          { $addToSet: { novels: novel._id } },
          { session: dbSession }
        );
      }

      // Update novel
      const updatedNovel = await Novel.findByIdAndUpdate(
        params.id,
        {
          name: name.trim(),
          detail: detail.trim(),
          type,
          status,
          tags: Array.isArray(tags)
            ? tags.filter(Boolean).map((tag) => tag.trim())
            : [],
          rate: rate || null,
          category: category || null,
          updatedAt: new Date(),
          updatedBy: userSession.user.id, // Use userSession here
        },
        { new: true, session: dbSession }
      )
        .populate("createdBy", "username")
        .populate("rate", "name")
        .populate("category", "name nameThai");

      // Commit the transaction
      await dbSession.commitTransaction();

      return NextResponse.json({ novel: updatedNovel }, { status: 200 });
    } catch (error) {
      // If there's an error, abort the transaction
      await dbSession.abortTransaction();
      throw error;
    } finally {
      // End the session
      dbSession.endSession();
    }
  } catch (error) {
    console.error("Update novel error:", error);
    return NextResponse.json(
      { message: "Error updating novel" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const novel = await Novel.findById(params.id);

    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // Check ownership
    if (novel.createdBy.toString() !== session.user.id) {
      return NextResponse.json({
        message: "Not authorized to delete this novel",
        status: 403,
      });
    }

    await Novel.deleteOne({ _id: params.id });
    return NextResponse.json({
      message: "Novel deleted successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Delete novel error:", error);
    return NextResponse.json(
      { message: "Error deleting novel" },
      { status: 500 }
    );
  }
}
