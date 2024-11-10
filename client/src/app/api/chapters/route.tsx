// pages/api/chapters/index.js
import dbConnect from "@/utils/dbConnect";
import Chapter from "@/models/Chapter";
import { NextResponse } from "next/server";

export default async function POST(req: Request) {
  await dbConnect();

  try {
    const chapter = new Chapter(req.body);
    await chapter.save();
    NextResponse.json({ chapter, status: 201 });
  } catch (error) {
    NextResponse.json({ message: error.message, status: 500 });
  }
}
