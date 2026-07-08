import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingOrder = location.state?.order;
const orderId = location.state?.orderId || existingOrder?._id;
console.log(JSON.stringify(location.state, null, 2));
console.log(orderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      try {
        const res = await fetch(`http://localhost:8080/api/orders/mine/${orderId}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch order');
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        toast.error('Could not load order details, but your order was placed.');
      } finally {
        setLoading(false);
      }
    };
if (existingOrder) {
  setOrder(existingOrder);
  setLoading(false);
  return;
}
    fetchOrder();
  }, [orderId, existingOrder]);

  // No order reference at all — user probably landed here directly.
  if (!orderId) {
    return (
      <div style={container}>
        <div style={checkCircle}>!</div>
        <h1 style={heading}>No Recent Order Found</h1>
        <p style={subtext}>
          We couldn't find a recent order to show. If you just placed one, check My Orders below.
        </p>
        <div style={buttonRow}>
          <Link to="/account" style={primaryBtn}>Go to My Orders</Link>
          <Link to="/all-jewellery" style={secondaryBtn}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <div style={checkCircleWrap}>
        <div style={checkCircle} className="order-success-pulse">✓</div>
      </div>

      <h1 style={heading}>Your Order Has Been Placed!</h1>
      <p style={subtext}>
        Thank you for shopping with us. We've received your order and it's being processed.
      </p>
      <p
  style={{
    color: "#777",
    marginTop: "-8px",
    marginBottom: "24px",
    maxWidth: "500px",
  }}
>
  We've sent your order confirmation and our team will start processing your order shortly.
</p>

      {loading ? (
        <div style={detailsCard}>
          <p style={{ color: '#888', margin: 0 }}>Loading order details...</p>
        </div>
      ) : order ? (
        <div style={detailsCard}>
          <div style={detailRow}>
            <span style={detailLabel}>Order Number</span>
            <span style={detailValue}>{order.orderNumber}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Total Amount</span>
            <span style={detailValue}>₹{(order.finalAmount ?? order.totalAmount)?.toLocaleString('en-IN')}</span>
          </div>
          <div style={detailRow}>
            <span style={detailLabel}>Payment Method</span>
            <span style={detailValue}>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</span>
          </div>
          <div style={detailRow}>
  <span style={detailLabel}>Payment Status</span>

  <span
    style={{
      ...detailValue,
      color:
        order.paymentStatus === "paid"
          ? "#2e7d32"
          : "#b8860b",
    }}
  >
    {order.paymentStatus.charAt(0).toUpperCase() +
      order.paymentStatus.slice(1)}
  </span>
</div>
          {order.estimatedDelivery && (
            <div style={detailRow}>
              <span style={detailLabel}>Estimated Delivery</span>
              <span style={detailValue}>
                {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div style={detailsCard}>
          <p style={{ color: '#888', margin: 0 }}>
            Order ID: <strong>{orderId}</strong>
          </p>
        </div>
      )}

      <div style={buttonRow}>
        <Link to="/account" style={primaryBtn}>My Orders</Link>
        <Link to="/all-jewellery" style={secondaryBtn}>Continue Shopping</Link>
      </div>

      <style>{`
        @keyframes order-success-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        .order-success-pulse {
          animation: order-success-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

const container = {
  minHeight: '65vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem 1rem',
  textAlign: 'center',
};

const checkCircleWrap = {
  marginBottom: '1.5rem',
};

const checkCircle = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  backgroundColor: '#2e7d32',
  color: '#fff',
  fontSize: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(46,125,50,0.3)',
};

const heading = {
  color: '#7b2424',
  fontSize: '28px',
  marginBottom: '0.6rem',
};

const subtext = {
  color: '#555',
  fontSize: '16px',
  marginBottom: '1.75rem',
  maxWidth: 480,
};

const detailsCard = {
  width: '100%',
  maxWidth: 420,
  backgroundColor: '#fff',
  border: '1px solid #eee',
  borderRadius: '14px',
  padding: '20px 24px',
  marginBottom: '2rem',
  boxShadow: '0 4px 18px rgba(0,0,0,0.05)',
  textAlign: 'left',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px dashed #eee',
};

const detailLabel = {
  color: '#888',
  fontSize: 14,
};

const detailValue = {
  color: '#3e0f0f',
  fontWeight: 700,
  fontSize: 15,
};

const buttonRow = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
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