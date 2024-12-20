// app/api/list-novels/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ListNovel from "@/models/listNovel";
import Novel from "@/models/Novel";
import Rate from "@/models/Rate";
import Category from "@/models/Category";
import User from "@/models/User";

// Mark route as dynamic
export const dynamic = "force-dynamic";

export async function GET() {
  await dbConnect();
  try {
    const listNovels = await ListNovel.find().populate({
      path: "novels",
      model: Novel,
      populate: [
        {
          path: "createdBy",
          select: "username",
          model: User,
        },
        {
          path: "rate",
          select: "name",
          model: Rate,
        },
        {
          path: "category",
          select: "name",
          model: Category,
        },
      ],
    });

    return NextResponse.json(listNovels);
  } catch (error: any) {
    console.error(error); // Add this line to log the error
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    const { nameListEN, nameListTH, novels, createdBy, publishedAt } = body;

    if (!nameListEN || !nameListTH || !novels || !createdBy || !publishedAt) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const listNovel = await ListNovel.create({
      nameListEN,
      nameListTH,
      novels,
      createdBy,
      publishedAt,
    });

    return NextResponse.json(listNovel, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
