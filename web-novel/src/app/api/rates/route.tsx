// app/api/rates/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Rate from "@/models/Rate";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const rates = await Rate.find({})
      .sort({ name: 1 }) // Sort alphabetically by name
      .select('name'); // Only return id and name fields
    
    return NextResponse.json({ rates }, { status: 200 });
  } catch (error) {
    console.error("Fetch rates error:", error);
    return NextResponse.json(
      { message: "Error fetching rates" },
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
    const { name } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Check if rate already exists
    const existingRate = await Rate.findOne({ name: name.trim() });
    if (existingRate) {
      return NextResponse.json(
        { message: "Rate already exists" },
        { status: 400 }
      );
    }

    // Create rate
    const rate = await Rate.create({
      name: name.trim(),
      createdBy: session.user.id,
      updatedBy: session.user.id,
      publishedAt: new Date(),
    });

    return NextResponse.json(rate, { status: 201 });
  } catch (error) {
    console.error("Create rate error:", error);
    return NextResponse.json(
      { message: "Error creating rate" },
      { status: 500 }
    );
  }
}