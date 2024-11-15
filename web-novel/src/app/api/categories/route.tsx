import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

interface Category {
  [x: string]: any;
  _id: string;
  name: string;
  nameThai: string;
}

export async function GET() {
  // const session = await getServerSession(authOption);

  // if (!session) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  await dbConnect();

  try {
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean<Category>()
      .select("_id name nameThai");

    // Transform the data to match frontend expectations
    const transformedCategories = categories.map((category: Category) => ({
      id: category._id.toString(),
      name: category.name,
      nameThai: category.nameThai,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching categories",
      },
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
    const { name, nameThai } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
        },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Category already exists",
        },
        { status: 400 }
      );
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      nameThai: nameThai?.trim(),
      createdBy: session.user.id,
      updatedBy: session.user.id,
      publishedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: category._id.toString(),
          name: category.name,
          nameThai: category.nameThai,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating category",
      },
      { status: 500 }
    );
  }
}
