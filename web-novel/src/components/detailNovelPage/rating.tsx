import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ totalStars = 5, initialRating = 0, onChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (selectedRating) => {
    setRating(selectedRating);
    if (onChange) {
      onChange(selectedRating);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          const isHighlighted = starValue <= (hoverRating || rating);
          
          return (
            <button
              key={index}
              type="button"
              className="p-1 hover:scale-110 transition-transform"
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleClick(starValue)}
            >
              <Star
                size={24}
                className={`transition-colors ${
                  isHighlighted
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;