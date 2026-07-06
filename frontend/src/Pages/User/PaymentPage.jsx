import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem('selectedShippingAddress'));

    if (!selected) {
      toast.error('No address selected. Redirecting...');
      navigate('/checkout/address');
      return;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setAmount(subtotal);
    setAddress(selected);
  }, [cartItems]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async (paymentId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    try {
      setPlacingOrder(true);
      const res = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
        body: JSON.stringify({ shippingAddress: address, paymentId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to place order');
      }

      const order = await res.json();
      await clearCart();
      localStorage.removeItem('selectedShippingAddress');
      navigate('/order-success', { state: { orderId: order._id } });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong placing your order. Please contact support.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Failed to load Razorpay script');
      return;
    }

    const options = {
      key: 'rzp_test_YourKeyHere', // ✅ replace with your Razorpay Test Key
      amount: amount * 100, // Razorpay needs amount in paise
      currency: 'INR',
      name: 'Navkar Jewellers',
      description: 'Jewellery Order',
      prefill: {
        name: `${address.firstName} ${address.lastName}`,
        email: address.email,
        contact: address.mobile
      },
      notes: {
        address: `${address.address1}, ${address.city}, ${address.state} - ${address.pincode}`
      },
      handler: function (response) {
        placeOrder(response.razorpay_payment_id);
      },
      theme: { color: '#7b2424' }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#7b2424' }}>Confirm & Pay</h2>
      {address && (
        <div style={addressCard}>
          <h3>Shipping To:</h3>
          <p>{address.firstName} {address.lastName}</p>
          <p>{address.address1}, {address.city}, {address.state} - {address.pincode}</p>
          <p>📞 {address.mobile}</p>
          <p>📧 {address.email}</p>
        </div>
      )}
      <h3>Total: ₹{amount.toLocaleString('en-IN')}</h3>
      <button onClick={handlePayment} style={payNowBtn} disabled={placingOrder}>
        {placingOrder ? 'Placing order...' : 'Pay Now'}
      </button>
    </div>
  );
};

const addressCard = {
  border: '1px solid #ccc',
  padding: '1rem',
  borderRadius: '10px',
  marginBottom: '1.5rem',
  backgroundColor: '#f9f9f9'
};

const payNowBtn = {
  padding: '12px 24px',
  backgroundColor: '#7b2424',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '16px',
  cursor: 'pointer'
};

export default PaymentPage;