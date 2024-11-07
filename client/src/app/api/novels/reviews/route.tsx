// app/api/novels/reviews/route.tsx
import dbConnect from "@/utils/dbConnect";
import Novel from "@/models/Novel";
import Review from "@/models/Review";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

// Helper function to calculate average rating
async function calculateAverageRating(novelId: string) {
  const novel = await Novel.findById(novelId).populate("reviews");
  if (!novel || !novel.reviews.length) return 0;

  const totalRating = novel.reviews.reduce((sum, review) => {
    return sum + (review.rating || 0);
  }, 0);

  return Number((totalRating / novel.reviews.length).toFixed(1));
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get("novelId");

    if (!novelId) {
      return NextResponse.json(
        { message: "Novel ID is required." },
        { status: 400 }
      );
    }

    const novel = await Novel.findById(novelId).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "username", // Select only needed user fields
      },
    });

    if (!novel) {
      return NextResponse.json(
        { message: "Novel not found." },
        { status: 404 }
      );
    }

    // console.log(novel);

    return NextResponse.json(
      {
        reviews: novel.reviews,
        averageRating: novel.averageRating,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Error fetching reviews.", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const { novelId, user, rating, content } = await req.json();

  if (!novelId || !user || rating == null || !content) {
    return NextResponse.json(
      { message: "All fields are required." },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOption);
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    // Check if user has already reviewed
    const existingReview = await Review.findOne({
      novel: novelId,
      user: user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this novel." },
        { status: 400 }
      );
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new Review
      const review = new Review({
        novel: novelId,
        user: user.id, // Make sure to use the user's ID
        rating,
        content,
        createdAt: new Date(),
      });
      await review.save({ session });

      // Update novel with new review
      const novel = await Novel.findById(novelId);
      if (!novel) {
        await session.abortTransaction();
        return NextResponse.json(
          { message: "Novel not found." },
          { status: 404 }
        );
      }

      // console.log(review)

      // Initialize reviews array if it’s undefined
      if (!novel.reviews) {
        novel.reviews = [];
      }

      novel.reviews.push(review._id);

      // Calculate and update average rating
      const newAverageRating = await calculateAverageRating(novelId);
      novel.averageRating = newAverageRating;

      await novel.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      // Populate the user information in the review before sending response
      const populatedReview = await Review.findById(review._id).populate(
        "user",
        "username image"
      );

      return NextResponse.json(
        {
          review: populatedReview,
          averageRating: newAverageRating,
        },
        { status: 201 }
      );
    } catch (error: any) {
      await session.abortTransaction();

      // Check for duplicate key error
      if (error.code === 11000) {
        return NextResponse.json(
          { message: "You have already reviewed this novel." },
          { status: 400 }
        );
      }
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { message: "Error adding review.", error },
      { status: 500 }
    );
  }
}

// Update the PUT endpoint in app/api/novels/reviews/route.tsx
export async function PUT(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const reviewId = searchParams.get("reviewId");

  const { novelId, rating, content } = await req.json();

  if (!rating || !content) {
    return NextResponse.json(
      { message: "Rating and content are required." },
      { status: 400 }
    );
  }

  try {
    // Start a transaction
    const sessionMon = await mongoose.startSession();
    sessionMon.startTransaction();

    try {
      // Find the review and verify ownership
      const review = await Review.findById(reviewId).populate("user");

      if (!review) {
        return NextResponse.json(
          { message: "Review not found." },
          { status: 404 }
        );
      }

      const session = await getServerSession(authOption);
      if (!session) {
        return NextResponse.json(
          { message: "Authentication required." },
          { status: 401 }
        );
      }

      console.log("work", session.user);

      if (review.user.id !== session?.user?.id) {
        return NextResponse.json(
          { message: "Unauthorized to edit this review." },
          { status: 403 }
        );
      }

      // Update the review
      review.rating = rating;
      review.content = content;
      await review.save({ sessionMon });

      // Recalculate average rating
      const newAverageRating = await calculateAverageRating(novelId);
      await Novel.findByIdAndUpdate(
        novelId,
        { averageRating: newAverageRating },
        { sessionMon }
      );

      await sessionMon.commitTransaction();

      // Populate user information before sending response
      const updatedReview = await Review.findById(reviewId).populate(
        "user",
        "username image"
      );

      return NextResponse.json(
        {
          review: updatedReview,
          averageRating: newAverageRating,
        },
        { status: 200 }
      );
    } catch (error) {
      await sessionMon.abortTransaction();
      throw error;
    } finally {
      sessionMon.endSession();
    }
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { message: "Error updating review.", error },
      { status: 500 }
    );
  }
}
