import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const API = "http://localhost:8080";

// Returns the latest logged-in user every time.
// This avoids stale localStorage values after login/logout.
const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem("userInfo"));
  } catch {
    return null;
  }
};

const getCartErrorMessage = (err, fallback) => {
  if (!err.response) {
    return "Network error. Please check your connection.";
  }

  const { status, data } = err.response;

  if (status === 401) {
    localStorage.removeItem("userInfo");
    return "Your session has expired. Please login again.";
  }

  if (status === 404) {
    return data?.message || "Item not found.";
  }

  if (status >= 500) {
    return "Something went wrong. Please try again later.";
  }

  return data?.message || fallback;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchCart = async () => {
    const userInfo = getUserInfo();

    if (!userInfo?.token) {
      setCartItems([]);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`${API}/api/cart`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setCartItems(data || []);
    } catch (err) {
      console.error("Fetch Cart Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("userInfo");
        setCartItems([]);
      }

      toast.error(getCartErrorMessage(err, "Failed to load cart."));
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    const userInfo = getUserInfo();

    if (!userInfo?.token) {
      toast.error("Please login to add items to cart.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API}/api/cart/add`,
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Add Cart Error:", err);

      toast.error(getCartErrorMessage(err, "Failed to add to cart."));

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const userInfo = getUserInfo();

    if (!userInfo?.token) return;

    try {
      setLoading(true);

      await axios.put(
        `${API}/api/cart/update`,
        {
          productId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Update Cart Error:", err);

      toast.error(getCartErrorMessage(err, "Failed to update quantity."));

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const userInfo = getUserInfo();

    if (!userInfo?.token) return;

    try {
      setLoading(true);

      await axios.delete(`${API}/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      await fetchCart();
    } catch (err) {
      console.error("Remove Cart Error:", err);

      toast.error(getCartErrorMessage(err, "Failed to remove item."));

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const userInfo = getUserInfo();

    if (!userInfo?.token) return;

    try {
      setLoading(true);

      await axios.delete(`${API}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setCartItems([]);
    } catch (err) {
      console.error("Clear Cart Error:", err);

      toast.error(getCartErrorMessage(err, "Failed to clear cart."));

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetCart = () => {
  setCartItems([]);
  setInitialLoad(false);
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        initialLoad,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};