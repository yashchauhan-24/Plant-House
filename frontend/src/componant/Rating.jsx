import React, { useState } from "react";

function Rating({ value, onRatingChange, disable }) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  const handleMouseEnter = (rating) => {
    if (!disable) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disable) {
      setHoverRating(0);
    }
  };

  const handleClick = (rating) => {
    if (!disable) {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  const generateStar = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || selectedRating);

      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "filled" : "empty"}`}
          style={{ pointerEvents: disable ? "none" : "auto", cursor: "pointer" }}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        >
          ⭐
        </span>
      );
    }

    return stars;
  };

  return (
    <div>
      <div className="rating">{generateStar()}</div>
    </div>
  );
}

export default Rating;