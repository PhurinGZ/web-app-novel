// app/api/categories/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { Types } from "mongoose";

// Define interfaces that match the Mongoose document structure
interface Novel {
  _id: Types.ObjectId;
  title: string;
  titleThai: string;
}

interface CategoryDocument {
  _id: Types.ObjectId;
  name: string;
  nameThai: string;
  novels: Novel[];
  __v: number;
}

interface Category {
  _id: string;
  name: string;
  nameThai: string;
  novels: Novel[];
}

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
    const categoryWithNovels = await Category.findById(params.id)
      .populate<{ novels: Array<Novel> }>("novels", {
        select: { title: 1, titleThai: 1 },
      })
      .lean<Category>()
      .exec();

    if (!categoryWithNovels) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: categoryWithNovels._id.toString(),
          name: categoryWithNovels.name,
          nameThai: categoryWithNovels.nameThai,
          novels: categoryWithNovels.novels.map((novel) => ({
            id: novel._id.toString(),
            title: novel.title,
            titleThai: novel.titleThai,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching category" },
      { status: 500 }
    );
  }
}

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
    const { action, novelId } = body as {
      action: "add" | "remove";
      novelId: string;
    };

    if (!novelId || !action) {
      return NextResponse.json(
        { message: "Novel ID and action are required" },
        { status: 400 }
      );
    }

    let updateOperation;
    if (action === "add") {
      updateOperation = { $addToSet: { novels: novelId } };
    } else if (action === "remove") {
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
        updatedAt: new Date(),
      },
      { new: true }
    )
      .populate<{ novels: Novel[] }>("novels", "title titleThai")
      .lean<Category>()
      .exec();

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updatedCategory._id.toString(),
          name: updatedCategory.name,
          nameThai: updatedCategory.nameThai,
          novels: updatedCategory.novels.map((novel) => ({
            id: (novel._id as Types.ObjectId).toString(),
            title: novel.title,
            titleThai: novel.titleThai,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating category novels" },
      { status: 500 }
    );
  }
}
