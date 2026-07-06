import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const images = product.media?.filter(item => item.type === 'image') || [];
  const firstImage = images[0]?.url || "https://via.placeholder.com/300x300?text=No+Image";
  const secondImage = images[1]?.url || firstImage;

 const toggleLike = (e) => {
  e.stopPropagation();
   const wishlistProduct = {
    _id: product._id,
    name: product.name,
    price: product.price,
    media: product.media,
  };

  toggleWishlist(wishlistProduct);
};

  return (
    <div
      style={cardStyle}
      onClick={() => navigate(`/product/${product._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={imageContainer}>
        {/* First Image */}
        <img src={firstImage} alt={product.name} style={imageStyle} />

        {/* Second Image - slides in from right on hover */}
        <img
          src={secondImage}
          alt="hover"
          style={{
            ...imageStyle,
            position: 'absolute',
            top: 0,
            left: isHovered ? 0 : '100%',
            transition: 'left 0.6s ease',
            zIndex: 2,
            borderRadius: '10px',
          }}
        />

        {/* Like Icon */}
        <div style={heartIconWrapper}>
         <div onClick={toggleLike}>
  {isWishlisted(product._id) ? (
  <FaHeart style={heartIconFilled} />
) : (
  <FaRegHeart style={heartIcon} />
)}

</div>

        </div>
      </div>

      <h3 style={nameStyle}>{product.name}</h3>
      <p style={priceStyle}>₹ {product.price}</p>
    </div>
  );
};

export default ProductCard;

// Styles (same as before, just for reference)

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  fontFamily: `'Georgia', serif`,
  transition: 'transform 0.2s ease',
};

const imageContainer = {
  position: 'relative',
  width: '100%',
  height: '350px',
  overflow: 'hidden',
  borderRadius: '10px',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '10px',
};

const heartIconWrapper = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#ffffffcc',
  borderRadius: '50%',
  padding: '6px',
  zIndex: 3,
};

const heartIcon = {
  color: '#888',
  fontSize: '18px',
  cursor: 'pointer',
};

const heartIconFilled = {
  color: '#d00',
  fontSize: '18px',
  cursor: 'pointer',
};

const nameStyle = {
  fontSize: '17px',
  fontWeight: '500',
  margin: '16px 0 4px',
  color: '#333',
};

const priceStyle = {
  fontSize: '17px',
  fontWeight: 'bold',
  color: '#000',
  margin: 0,
};
