import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // current step in checkout

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const handleAddAddress = () => {
    setStep(2); // Fill step 2
    navigate('/address'); // Navigate to address page
  };

  return (
    <div style={{   width: '100%',maxWidth: '440px',  margin: '0 auto', fontFamily: 'Poppins, sans-serif' }}>
      {/* STEP INDICATOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        {['BAG', 'ADDRESS', 'PAYMENT'].map((label, index) => {
          const stepNum = index + 1;
          const isActive = step >= stepNum;
          return (
            <div key={label} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 32,
                height: 32,
                margin: '0 auto',
                borderRadius: '50%',
                backgroundColor: isActive ? '#7b2424' : '#ccc',
                color: '#fff',
                lineHeight: '32px',
                fontWeight: 'bold'
              }}>
                {stepNum}
              </div>
              <div style={{ marginTop: 6, color: isActive ? '#7b2424' : '#999', fontSize: 14 }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* ORDER SUMMARY */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e2e2',
        borderRadius: '12px',
        padding: '1.5rem',
        color: '#2c2c2c'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1.2rem' }}>ORDER SUMMARY</h3>

        <div style={rowStyle}>
          <span>Subtotal</span>
          <span style={{ color: '#7b2424' }}>₹{subtotal.toLocaleString()}</span>
        </div>

        <div style={rowStyle}>
          <span>Shipping</span>
          <span style={{ color: '#7b2424' }}>Free</span>
        </div>

        <hr style={{ margin: '1rem 0' }} />

        <div style={{ ...rowStyle, fontWeight: 'bold', fontSize: '16px' }}>
          <span>Total</span>
          <span style={{ color: '#2c2c2c' }}>₹{subtotal.toLocaleString()}</span>
        </div>

        <button
          onClick={() => navigate('/checkout/address')}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            maxWidth: '720px', 
            padding: '12px',
            backgroundColor: '#7b2424',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
            letterSpacing: '0.5px',
          }}
        >
          Add Address
        </button>
      </div>
    </div>
  );
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.8rem',
  fontSize: '15px',
};

export default CartSummary;