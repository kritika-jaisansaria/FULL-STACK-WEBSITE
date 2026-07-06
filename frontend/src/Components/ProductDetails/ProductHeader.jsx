import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, Share2 } from 'lucide-react';

const SharePopup = ({ product, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(product.url);
    alert("🔗 URL copied!");
  };

  return (
    <div style={overlay}>
      <div style={popup}>
        <button onClick={onClose} style={closeBtn}>✕</button>
        <h3 style={popupTitle}>SHARE YOUR DISCOVERY!</h3>

        <div style={productInfo}>
          <img src={product.image} alt="Product" style={productImage} />
          <p style={{ margin: 0 }}>{product.name}</p>
        </div>

        <div style={linkBox}>
          <span style={urlText}>{product.url}</span>
          <button onClick={handleCopy} style={copyBtn}>Copy URL</button>
        </div>
      </div>
    </div>
  );
};

const ProductHeader = ({_id, name, price, media }) => {
  console.log("ProductHeader props:", { _id, name, price, media });
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [showShare, setShowShare] = useState(false);

  const mainImage = media?.find(m => m.type === "image")?.url || "https://via.placeholder.com/60";

  const productObj = {_id, name, price, media };

  const handleWishlistToggle = () => {
    if (!_id) {
      alert("Product ID missing!");
      return;
    }
    console.log("🔄 Toggling wishlist for product object:", productObj);
    toggleWishlist(productObj); // pass full product object
  };

  const shareProduct = {
    name,
    image: mainImage,
    url: window.location.href,
  };

  return (
    <div style={headerWrapper}>
      <h1 style={nameStyle}>{name}</h1>
      <p style={priceStyle}>₹ {price}</p>
      <p style={taxInfo}>Incl. taxes and charges</p>

      <div style={iconRow}>
        <button
          onClick={handleWishlistToggle}
          style={{
            ...iconBtn,
            color: isWishlisted(_id) ? '#7b2424' : '#555',
          }}
        >
          <Heart
            fill={isWishlisted(_id) ? '#7b2424' : 'none'}
            size={20}
          />
        </button>

        <button onClick={() => setShowShare(true)} style={iconBtn}>
          <Share2 size={20} />
        </button>
      </div>

      {showShare && <SharePopup product={shareProduct} onClose={() => setShowShare(false)} />}
    </div>
  );
};

export default ProductHeader;

// ===== Styles =====

const headerWrapper = {
  textAlign: 'center',
  marginBottom: '30px',
  fontFamily: `'Georgia', serif`,
};

const nameStyle = {
  fontSize: '32px',
  fontWeight: 'normal',
  color: '#2c2c2c',
};

const priceStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000',
  marginBottom: '4px',
};

const taxInfo = {
  fontSize: '11px',
  color: '#777',
  marginTop: 0,
};

const iconRow = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  marginTop: '20px',
};

const iconBtn = {
  background: 'none',
  border: '1px solid #000',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

// ===== Share Popup Styles =====

const overlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.2)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const popup = {
  background: '#fff',
  padding: '30px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  position: 'relative',
};

const closeBtn = {
  position: 'absolute',
  top: 10,
  right: 10,
  background: '#f5f5f5',
  border: 'none',
  borderRadius: '50%',
  width: 30,
  height: 30,
  cursor: 'pointer',
  fontSize: 18,
};

const popupTitle = {
  fontSize: '18px',
  fontWeight: '600',
  marginBottom: '20px',
  color: '#4a2c17',
  fontFamily: 'serif',
};

const productInfo = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '12px',
  marginBottom: '20px',
};

const productImage = {
  width: 60,
  height: 60,
  objectFit: 'contain',
};

const linkBox = {
  background: '#f5f5f5',
  padding: '10px 14px',
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const urlText = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: '13px',
};

const copyBtn = {
  background: '#7b2424',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 'bold',
  cursor: 'pointer',
};
