// app/api/list-novels/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ListNovel from "@/models/listNovel";
import { isValidObjectId } from "mongoose";

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

    const listNovel = await ListNovel.findById(id)
      .populate("novels")
      .populate("createdBy")
      .populate("updatedBy");

    if (!listNovel) {
      return NextResponse.json({ message: "List not found" }, { status: 404 });
    }

    return NextResponse.json(listNovel);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const { nameListEN, nameListTH, novels, updatedBy, publishedAt } =
      await req.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const listNovel = await ListNovel.findById(id);
    if (!listNovel) {
      return NextResponse.json({ message: "List not found" }, { status: 404 });
    }

    // Update fields if provided
    if (nameListEN) listNovel.nameListEN = nameListEN;
    if (nameListTH) listNovel.nameListTH = nameListTH;
    if (novels) listNovel.novels = novels;
    if (updatedBy) listNovel.updatedBy = updatedBy;
    if (publishedAt) listNovel.publishedAt = publishedAt;
    listNovel.updatedAt = new Date();

    await listNovel.save();
    return NextResponse.json(listNovel);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
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

    const listNovel = await ListNovel.findById(id);
    if (!listNovel) {
      return NextResponse.json({ message: "List not found" }, { status: 404 });
    }

    await ListNovel.deleteOne({ _id: id });
    return NextResponse.json({ message: "List deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
