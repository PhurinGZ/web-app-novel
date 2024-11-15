import dbConnect from "@/lib/dbConnect";
import Novel from "@/models/Novel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search");

//   console.log(search)

  if (!search) {
    return NextResponse.json({
      success: false,
      message: "No search term provided",
      status: 400,
    });
  }

  try {
    const novels = await Novel.find({
      name: { $regex: search, $options: "i" }, // Case-insensitive search
    }).select("name detail image_novel type"); // Select only relevant fields

    // console.log(novels)

    return NextResponse.json({ success: true, data: novels, status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error && error.message,
      status: 500,
    });
  }
}
