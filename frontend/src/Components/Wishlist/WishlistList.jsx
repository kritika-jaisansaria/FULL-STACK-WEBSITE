import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import WishlistItem from './WishlistItem';
import EmptyWishlist from './EmptyWishlist';

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo"))?.token;
  } catch {
    return null;
  }
};

const WishlistList = () => {
  const { wishlist, loading } = useWishlist();
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  return (
    <>
      <style>{`
        .wishlist-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 60px 80px;
        }
        .wishlist-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 28px;
          border-bottom: 1px solid #eee;
          padding-bottom: 18px;
        }
        .wishlist-title {
          font-size: 28px;
          font-weight: 600;
          color: #3e0f0f;
          margin: 0;
          letter-spacing: 0.3px;
        }
        .wishlist-count {
          font-size: 15px;
          color: #888;
          margin-left: 8px;
          font-weight: 400;
        }
        .wishlist-continue-link {
          background: none;
          border: none;
          color: #b8860b;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: underline;
        }
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .wishlist-page { padding: 32px 32px 60px; }
          .wishlist-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .wishlist-page { padding: 24px 20px 50px; }
          .wishlist-title { font-size: 22px; }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 480px) {
          .wishlist-page { padding: 16px 12px 40px; }
          .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        .wishlist-empty {
          text-align: center;
          padding: 80px 20px;
        }
        .wishlist-empty-title {
          font-size: 22px;
          color: #3e0f0f;
          margin: 20px 0 8px;
          font-weight: 600;
        }
        .wishlist-empty-text {
          color: #888;
          font-size: 15px;
          margin-bottom: 26px;
        }
        .wishlist-continue-btn {
          background-color: #b8860b;
          color: #fff;
          border: none;
          padding: 13px 34px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .wishlist-continue-btn:hover {
          background-color: #9c7009;
        }

        .wishlist-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 1100px) { .wishlist-skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .wishlist-skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
        .wishlist-skeleton-card {
          height: 360px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 37%, #f0f0f0 63%);
          background-size: 400% 100%;
          animation: wishlist-shimmer 1.4s ease infinite;
        }
        @keyframes wishlist-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        .wishlist-login-msg {
          text-align: center;
          padding: 80px 20px;
          color: #555;
        }
      `}</style>

      <div className="wishlist-page">
        {!isLoggedIn ? (
          <div className="wishlist-login-msg">
            <h2 style={{ color: '#3e0f0f', marginBottom: 10 }}>Please login to view your wishlist</h2>
            <p style={{ marginBottom: 24 }}>Your saved items are private and tied to your account.</p>
            <button
              className="wishlist-continue-btn"
              onClick={() => navigate('/login', { state: { background: { pathname: '/wishlist' } } })}
            >
              Login
            </button>
          </div>
        ) : loading ? (
          <>
            <div className="wishlist-header">
              <h2 className="wishlist-title">My Wishlist</h2>
            </div>
            <div className="wishlist-skeleton-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="wishlist-skeleton-card" />
              ))}
            </div>
          </>
        ) : wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            <div className="wishlist-header">
              <h2 className="wishlist-title">
                My Wishlist <span className="wishlist-count">({wishlist.length} item{wishlist.length > 1 ? 's' : ''})</span>
              </h2>
              <button className="wishlist-continue-link" onClick={() => navigate('/all-jewellery')}>
                Continue Shopping
              </button>
            </div>
            <div className="wishlist-grid">
              {wishlist.map(product => (
                <WishlistItem key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WishlistList;