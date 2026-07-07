import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false); // full-list loading (initial fetch)
  const [actionLoadingId, setActionLoadingId] = useState(null); // per-product add/remove loading

  const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo"))?.token;
  } catch {
    return null;
  }
};

  // Wipes in-memory wishlist so one user's data never leaks into another
  // user's session on the same browser (e.g. after logout).
  const clearWishlist = () => setWishlist([]);

  const fetchWishlist = async () => {
    const token = getToken();
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const products = res.data.map(item => item.product).filter(Boolean);
      setWishlist(products);
    } catch (err) {
      if (err.response?.status === 401) {
        clearWishlist();
      } else if (!err.response) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to load wishlist. Please try again.');
      }
      console.error('Failed to fetch wishlist:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isWishlisted = (productId) => wishlist.some(item => item._id === productId);

  const toggleWishlist = async (product) => {
    const token = getToken();
    if (!token) {
      toast.error('Please login to use wishlist.');
      return;
    }

    const exists = isWishlisted(product._id);
    setActionLoadingId(product._id);

    try {
      if (exists) {
        await axios.delete(`http://localhost:8080/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(prev => prev.filter(item => item._id !== product._id));
        toast.success('Removed from wishlist');
      } else {
        const res = await axios.post(
          'http://localhost:8080/api/wishlist',
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fullProduct = res.data.product;
        setWishlist(prev => (prev.some(i => i._id === fullProduct._id) ? prev : [...prev, fullProduct]));
        toast.success('Added to wishlist');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        clearWishlist();
      } else if (err.response?.status === 400) {
        // Already wishlisted (duplicate) — keep UI in sync instead of erroring.
        toast.info('This item is already in your wishlist');
        await fetchWishlist();
      } else if (!err.response) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
      console.error('Wishlist error:', err.response?.data?.message || err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeFromWishlist = async (productId) => {
    const product = wishlist.find(item => item._id === productId);
    if (product) await toggleWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        actionLoadingId,
        toggleWishlist,
        removeFromWishlist,
        isWishlisted,
        fetchWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};