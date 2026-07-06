import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import WishlistItem from './WishlistItem';

const WishlistList = () => {
  const { wishlist } = useWishlist();

  return (
    <div style={container}>
      {wishlist.length === 0 ? (
        <p style={{ padding: 20 }}>No items in wishlist.</p>
      ) : (
        <>
          <h2 style={title}>
            My Wishlist <span style={count}>({wishlist.length})</span>
          </h2>
          <div style={grid}>
            {wishlist.map(product => (
              <WishlistItem key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistList;

// --- styles
const container = {
  padding: '40px 150px',
};

const title = {
  fontSize: '34px',
  fontWeight: '600',
  marginBottom: '30px',
  color: '#7b2424', // match your site's theme
  paddingLeft:'100px'
};

const count = {
  fontSize: '16px',
  color: '#888',
};

const grid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '30px',
  justifyContent: 'center', // Center the 3 per row
};
