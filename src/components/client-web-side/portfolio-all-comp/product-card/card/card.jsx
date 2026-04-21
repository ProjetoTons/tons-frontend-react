import React from "react";
import "./card.css";

export default function Card({
  image,
  category,
  title,
  isBookmarked = false,
  onToggleBookmark,
  iconActive,
  iconInactive,
}) {
  return (
    <div className="card">

      
      <div className="card-image">
        <img src={image} alt={title} />
      </div>

      <div className="card-content">
        <div className="card-text">
          <span className="card-category">{category}</span>
          <h2 className="card-title">{title}</h2>
        </div>

        <button
          className="card-btn"
          onClick={onToggleBookmark}
        >
          <img
            src={isBookmarked ? iconActive : iconInactive}
            alt="bookmark"
            className="bookmark-icon"
          />
        </button>
      </div>
    </div>
  );
}