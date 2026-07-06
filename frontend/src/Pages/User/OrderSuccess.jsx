import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={container}>
      <div style={checkCircle}>✓</div>
      <h1 style={heading}>Order Placed Successfully!</h1>
      <p style={subtext}>
        Thank you for shopping with us. Your order has been confirmed
        {orderId && <> — Order ID: <strong>{orderId}</strong></>}.
      </p>
      <div style={buttonRow}>
        <Link to="/account" style={primaryBtn}>View My Orders</Link>
        <Link to="/all-jewellery" style={secondaryBtn}>Continue Shopping</Link>
      </div>
    </div>
  );
};

const container = {
  minHeight: '60vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1rem',
  textAlign: 'center',
};

const checkCircle = {
  width: 70,
  height: 70,
  borderRadius: '50%',
  backgroundColor: '#2e7d32',
  color: '#fff',
  fontSize: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
};

const heading = {
  color: '#7b2424',
  fontSize: '28px',
  marginBottom: '0.8rem',
};

const subtext = {
  color: '#555',
  fontSize: '16px',
  marginBottom: '2rem',
  maxWidth: 480,
};

const buttonRow = {
  display: 'flex',
  gap: '1rem',
};

const primaryBtn = {
  padding: '12px 28px',
  backgroundColor: '#7b2424',
  color: '#fff',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '700',
};

const secondaryBtn = {
  padding: '12px 28px',
  backgroundColor: '#fff',
  color: '#7b2424',
  border: '1.5px solid #7b2424',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '700',
};

export default OrderSuccess;