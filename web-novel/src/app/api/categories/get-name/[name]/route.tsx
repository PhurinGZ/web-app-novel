import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Novel from "@/models/Novel";
import Rate from "@/models/Rate";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  await dbConnect();

  try {
    // Find the category by name and populate related fields in novels
    const category = await Category.findOne({ name: params.name }).populate({
      path: "novels",
      model: Novel,
      populate: {
        path: "rate",
        model: Rate,
        select: "name",
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}