import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, resetCart } = useCart();
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'Razorpay'
  const [placingOrder, setPlacingOrder] = useState(false);
  const hasCheckedAddressRef = useRef(false);

  // Runs ONCE on mount only. Deliberately NOT dependent on cartItems —
  // otherwise clearing the cart after a successful order (see placeOrder)
  // re-triggers this effect, finds selectedShippingAddress already removed,
  // and fires a stray "No address selected" redirect that races with the
  // real navigate('/order-success') call.
  useEffect(() => {
    if (hasCheckedAddressRef.current) return;
    hasCheckedAddressRef.current = true;

    const selected = JSON.parse(localStorage.getItem('selectedShippingAddress'));

    if (!selected) {
      toast.error('No address selected. Redirecting...');
      navigate('/checkout/address');
      return;
    }

    setAddress(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keeps the displayed total in sync with the cart. Safe to re-run on
  // cartItems changes since it has no navigation/toast side effects.
  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setAmount(subtotal);
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

  // Creates the order in MongoDB. paymentId is null/undefined for COD orders.
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
      resetCart(); // backend already deleted the cart items during order creation — just sync local state
      localStorage.removeItem('selectedShippingAddress');
      navigate('/order-success', { state: { orderId: order._id } });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Something went wrong placing your order. Please contact support.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // ---- Razorpay flow (unchanged, kept intact for future use) ----
  const handleRazorpayPayment = async () => {
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

  // ---- COD flow (new) ----
  const handleCodOrder = () => {
    placeOrder(null); // no paymentId -> backend marks paymentMethod: 'COD', paymentStatus: 'pending'
  };

  const handlePlaceOrder = () => {
    if (placingOrder) return;
    if (paymentMethod === 'COD') {
      handleCodOrder();
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <div style={pageWrap}>
      <h2 style={{ color: '#7b2424' }}>Confirm & Pay</h2>

      {address && (
        <div style={addressCard}>
          <h3 style={{ marginTop: 0 }}>Shipping To:</h3>
          <p>{address.firstName} {address.lastName}</p>
          <p>{address.address1}, {address.city}, {address.state} - {address.pincode}</p>
          <p>📞 {address.mobile}</p>
          <p>📧 {address.email}</p>
        </div>
      )}

      <h3 style={sectionTitle}>Select Payment Method</h3>
      <div style={methodRow}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setPaymentMethod('COD')}
          style={{ ...methodCard, ...(paymentMethod === 'COD' ? methodCardActive : {}) }}
        >
          <div style={methodIcon}>💵</div>
          <div>
            <div style={methodTitle}>Cash on Delivery</div>
            <div style={methodDesc}>Pay in cash when your order arrives</div>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setPaymentMethod('Razorpay')}
          style={{ ...methodCard, ...(paymentMethod === 'Razorpay' ? methodCardActive : {}) }}
        >
          <div style={methodIcon}>💳</div>
          <div>
            <div style={methodTitle}>Pay Online</div>
            <div style={methodDesc}>UPI, Cards & Netbanking via Razorpay</div>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: '1.5rem' }}>Total: ₹{amount.toLocaleString('en-IN')}</h3>

      <button onClick={handlePlaceOrder} style={payNowBtn} disabled={placingOrder || !address}>
        {placingOrder
          ? 'Placing order...'
          : paymentMethod === 'COD'
          ? 'Place Order (Cash on Delivery)'
          : 'Pay Now'}
      </button>
    </div>
  );
};

const pageWrap = {
  padding: '2rem',
  maxWidth: 560,
  margin: '0 auto',
};

const addressCard = {
  border: '1px solid #ccc',
  padding: '1rem',
  borderRadius: '10px',
  marginBottom: '1.5rem',
  backgroundColor: '#f9f9f9'
};

const sectionTitle = {
  marginBottom: 12,
  color: '#3e0f0f',
};

const methodRow = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
};

const methodCard = {
  flex: '1 1 220px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '16px',
  borderRadius: '12px',
  border: '1.5px solid #e0e0e0',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: '#fff',
};

const methodCardActive = {
  borderColor: '#7b2424',
  backgroundColor: '#fff4f4',
  boxShadow: '0 0 0 3px rgba(123,36,36,0.08)',
};

const methodIcon = {
  fontSize: 26,
};

const methodTitle = {
  fontWeight: 700,
  color: '#3e0f0f',
  fontSize: 15,
};

const methodDesc = {
  fontSize: 13,
  color: '#777',
  marginTop: 2,
};

const payNowBtn = {
  marginTop: '1.5rem',
  width: '100%',
  padding: '14px 24px',
  backgroundColor: '#7b2424',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '16px',
  cursor: 'pointer',
};

export default PaymentPage;