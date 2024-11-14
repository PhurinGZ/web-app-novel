import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import Novel from "@/models/Novel"; // Import the Rate model
import Rate from "@/models/Rate"
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();
  const { name } = params;

  try {
    // Register the Rate model
    // const RateModel = Category.model("Rate", Rate.schema);

    // Find the category by name and populate related fields in novels
    const category = await Category.findOne({ name }).populate({
      path: "novels",
      model: Novel,
      populate: {
        path: "rate",
        model: Rate,
        select: "name",
      },
    });

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Category not found",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      data: category,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
}
