// app/api/rates/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Rate from "@/models/Rate";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const rate = await Rate.findById(params.id);

    if (!rate) {
      return NextResponse.json(
        { message: "Rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rate }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching rate" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Update rate
    const updatedRate = await Rate.findByIdAndUpdate(
      params.id,
      {
        name: name.trim(),
        updatedBy: session.user.id,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedRate) {
      return NextResponse.json(
        { message: "Rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ rate: updatedRate }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating rate" },
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
    const rate = await Rate.findByIdAndDelete(params.id);

    if (!rate) {
      return NextResponse.json(
        { message: "Rate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Rate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting rate" },
      { status: 500 }
    );
  }
}