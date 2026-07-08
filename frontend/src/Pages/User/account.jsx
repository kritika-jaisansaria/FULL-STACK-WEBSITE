import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const STATUS_COLORS = {
  pending: '#b8860b',
  confirmed: '#0288d1',
  processing: '#1976d2',
  shipped: '#7b1fa2',
  delivered: '#2e7d32',
  cancelled: '#c0392b',
};

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo?.token) {
      toast.error('Please login to view your account');
      navigate('/');
      return;
    }

    setUser(userInfo);
    fetchOrders(userInfo.token);
  }, []);

  const fetchOrders = async (token) => {
    try {
      const res = await fetch('http://localhost:8080/api/orders/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load your orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={pageContainer}>
      <div style={headerRow}>
        <h1 style={heading}>My Account</h1>
        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </div>

      <div style={sectionCard}>
        <h2 style={sectionHeading}>Personal Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div style={sectionCard}>
        <h2 style={sectionHeading}>My Orders</h2>

        {loading ? (
          <p style={mutedText}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p style={mutedText}>You haven't placed any orders yet.</p>
        ) : (
          <div style={ordersList}>
            {orders.map(order => (
              <div key={order._id} style={orderCard}>
                <div style={orderCardHeader}>
                  <div>
                    <div>
  <p style={orderIdText}>
    Order {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
  </p>

  <p style={orderDateText}>
    {new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}
  </p>

  <p style={orderDateText}>
    Payment: {order.paymentMethod}
  </p>

  {order.estimatedDelivery && (
    <p style={orderDateText}>
      Delivery by{" "}
      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}
    </p>
  )}
</div>
                  </div>
                  <span style={{ ...statusBadge, backgroundColor: STATUS_COLORS[order.orderStatus] || '#999' }}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                <div style={itemsList}>
                  {order.items.map((item, i) => (
                    <div key={i} style={itemRow}>
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div style={orderFooter}>
                  <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "12px",
  }}
>
  <button
    style={viewBtn}
    onClick={() => navigate(`/orders/${order._id}`)}
  >
    View Details
  </button>
</div>
                  <span>Total</span>
                  <span style={{ fontWeight: 700 }}>₹{(order.finalAmount ?? order.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const pageContainer = {
  padding: '40px 20px',
  maxWidth: '800px',
  margin: 'auto',
  fontFamily: "'Inter', sans-serif",
};

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
};

const heading = {
  fontSize: '32px',
  color: '#3e0f0f',
  margin: 0,
};

const logoutBtn = {
  padding: '10px 20px',
  backgroundColor: '#fff',
  color: '#7b2424',
  border: '1.5px solid #7b2424',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const sectionCard = {
  backgroundColor: '#fff',
  border: '1px solid #eee',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};

const sectionHeading = {
  borderBottom: '1px solid #eee',
  paddingBottom: '12px',
  marginBottom: '16px',
  color: '#3e0f0f',
  fontSize: '20px',
};

const mutedText = {
  color: '#777',
};

const ordersList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const orderCard = {
  border: '1px solid #eee',
  borderRadius: '10px',
  padding: '16px',
  backgroundColor: '#fafafa',
};

const orderCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '12px',
};

const orderIdText = {
  fontWeight: 700,
  margin: 0,
  color: '#333',
};

const orderDateText = {
  fontSize: '13px',
  color: '#888',
  margin: '2px 0 0',
};

const statusBadge = {
  color: '#fff',
  fontSize: '12px',
  fontWeight: 700,
  padding: '4px 12px',
  borderRadius: '20px',
  textTransform: 'uppercase',
};

const itemsList = {
  borderTop: '1px dashed #ddd',
  borderBottom: '1px dashed #ddd',
  padding: '10px 0',
  marginBottom: '10px',
};

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#444',
  marginBottom: '4px',
};

const orderFooter = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '15px',
  color: '#3e0f0f',
};
const viewBtn = {
  padding: "8px 16px",
  background: "#7b2424",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

export default Account;