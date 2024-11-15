// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const category = await Category.findById(params.id)
      .populate('novels', 'title titleThai') // Populate novels with just the titles
      .lean();

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: {
        id: category._id.toString(),
        name: category.name,
        nameThai: category.nameThai,
        novels: category.novels.map((novel: any) => ({
          id: novel._id.toString(),
          title: novel.title,
          titleThai: novel.titleThai
        }))
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}

// Add/Remove novels from category
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { action, novelId } = body;

    if (!novelId || !action) {
      return NextResponse.json(
        { message: "Novel ID and action are required" },
        { status: 400 }
      );
    }

    let updateOperation;
    if (action === 'add') {
      updateOperation = { $addToSet: { novels: novelId } };
    } else if (action === 'remove') {
      updateOperation = { $pull: { novels: novelId } };
    } else {
      return NextResponse.json(
        { message: "Invalid action. Use 'add' or 'remove'" },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      {
        ...updateOperation,
        updatedBy: session.user.id,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('novels', 'title titleThai');

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: {
        id: updatedCategory._id.toString(),
        name: updatedCategory.name,
        nameThai: updatedCategory.nameThai,
        novels: updatedCategory.novels.map((novel: any) => ({
          id: novel._id.toString(),
          title: novel.title,
          titleThai: novel.titleThai
        }))
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating category novels" },
      { status: 500 }
    );
  }
}