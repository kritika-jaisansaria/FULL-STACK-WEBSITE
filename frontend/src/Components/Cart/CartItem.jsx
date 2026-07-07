import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const { toggleWishlist } = useWishlist();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!item || !item.product) return null;

  const { name, price, originalPrice, media, metalDetails, _id: productId } = item.product;
  const grossWeight = metalDetails?.grossWeight || "—";
console.log(item.product);
console.log(item.product?.metalDetails);
  const handleDecrement = () => {
    if (item.quantity > 1) updateQuantity(productId, item.quantity - 1);
  };

  const handleIncrement = () => {
    updateQuantity(productId, item.quantity + 1);
  };

  const handleMoveToWishlist = async () => {
    setLoading(true);
    try{

await toggleWishlist(item.product);

await removeFromCart(productId);

}
catch(err){

console.error(err);

}
    setLoading(false);
    setShowModal(false);
  };

  const handleDelete = async () => {
    await removeFromCart(productId);
    setShowModal(false);
  };

  return (
    <>
      <div style={itemContainer}>
        {/* Product Image */}
        <img
          src={media?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={name}
          width="100"
          height="100"
          style={imageStyle}
        />

        {/* Product Info */}
        <div style={{ marginLeft: '1rem', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>₹ {Number(price).toLocaleString("en-IN")}</p>
              <p style={{ margin: '0.2rem 0 0.5rem', fontSize: '1rem', color: '#333' }}>{name}</p>
              <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: 4 }}>
                Weight: <span style={{ color: '#333' }}>{grossWeight} g</span>
              </p>
              <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: 4 }}>
                Qty: <strong>{item.quantity}</strong>
              </p>

              <div style={qtyWrapper}>
                <button onClick={handleDecrement} disabled={item.quantity <= 1} style={qtyBtn(item.quantity <= 1)}>–</button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1) updateQuantity(productId, val);
                  }}
                  style={qtyInput}
                />
                <button onClick={handleIncrement} style={qtyBtn(false)}>+</button>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={() => setShowModal(true)}
              style={removeBtn}
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={modalHeader}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Remove From Cart</h3>
              <button onClick={() => setShowModal(false)} style={modalClose}>×</button>
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div style={modalBody}>
              <img src={media?.[0]?.url || 'https://via.placeholder.com/300'} alt={name} style={modalImage} />
              <div>
                <div style={priceRow}>
                  <span style={modalPrice}>₹ {Number(price).toLocaleString("en-IN")}</span>
                  {originalPrice && (
                    <span style={modalStrike}>₹ {Number(originalPrice).toLocaleString("en-IN")}</span>
                  )}
                </div>
                <p style={modalName}>{name}</p>
                <p style={modalMeta}>Weight: {grossWeight} g</p>
                <p style={modalMeta}>Qty: <strong>{item.quantity}</strong></p>
              </div>
            </div>
            <div style={modalActions}>
              <button onClick={handleDelete} style={modalBtnOutline}>Delete from cart</button>
              <button onClick={handleMoveToWishlist} disabled={loading} style={modalBtnFilled}>
                {loading ? 'Moving...' : 'Move to wishlist'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;

// ----- Styles -----
const itemContainer = {
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-start',
  padding: '1rem',
  borderRadius: 12,
  backgroundColor: '#fff',
  boxShadow: '0 0 8px rgba(0, 0, 0, 0.05)',
  marginBottom: '1rem',
};

const imageStyle = {
  objectFit: 'cover',
  borderRadius: 8,
  flexShrink: 0,
};

const qtyWrapper = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: 4,
  padding: '0 0.5rem',
};

const qtyBtn = (disabled) => ({
  width: 28,
  height: 28,
  fontWeight: 'bold',
  cursor: disabled ? 'not-allowed' : 'pointer',
  border: 'none',
  background: 'transparent',
  fontSize: '1.2rem',
  lineHeight: 1,
});

const qtyInput = {
  width: 40,
  textAlign: 'center',
  border: 'none',
  fontSize: '1rem',
  outline: 'none',
  userSelect: 'text',
};

const removeBtn = {
  background: '#f5f5f5',
  border: 'none',
  borderRadius: '50%',
  width: 28,
  height: 28,
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#7b2424',
  lineHeight: 0,
};

// Modal Styles
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
};

const modalBox = {
  backgroundColor: '#fff',
  borderRadius: 12,
  width: '90%',
  maxWidth: 400,
  padding: '1.5rem',
  boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
};

const modalHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const modalClose = {
  background: '#f0f0f0',
  border: 'none',
  borderRadius: '50%',
  width: 28,
  height: 28,
  fontSize: '1rem',
  cursor: 'pointer',
};

const modalBody = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
};

const modalImage = {
  width: 70,
  height: 70,
  borderRadius: 8,
  objectFit: 'cover',
};

const priceRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const modalPrice = {
  fontWeight: 'bold',
  fontSize: '1rem',
};

const modalStrike = {
  textDecoration: 'line-through',
  fontSize: '0.9rem',
  color: '#888',
};

const modalName = {
  fontSize: '0.95rem',
  fontWeight: '500',
  marginTop: '4px',
};

const modalMeta = {
  fontSize: '0.85rem',
  color: '#555',
};

const modalActions = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  marginTop: '1.5rem',
};

const modalBtnOutline = {
  flex: 1,
  padding: '0.6rem',
  backgroundColor: '#fff',
  color: '#7b0f13',
  border: '1px solid #7b0f13',
  borderRadius: 30,
  fontWeight: 500,
  cursor: 'pointer',
};

const modalBtnFilled = {
  flex: 1,
  padding: '0.6rem',
  backgroundColor: '#7b0f13',
  color: '#fff',
  border: 'none',
  borderRadius: 30,
  fontWeight: 500,
  cursor: 'pointer',
};
