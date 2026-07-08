import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'http://localhost:8080/api/orders';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending: '#b8860b',
  confirmed: '#0288d1',
  processing: '#1976d2',
  shipped: '#7b1fa2',
  delivered: '#2e7d32',
  cancelled: '#c0392b',
};

const formatLabel = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return { headers: { Authorization: `Bearer ${userInfo?.token}` } };
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_BASE, getAuthHeaders());
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to load orders. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await axios.patch(
        `${API_BASE}/${orderId}/status`,
        { orderStatus: newStatus },
        getAuthHeaders()
      );
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
      if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
      toast.success('Order status updated!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      return;
    }
    setDeletingId(orderId);
    try {
      await axios.delete(`${API_BASE}/${orderId}`, getAuthHeaders());
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);
      toast.success('Order deleted.');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete order.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        order._id.toLowerCase().includes(term) ||
        order.orderNumber?.toLowerCase().includes(term) ||
        order.user?.name?.toLowerCase().includes(term) ||
        order.user?.email?.toLowerCase().includes(term) ||
        order.shippingAddress?.firstName?.toLowerCase().includes(term) ||
        order.shippingAddress?.lastName?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Manage Orders</h1>
          <p style={subtitleStyle}>
            {loading ? 'Loading...' : `${filteredOrders.length} of ${orders.length} order${orders.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={fetchOrders} style={refreshButtonStyle} disabled={loading}>
          ⟳ Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={filtersBarStyle}>
        <input
          type="text"
          placeholder="Search by Order ID or customer name/email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{formatLabel(s)}</option>
          ))}
        </select>
      </div>

      {/* Content states */}
      {loading ? (
        <div style={stateBoxStyle}>
          <div style={spinnerStyle} />
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div style={stateBoxStyle}>
          <p style={{ color: '#c0392b', fontWeight: 600 }}>{error}</p>
          <button onClick={fetchOrders} style={topButtonStyle}>Try Again</button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={stateBoxStyle}>
          <div style={{ fontSize: 48, opacity: 0.4 }}>📦</div>
          <p>
            {orders.length === 0
              ? 'No orders have been placed yet.'
              : 'No orders match your search/filter.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="orders-table-view" style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} style={trStyle}>
                    <td style={tdStyle}>
                      <span style={monoStyle}>{order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600 }}>
                        {order.user?.name || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Guest'}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {order.user?.email || order.shippingAddress?.email}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td style={tdStyle}>{order.items?.length || 0}</td>
                    <td style={tdStyle}>₹{(order.finalAmount ?? order.totalAmount)?.toLocaleString('en-IN')}</td>
                    <td style={tdStyle}>
                      <span style={{
                        ...paymentBadgeStyle,
                        backgroundColor: order.paymentStatus === 'paid' ? '#e8f5e9' : '#fff3e0',
                        color: order.paymentStatus === 'paid' ? '#2e7d32' : '#b8860b',
                      }}>
                        {formatLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={statusCellStyle}>
                        <span style={{
                          ...statusBadgeStyle,
                          backgroundColor: STATUS_COLORS[order.orderStatus] || '#999',
                        }}>
                          {formatLabel(order.orderStatus)}
                        </span>
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={statusSelectStyle}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{formatLabel(s)}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <button style={viewButtonStyle} onClick={() => setSelectedOrder(order)}>
                          View
                        </button>
                        <button
                          style={deleteButtonStyle}
                          disabled={deletingId === order._id}
                          onClick={() => handleDelete(order._id)}
                        >
                          {deletingId === order._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view — same data, no horizontal scroll */}
          <div className="orders-card-view" style={cardListStyle}>
            {filteredOrders.map((order) => (
              <div key={order._id} style={cardStyle}>
                <div style={cardTopRowStyle}>
                  <span style={monoStyle}>
                    {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                  </span>
                  <span style={{
                    ...statusBadgeStyle,
                    backgroundColor: STATUS_COLORS[order.orderStatus] || '#999',
                  }}>
                    {formatLabel(order.orderStatus)}
                  </span>
                </div>

                <div style={cardCustomerStyle}>
                  <div style={{ fontWeight: 600 }}>
                    {order.user?.name || `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Guest'}
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {order.user?.email || order.shippingAddress?.email}
                  </div>
                </div>

                <div style={cardMetaGridStyle}>
                  <div>
                    <div style={cardMetaLabelStyle}>Date</div>
                    <div style={cardMetaValueStyle}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div style={cardMetaLabelStyle}>Items</div>
                    <div style={cardMetaValueStyle}>{order.items?.length || 0}</div>
                  </div>
                  <div>
                    <div style={cardMetaLabelStyle}>Payment</div>
                    <span style={{
                      ...paymentBadgeStyle,
                      backgroundColor: order.paymentStatus === 'paid' ? '#e8f5e9' : '#fff3e0',
                      color: order.paymentStatus === 'paid' ? '#2e7d32' : '#b8860b',
                    }}>
                      {formatLabel(order.paymentStatus)}
                    </span>
                  </div>
                  <div>
                    <div style={cardMetaLabelStyle}>Total</div>
                    <div style={{ ...cardMetaValueStyle, fontWeight: 700 }}>
                      ₹{(order.finalAmount ?? order.totalAmount)?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <select
                  value={order.orderStatus}
                  disabled={updatingId === order._id}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  style={{ ...statusSelectStyle, width: '100%' }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{formatLabel(s)}</option>
                  ))}
                </select>

                <div style={cardActionsStyle}>
                  <button style={{ ...viewButtonStyle, flex: 1 }} onClick={() => setSelectedOrder(order)}>
                    View
                  </button>
                  <button
                    style={{ ...deleteButtonStyle, flex: 1 }}
                    disabled={deletingId === order._id}
                    onClick={() => handleDelete(order._id)}
                  >
                    {deletingId === order._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={popupOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={popupContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedOrder(null)} style={closePopupButton}>×</button>
            <h2 style={{ marginTop: 0 }}>Order {selectedOrder.orderNumber || `#${selectedOrder._id.slice(-8).toUpperCase()}`}</h2>
            <p style={{ color: '#888', marginTop: -8 }}>
              Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
            </p>

            <div style={detailStatusRow}>
              <span style={{
                ...statusBadgeStyle,
                backgroundColor: STATUS_COLORS[selectedOrder.orderStatus] || '#999',
              }}>
                {formatLabel(selectedOrder.orderStatus)}
              </span>
              <select
                value={selectedOrder.orderStatus}
                disabled={updatingId === selectedOrder._id}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                style={statusSelectStyle}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{formatLabel(s)}</option>
                ))}
              </select>
            </div>

            <h3 style={sectionTitleStyle}>Customer</h3>
            <p style={{ margin: '4px 0' }}>
              <b>{selectedOrder.user?.name || 'Guest'}</b> — {selectedOrder.user?.email}
            </p>

            <h3 style={sectionTitleStyle}>Shipping Address</h3>
            <p style={{ margin: '4px 0' }}>
              {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}<br />
              {selectedOrder.shippingAddress?.address1}
              {selectedOrder.shippingAddress?.address2 ? `, ${selectedOrder.shippingAddress.address2}` : ''}<br />
              {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}<br />
              📞 {selectedOrder.shippingAddress?.mobile} &nbsp;•&nbsp; ✉ {selectedOrder.shippingAddress?.email}
            </p>
            <h3 style={sectionTitleStyle}>Order Timeline</h3>

            <div style={{ marginBottom: "20px" }}>
              {selectedOrder.statusHistory?.map((history, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: STATUS_COLORS[history.status] || "#999",
                      }}
                    />

                    {index !== selectedOrder.statusHistory.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          height: 28,
                          backgroundColor: "#ddd",
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {formatLabel(history.status)}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#777",
                      }}
                    >
                      {new Date(history.updatedAt).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={sectionTitleStyle}>Items</h3>
            <div style={itemsListStyle}>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={itemRowStyle}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div style={detailFooterStyle}>
              <div>
                <div style={breakdownRowStyle}>
                  <span>Items Subtotal</span>
                  <span>₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.deliveryCharge > 0 && (
                  <div style={breakdownRowStyle}>
                    <span>Delivery Charge</span>
                    <span>₹{selectedOrder.deliveryCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedOrder.discount > 0 && (
                  <div style={breakdownRowStyle}>
                    <span>Discount</span>
                    <span>−₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
                  Payment: <b>{formatLabel(selectedOrder.paymentStatus)}</b> via {selectedOrder.paymentMethod || 'COD'}
                  {selectedOrder.paymentId ? ` (${selectedOrder.paymentId})` : ''}
                </div>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700 }}>
                Total: ₹{(selectedOrder.finalAmount ?? selectedOrder.totalAmount)?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .orders-card-view {
          display: none;
        }

        @media (max-width: 1024px) {
          h1 { font-size: 26px !important; }
          table { font-size: 13px; }
          button { font-size: 12px; }
          select { font-size: 12px; }

          .orders-table-view {
            display: none !important;
          }
          .orders-card-view {
            display: flex !important;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/* ---------- Styles (matches existing admin theme: gold/brown palette) ---------- */

const pageStyle = {
  width: "100%",
  padding: "24px",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  overflowX: "hidden",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "16px",
  marginBottom: 20, borderBottom: '2px solid #a67c00', paddingBottom: 20,
};

const titleStyle = { margin: 0, color: '#3e0f0f' };
const subtitleStyle = { margin: '4px 0 0', color: '#888', fontSize: 14 };

const refreshButtonStyle = {
  background: '#fff', color: '#a67c00', padding: '10px 20px', borderRadius: 8,
  border: '1.5px solid #a67c00', fontWeight: 'bold', cursor: 'pointer',
};

const topButtonStyle = {
  background: '#a67c00', color: 'white', padding: '12px 24px', borderRadius: 8,
  border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer', marginTop: 12,
};

const filtersBarStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "24px",
  alignItems: "center",
};

const searchInputStyle = {
  width: "100%",
  flex: "1",
  minWidth: "260px", padding: 12, borderRadius: 6, border: '1px solid #ddd', fontSize: 14,
};

const filterSelectStyle = {
  padding: 12, borderRadius: 6, border: '1px solid #ddd', fontSize: 14, minWidth: 170,
  flex: "0 0 180px",
};

const stateBoxStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  padding: '60px 20px', color: '#777', gap: 8, textAlign: 'center',
};

const spinnerStyle = {
  width: 36, height: 36, borderRadius: '50%', border: '4px solid #eee',
  borderTopColor: '#a67c00', animation: 'spin 0.8s linear infinite',
};

const tableWrapperStyle = {
  width: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  borderRadius: 10,
  border: "1px solid #eee",
  boxShadow: "0 2px 8px rgba(0,0,0,.05)",
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: 1000, background: '#fff' };

const thStyle = {
  textAlign: 'left', padding: '14px 16px', background: '#faf6ec', color: '#6b4e16',
  fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid #eee',
  whiteSpace: 'nowrap',
};

const trStyle = { borderBottom: '1px solid #f0f0f0' };

const tdStyle = { padding: '14px 16px', fontSize: 14, color: '#333', verticalAlign: 'top' };

const monoStyle = { fontFamily: 'monospace', fontWeight: 600, color: '#6b4e16' };

const statusCellStyle = { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 150 };

const statusBadgeStyle = {
  color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 12px',
  borderRadius: 20, textTransform: 'uppercase', display: 'inline-block', width: 'fit-content',
};

const paymentBadgeStyle = {
  fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
};

const statusSelectStyle = {
  padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd', fontSize: 13, cursor: 'pointer',
};

const viewButtonStyle = {
  background: '#795548', color: '#fff', padding: '8px 14px', border: 'none',
  borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
};

const deleteButtonStyle = {
  background: '#c62828', color: '#fff', padding: '8px 14px', border: 'none',
  borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
};

const popupOverlay = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
  alignItems: 'center', zIndex: 9999, overflowY: 'auto', overflowX: 'hidden', padding: 20,
  boxSizing: 'border-box',
};

const popupContent = {
  background: '#fff', padding: 30, borderRadius: 15, maxWidth: 700,
  width: "95%",
  boxSizing: 'border-box',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  overflowX: 'hidden',
  position: 'relative', maxHeight: '90vh', overflowY: 'auto',
};

const closePopupButton = {
  position: 'absolute', top: 15, right: 20, background: 'transparent',
  border: 'none', fontSize: 30, cursor: 'pointer', color: '#444',
};

const sectionTitleStyle = { color: '#6b4e16', fontSize: 15, marginBottom: 6, marginTop: 20 };

const detailStatusRow = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, margin: '12px 0' };

const itemsListStyle = {
  borderTop: '1px dashed #ddd', borderBottom: '1px dashed #ddd', padding: '10px 0',
};

const itemRowStyle = {
  display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between',
  fontSize: 14, color: '#444', marginBottom: 6, wordBreak: 'break-word',
};

const detailFooterStyle = {
  display: "flex",
  flexWrap: "wrap", justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 16, gap: 16,
};

const breakdownRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px", justifyContent: 'space-between', fontSize: 13, color: '#555', marginBottom: 2,
};

/* ---------- New styles: mobile card view ---------- */

const cardListStyle = {
  flexDirection: 'column',
  gap: 12,
};

const cardStyle = {
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 2px 8px rgba(0,0,0,.04)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const cardTopRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const cardCustomerStyle = {
  borderTop: '1px dashed #eee',
  paddingTop: 8,
};

const cardMetaGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
  background: "#faf6ec",
  borderRadius: 8,
  padding: 10,
};

const cardMetaLabelStyle = {
  fontSize: 11,
  color: '#a67c00',
  textTransform: 'uppercase',
  fontWeight: 600,
  marginBottom: 2,
};

const cardMetaValueStyle = {
  fontSize: 14,
  color: '#333',
};

const cardActionsStyle = {
  display: 'flex',
  gap: 8,
};

export default ManageOrders;