import React from "react";

const Star = ({ fill = 0, id }) => {
  const gradientId = `star-grad-${id}`;
  fill = Math.max(0, Math.min(fill, 1));

  return (
    <svg
      className="w-8 h-8"   
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fill * 100}%`} stopColor="#FBBF24" />
          <stop offset={`${fill * 100}%`} stopColor="#D1D5DB" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
      />
    </svg>
  );
};

const StarRating = ({ rating = 0, isDarkMode }) => {
  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((n) => {
        let fill = 0;
        if (rating >= n) fill = 1;
        else if (rating + 1 > n) fill = rating - (n - 1);

        return <Star key={n} id={n+ Math.random()} fill={fill} />;
      })}
      <span
        className={`ml-2 text-sm ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {rating ? rating.toFixed(1) : "No rating yet"}
      </span>
    </div>
  );
};

export default StarRating;
