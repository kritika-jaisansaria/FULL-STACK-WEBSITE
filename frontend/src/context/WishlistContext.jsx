import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.token;
  };

  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:8080/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const products = res.data.map(item => item.product);
      setWishlist(products);
    } catch (err) {
      console.error('❌ Failed to fetch wishlist:', err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleWishlist = async (product) => {
    console.log("🖤 toggleWishlist called with product:", product);
    console.log("🖤 product._id:", product._id);

    const token = getToken();
    if (!token) {
      alert('Please login to use wishlist.');
      return;
    }

    const exists = isWishlisted(product._id);

    try {
      if (exists) {
        console.log(`🗑️ Removing product with _id: ${product._id}`);
        await axios.delete(`http://localhost:8080/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setWishlist(prev => prev.filter(item => item._id !== product._id));
        toast.info("❌ Removed from wishlist");
      } else {
        console.log(`➕ Adding product with _id: ${product._id}`);
        const res = await axios.post(
          'http://localhost:8080/api/wishlist',
          { productId: product._id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fullProduct = res.data.product;
        console.log("➕ Product added to wishlist response:", fullProduct);

        setWishlist(prev => [...prev, fullProduct]);
        toast.success("💖 Added to wishlist");
      }
    } catch (err) {
      console.error("❌ Wishlist error:", err.response?.data?.message || err.message);
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
