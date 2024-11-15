// app/api/search/route.ts
import dbConnect from "@/lib/dbConnect";
import Novel from "@/models/Novel";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    if (!search) {
      return NextResponse.json(
        {
          success: false,
          message: "No search term provided"
        },
        { status: 400 }
      );
    }

    const novels = await Novel.find({
      name: { $regex: search, $options: "i" },
    })
      .select("name detail image_novel type")
      .limit(20) // Add limit for performance
      .lean(); // Add lean() for better performance

    return NextResponse.json(
      { 
        success: true, 
        data: novels 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Search API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}