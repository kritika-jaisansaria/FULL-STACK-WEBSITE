import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchCart = async () => {
    if (!userInfo?.token) return;

    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:8080/api/cart', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCartItems(data || []);
    } catch (err) {
      console.error("Cart fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userInfo?.token]);

  const addToCart = async (product, quantity = 1) => {
    if (!userInfo?.token) {
      toast.error('Please login to add items to your cart');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'http://localhost:8080/api/cart/add',
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error(err.response?.data?.message || 'Failed to add to cart. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!userInfo?.token) return;

    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:8080/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
      toast.error(err.response?.data?.message || 'Failed to remove item. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!userInfo?.token) return;

    try {
      setLoading(true);
      await axios.put(
        'http://localhost:8080/api/cart/update',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      await fetchCart();
    } catch (err) {
      console.error("Update quantity failed", err);
      toast.error(err.response?.data?.message || 'Failed to update quantity. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!userInfo?.token) return;

    try {
      setLoading(true);
      await axios.delete('http://localhost:8080/api/cart/clear', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed", err);
      toast.error(err.response?.data?.message || 'Failed to clear cart. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};