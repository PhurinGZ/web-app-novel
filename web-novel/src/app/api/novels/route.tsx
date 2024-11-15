import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Novel from "@/models/Novel";
import Category from "@/models/Category";
import Rate from "@/models/Rate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Types } from "mongoose";

// Define valid types and statuses
const VALID_TYPES = ["novel", "webtoon"];
const VALID_STATUSES = ["ongoing", "completed", "dropped"];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const novels = await Novel.find({})
      .populate("createdBy")
      .populate("rate")
      .populate("category")
      .populate('bookshelf')
      // .populate('chapters')
      .sort({ createdAt: -1 });
    return NextResponse.json({ novels }, { status: 200 });
  } catch (error) {
    console.error("Fetch novels error:", error);
    return NextResponse.json(
      { message: "Error fetching novels" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
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

    // Create novel with validated data
    const novel = await Novel.create({
      name: name.trim(),
      detail: detail.trim(),
      type,
      status: status || "ongoing",
      tags: Array.isArray(tags)
        ? tags.filter(Boolean).map((tag) => tag.trim())
        : [],
      rate: rate || null,
      category: category || null,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
    });

    // If category is provided, update the category to include this novel
    if (category) {
      await Category.findByIdAndUpdate(category, {
        $addToSet: { novels: novel._id },
      });
    }

    // Populate the created novel with related data
    const populatedNovel = await Novel.findById(novel._id)
      .populate("createdBy", "username")
      .populate("rate", "name")
      .populate("category", "name nameThai");

    return NextResponse.json(populatedNovel, { status: 201 });
  } catch (error) {
    console.error("Create novel error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).reduce(
        (acc: { [key: string]: string }, key: string) => {
          acc[key] = error.errors[key].message;
          return acc;
        },
        {}
      );
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Error creating novel" },
      { status: 500 }
    );
  }
}
