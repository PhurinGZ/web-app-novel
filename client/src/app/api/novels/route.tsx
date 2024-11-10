// pages/api/novels/route.tsx
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/utils/dbConnect";
import Novel from "@/models/Novel"; // Adjust the import path to where your model is stored

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      try {
        const novels = await Novel.find().populate("category").populate("rate").populate("reviews");
        res.status(200).json(novels);
      } catch (error) {
        res.status(500).json({ message: "Error fetching novels", error });
      }
      break;

    case "POST":
      try {
        const novel = await Novel.create(req.body);
        res.status(201).json(novel);
      } catch (error) {
        res.status(400).json({ message: "Error creating novel", error });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
