import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import {
  FaUser,
  FaUserCircle,
  FaSearch,
  FaShoppingBag,
  FaHeart,
} from 'react-icons/fa';
import logo from '../../assets/images/logo.webp';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 80px',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaSearch />
        <input placeholder="Search" style={{ padding: 8, width: 250 }} />
      </div>

      {/* Logo */}
      <img src={logo} alt="logo" style={{ height: 50 }} />

      {/* Icons */}
      <div style={{ display: 'flex', gap: 30, fontSize: 20, position: 'relative' }}>
        {/* Login / User */}
        {!user ? (
          <FaUser
            style={{ cursor: 'pointer' }}
            onClick={() =>
              navigate('/login', {
                state: { background: location }, // 🔥 IMPORTANT
              })
            }
          />
        ) : (
          <div>
            <FaUserCircle
              style={{ cursor: 'pointer' }}
              onClick={() => setShowDropdown(!showDropdown)}
            />

            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  background: '#fff',
                  border: '1px solid #ddd',
                  width: 180,
                  zIndex: 1000,
                }}
              >
                <p style={{ padding: 10 }}>
                  {user.name} ({user.role})
                </p>
                <p
                  style={{ padding: 10, cursor: 'pointer' }}
                  onClick={() => navigate('/account')}
                >
                  My Account
                </p>
                <p
                  style={{ padding: 10, cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wishlist */}
        <FaHeart style={{ cursor: 'pointer' }} onClick={() => navigate('/wishlist')} />

        {/* Cart */}
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => navigate('/cart')}
        >
          <FaShoppingBag />
          {cartItems?.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -5,
                right: -10,
                background: 'red',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: 12,
              }}
            >
              {cartItems.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
