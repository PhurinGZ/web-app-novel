import {
  useState,
  useEffect,
  SetStateAction,
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useSession } from "next-auth/react";
import Rating from "@mui/material/Rating";
import { Button, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import StarRating from "./rating";

interface Props {
  novelId: string;
}

interface Reviews {
  _id: string;
}

export default function ReviewSection({ novelId }: Props) {
  const { data: session, status } = useSession();
  const [ratingUser, setRatingUser] = useState(1);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState<Reviews | any>();
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const router = useRouter();

  const calculateAverageRating = (reviewsList: any[]) => {
    if (!reviewsList.length) return 0;
    const sum = reviewsList.reduce(
      (acc: any, review: { rating: any }) => acc + review.rating,
      0
    );
    return sum / reviewsList.length;
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function fetchReviews() {
    try {
      const response = await fetch(
        `/api/novels/reviews?novelId=${novelId}&t=${Date.now()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      if (data.reviews) {
        // Preserve the review being edited
        if (isEditing && editingReviewId) {
          const updatedReviews = data.reviews.map((review: { _id: any }) =>
            review._id === editingReviewId
              ? reviews.find((r: { _id: any }) => r._id === editingReviewId)
              : review
          );
          setReviews(updatedReviews);
        } else {
          setReviews(data.reviews);
        }

        const newAverage = calculateAverageRating(data.reviews);
        setAverageRating(newAverage);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    }
  }

  // Initial load
  useEffect(() => {
    fetchReviews();
  }, [novelId]);

  // Real-time updates for Reader Reviews section only
  useEffect(() => {
    // const intervalId = setInterval(() => {

    // }, 5000); // Poll every 5 seconds

    // return () => clearInterval(intervalId);

    if (!isEditing) {
      // Don't fetch while editing to avoid conflicts
      fetchReviews();
    }
  }, [novelId, isEditing]);

  useEffect(() => {
    if (session?.user && reviews.length > 0) {
      const userReview = reviews.find(
        (review: { user: { _id: string } }) =>
          review.user?._id === session.user.id
      );
      setUserHasReviewed(!!userReview);

      if (userReview && isEditing) {
        setRatingUser(userReview.rating);
        setReview(userReview.content);
        setEditingReviewId(userReview._id);
      }
    }
  }, [session, reviews, isEditing]);

  const handleRatingChange = (newValue: number) => {
    setRatingUser((prevRating) => (newValue === prevRating ? 0 : newValue));
    setError("");
  };

  const handleEdit = () => {
    const userReview = reviews.find(
      (review: { user: { _id: string } }) =>
        review.user?._id === session?.user.id
    );

    if (userReview) {
      setIsEditing(true);
      setRatingUser(userReview.rating);
      setReview(userReview.content);
      setEditingReviewId(userReview._id);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setRatingUser(1);
    setReview("");
    setEditingReviewId(null);
    setError("");
  };

  const handleReviewSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!review.trim()) {
      setError("Please write a review before submitting.");
      return;
    }
    if (ratingUser === 0) {
      setError("Please select a rating before submitting.");
      return;
    }

    setIsLoading(true);
    setError("");

    const tempReview = {
      _id: editingReviewId || `temp-${Date.now()}`,
      user: session?.user,
      rating: ratingUser,
      content: review.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const optimisticReviews = isEditing
      ? reviews.map((r: { _id: null }) =>
          r._id === editingReviewId ? tempReview : r
        )
      : [tempReview, ...reviews];

    setReviews(optimisticReviews);
    setAverageRating(calculateAverageRating(optimisticReviews));

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/novels/reviews?reviewId=${editingReviewId}`
        : `/api/novels/reviews`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          novelId,
          user: session?.user,
          rating: ratingUser,
          content: review.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      await fetchReviews();

      setUserHasReviewed(true);
      setIsEditing(false);
      setEditingReviewId(null);
      setRatingUser(1);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(
        (error instanceof Error && error.message) ||
          "Failed to submit review. Please try again."
      );
      await fetchReviews();
    } finally {
      setIsLoading(false);
    }
  };

  const handleToSignin = () => {
    router.push("/membership");
  };

  const handleReviewChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setReview(e.target.value);
  };

  const renderReviewForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Your Rating
          </label>
          <div className="flex items-center">
            <StarRating
              totalStars={5}
              initialRating={ratingUser}
              onChange={handleRatingChange}
            />
          </div>
        </div>

        <Textarea
          label="Your Review"
          placeholder="Share your thoughts about this novel..."
          value={review}
          onChange={handleReviewChange}
          minRows={3}
          className="w-full"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex gap-3">
          <Button
            type="submit"
            color="primary"
            className="flex-1"
            disabled={isLoading || !review.trim()}
            isLoading={isLoading}
          >
            {isLoading
              ? "Submitting..."
              : isEditing
              ? "Update Review"
              : "Submit Review"}
          </Button>

          {isEditing && (
            <Button
              type="button"
              color="secondary"
              onClick={handleCancelEdit}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );

  return (
    <div className="review mt-6 min-h-[300px]">
      <div className="total-review h-[300px] bg-gray-50 rounded-lg transition-all duration-300">
        <div className="h-full flex flex-col justify-center items-center">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Average Rating</h2>
            <div className="flex items-center justify-center mt-2">
              <Rating
                value={averageRating}
                readOnly
                precision={0.1}
                size="large"
              />
              <span className="ml-2 text-xl font-semibold transition-all duration-300">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on {reviews.length} reviews
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="reviews-list mt-8 px-6">
          <h3 className="text-xl font-semibold mb-6">Reader Reviews</h3>
          {error && !reviews.length ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="space-y-6 max-h-60 overflow-y-auto">
              {reviews.map(
                (
                  review: {
                    _id: any;
                    user: {
                      image: string | undefined;
                      username:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                    };
                    createdAt: string | number | Date;
                    updatedAt: string | number | Date;
                    rating: number | null | undefined;
                    content:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined;
                  },
                  index: any
                ) => (
                  <div
                    key={review._id || index}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex-shrink-0">
                        {review.user?.image && (
                          <img
                            src={review.user.image}
                            alt={typeof review.user.username === "string" ? review.user.username : "User Avatar"}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.user?.username}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                          {review.updatedAt && (
                            <span className="italic ml-2">
                              (Edited: {formatDate(review.updatedAt)})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Rating
                      value={review.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                    />
                    <p className="mt-3 text-gray-700">{review.content}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="mt-8 px-6">
          {status === "unauthenticated" ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Please{" "}
                <button
                  onClick={handleToSignin}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  sign in
                </button>{" "}
                to add a review.
              </p>
            </div>
          ) : userHasReviewed && !isEditing ? (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-green-700">Thank you for your review!</p>
              <Button
                color="primary"
                variant="flat"
                onClick={handleEdit}
                className="mt-2"
              >
                Edit Your Review
              </Button>
            </div>
          ) : (
            renderReviewForm()
          )}
        </div>
      </div>
    </div>
  );
}
