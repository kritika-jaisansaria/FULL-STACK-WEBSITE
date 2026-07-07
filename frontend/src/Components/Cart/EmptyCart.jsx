import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div style={wrapper}>
      <img src="/empty-cart.png" alt="Empty Cart" width="180" style={{ opacity: 0.9 }} />
      <h2 style={heading}>Your cart is empty</h2>
      <p style={subtext}>Looks like you haven't added anything to your cart yet.</p>
      <button style={shopBtn} onClick={() => navigate('/all-jewellery')}>
        Continue Shopping
      </button>
    </div>
  );
};

const wrapper = {
  textAlign: 'center',
  padding: '5rem 1.5rem',
  maxWidth: 420,
  margin: '0 auto',
};

const heading = {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#2c2c2c',
  margin: '1.5rem 0 0.5rem',
};

const subtext = {
  color: '#777',
  fontSize: '0.95rem',
  marginBottom: '1.75rem',
};

const shopBtn = {
  padding: '12px 32px',
  backgroundColor: '#7b2424',
  color: '#fff',
  border: 'none',
  borderRadius: 30,
  fontWeight: 600,
  fontSize: '15px',
  cursor: 'pointer',
  letterSpacing: '0.5px',
};

export default EmptyCart;