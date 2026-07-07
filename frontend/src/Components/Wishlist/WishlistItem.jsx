import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const WishlistItem = ({ product }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [moving, setMoving] = useState(false);
  const [removing, setRemoving] = useState(false);

  if (!product || !product._id) return null;

  const busy = moving || removing;

  const handleMoveToCart = async () => {
    try {
      setMoving(true);
      await addToCart(product, 1);
      await removeFromWishlist(product._id);
      toast.success('Moved to cart');
    } catch (err) {
      // addToCart/removeFromWishlist already surface their own error toasts
      console.error('Error moving to cart', err);
    } finally {
      setMoving(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromWishlist(product._id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <style>{`
        .wl-card {
          position: relative;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 12px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease;
        }
        .wl-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        .wl-img-wrap { position: relative; width: 100%; padding-top: 100%; border-radius: 8px; overflow: hidden; background: #f7f7f7; }
        .wl-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .wl-remove-btn {
          position: absolute; top: 8px; right: 8px; z-index: 5;
          background: #fff; border: 1px solid #eee; border-radius: 50%;
          width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #555; transition: color 0.2s ease, border-color 0.2s ease;
        }
        .wl-remove-btn:hover { color: #b00020; border-color: #b00020; }
        .wl-remove-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .wl-name {
          font-size: 15px; font-weight: 600; color: #333; margin: 12px 0 4px;
          overflow: hidden; text-overflow: ellipsis; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 38px;
        }
        .wl-price { font-weight: 700; font-size: 16px; color: #3e0f0f; margin-bottom: 10px; }
        .wl-move-btn {
          margin-top: auto; width: 100%; padding: 10px; background-color: #b8860b; color: #fff;
          border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: background 0.2s ease;
        }
        .wl-move-btn:hover:not(:disabled) { background-color: #9c7009; }
        .wl-move-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .wl-overlay {
          position: absolute; inset: 0; background: rgba(255,255,255,0.75);
          display: flex; align-items: center; justify-content: center; border-radius: 10px; z-index: 10;
        }
        .wl-spinner {
          width: 26px; height: 26px; border: 3px solid #e5c98f; border-top-color: #b8860b;
          border-radius: 50%; animation: wl-spin 0.7s linear infinite;
        }
        @keyframes wl-spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .wl-name { font-size: 13px; min-height: 34px; }
          .wl-price { font-size: 14px; }
          .wl-move-btn { font-size: 12px; padding: 8px; }
        }
      `}</style>

      <div className="wl-card">
        {busy && (
          <div className="wl-overlay">
            <div className="wl-spinner" />
          </div>
        )}

        <button
          className="wl-remove-btn"
          onClick={handleRemove}
          disabled={busy}
          title="Remove from wishlist"
          aria-label="Remove from wishlist"
        >
          <Trash2 size={15} />
        </button>

        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="wl-img-wrap">
            <img
              className="wl-img"
              src={product.media?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image'}
              alt={product.name}
            />
          </div>
          <h3 className="wl-name">{product.name}</h3>
          <p className="wl-price">₹ {Number(product.price || 0).toLocaleString('en-IN')}</p>
        </Link>

        <button className="wl-move-btn" onClick={handleMoveToCart} disabled={busy}>
          <ShoppingBag size={15} />
          Move to Cart
        </button>
      </div>
    </>
  );
};

export default WishlistItem;