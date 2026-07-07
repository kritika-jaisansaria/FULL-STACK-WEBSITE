import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyWishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="wishlist-empty">
      <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="95" fill="#FBF3E7" />
        <path
          d="M100 145s-45-27.5-45-59.4C55 65.9 69.6 52 87.5 52c7.4 0 14.3 2.6 19.7 7.6C112.6 54.6 119.5 52 126.9 52 144.8 52 159 65.9 159 85.6 159 117.5 100 145 100 145z"
          fill="#b8860b"
          opacity="0.9"
        />
        <path
          d="M78 90c0-8 6-14 13-14 4 0 7.5 1.6 10 4.4"
          stroke="#FBF3E7"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <h2 className="wishlist-empty-title">Your Wishlist is Empty</h2>
      <p className="wishlist-empty-text">
        Save your favourite pieces here and shop them anytime.
      </p>
      <button className="wishlist-continue-btn" onClick={() => navigate('/all-jewellery')}>
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyWishlist;