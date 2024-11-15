// app/api/books/my-books/route.ts
import dbConnect from "@/lib/dbConnect";
import Novel from "@/models/Novel";
import { getServerSession } from "next-auth/next";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Make sure to export as named export, not default export
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const headersList = headers();

    // Get URL search params directly from the request URL
    const { searchParams } = new URL(request.url);
    
    const session = await getServerSession(authOption);

    // Return early if no session
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Extract query parameters
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const order = searchParams.get("order") || "desc";
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: any = {
      createdBy: session.user.id,
    };

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    // Use Promise.all for parallel queries
    const [total, books] = await Promise.all([
      Novel.countDocuments(query),
      Novel.find(query)
        .sort({ [sortBy]: order === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .select(
          "name status viewCount bookshelf reviews image_novel updatedAt chapters"
        )
        .lean()
    ]);

    const transformedBooks = books.map((book) => ({
      id: book._id,
      name: book.name,
      status: book.status,
      updateDate: book.updatedAt,
      episodeCount: book.chapters?.length || 0,
      views: book.viewCount || 0,
      bookshelfCount: book.bookshelf?.length || 0,
      commentCount: book.reviews?.length || 0,
      image: book.image_novel,
    }));

    // Return response
    return NextResponse.json({
      books: transformedBooks,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching writer books:", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}