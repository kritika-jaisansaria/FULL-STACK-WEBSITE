import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FaSpinner } from 'react-icons/fa';

const WishlistItem = ({ product }) => {
  const { toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (!product || !product._id) return null; // 🔐 avoid blank screen crash

  const handleMoveToCart = async () => {
    try {
      setLoading(true);
      await addToCart(product, 1);
      await toggleWishlist(product);
    } catch (err) {
      console.error("Error moving to cart", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await toggleWishlist(product);
    } catch (err) {
      console.error("Error removing from wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={card}>
      {loading && (
        <div style={overlay}>
          <FaSpinner className="spinner" style={spinner} />
        </div>
      )}

      {/* 🗑️ Delete Icon */}
      <div style={deleteWrapper}>
        <button onClick={handleDelete} style={deleteBtn} disabled={loading}>
          <Trash2 size={16} />
        </button>
      </div>

      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: 'none', color: 'inherit', pointerEvents: loading ? 'none' : 'auto' }}
      >
        <img
          src={product.media?.[0]?.url || 'https://via.placeholder.com/300x270?text=No+Image'}
          alt={product.name}
          style={image}
        />
        <h3 style={name}>{product.name}</h3>
        <p style={price}>₹ {product.price}</p>
        <p style={weight}>Gross Weight: {product.metalDetails?.grossWeight || 'N/A'} g</p>
      </Link>

      <button style={moveBtn} onClick={handleMoveToCart} disabled={loading}>
        Move to Cart
      </button>
    </div>
  );
};

export default WishlistItem;

// Styles
const card = {
  position: 'relative',
  width: '300px',
  height: '440px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const deleteWrapper = {
  position: 'absolute',
  top: 8,
  right: 8,
};

const deleteBtn = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '50%',
  padding: 5,
  cursor: 'pointer',
};

const image = {
  width: '100%',
  height: '270px',
  objectFit: 'cover',
  borderRadius: '8px',
};

const name = {
  fontSize: '18px',
  margin: '12px 0 4px',
  fontWeight: 600,
  color: '#333',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const price = {
  fontWeight: 'bold',
  fontSize: 16,
  marginBottom: 4,
};

const weight = {
  fontSize: '14px',
  color: '#777',
  marginBottom: 10,
};

const moveBtn = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#7b2424',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 'bold',
};

const overlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.7)',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const spinner = {
  fontSize: '40px',
  color: '#7b2424',
};