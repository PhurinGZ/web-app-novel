// app/api/categories/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const categories = await Category.find({})
      .sort({ name: 1 }) // Sort alphabetically by name
      .select('name nameThai'); // Only return id, name and nameThai fields
    
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json(
      { message: "Error fetching categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { name, nameThai } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category already exists" },
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

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { message: "Error creating category" },
      { status: 500 }
    );
  }
}