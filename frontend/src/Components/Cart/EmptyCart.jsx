import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <img src="/empty-cart.png" alt="Empty Cart" width="200" />
      <h2>Your cart is empty 🛒</h2>
      <button onClick={() => navigate('/all-jewellery')}>Shop Now</button>
    </div>
  );
};

export default EmptyCart;
