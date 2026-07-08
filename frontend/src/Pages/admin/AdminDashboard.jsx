import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        const res = await fetch(
          "http://localhost:8080/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading...</h2>;
  }

  if (error || !stats) {
    return <h2 style={{ padding: "30px", color: "#c62828" }}>{error || "Something went wrong."}</h2>;
  }

  const recentOrders = stats.recentOrders || [];

  return (
    <div style={container}>
      <h1 style={heading}>Dashboard</h1>

      <div style={cardsContainer}>
        <Card title="Users" value={stats.totalUsers} />
        <Card title="Products" value={stats.totalProducts} />
        <Card title="Orders" value={stats.totalOrders} />
        <Card title="Revenue" value={`₹${stats.totalRevenue}`} />
        <Card title="Pending Orders" value={stats.pendingOrders} />
        <Card title="Delivered" value={stats.deliveredOrders} />
      </div>

      <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
        Recent Orders
      </h2>

      {recentOrders.length === 0 ? (
        <div style={emptyStateStyle}>No recent orders.</div>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="dash-table-view" style={tableContainer}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Order</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={td}>{order.orderNumber}</td>
                    <td style={td}>{order.user?.name}</td>
                    <td style={td}>₹{order.finalAmount}</td>
                    <td style={td}>
                      <StatusBadge status={order.orderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="dash-card-view" style={cardListStyle}>
            {recentOrders.map((order) => (
              <div key={order._id} style={orderCardStyle}>
                <div style={orderCardTopRowStyle}>
                  <span style={monoStyle}>{order.orderNumber}</span>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <div style={{ fontSize: 14, color: "#444" }}>
                  {order.user?.name || "Guest"}
                </div>
                <div style={{ fontWeight: 700 }}>₹{order.finalAmount}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .dash-card-view {
          display: none;
        }

        @media (max-width: 700px) {
          .dash-table-view {
            display: none !important;
          }
          .dash-card-view {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span
    style={{
      padding: "5px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#fff",
      whiteSpace: "nowrap",
      backgroundColor:
        status === "delivered"
          ? "#2e7d32"
          : status === "pending"
          ? "#f39c12"
          : "#1976d2",
    }}
  >
    {status}
  </span>
);

const Card = ({ title, value }) => (
  <div style={card}>
    <h3>{title}</h3>
    <h2>{value}</h2>
  </div>
);

const container = {
  flex: 1,
  padding: "30px",
  boxSizing: "border-box",
  width: "100%",
  overflowX: "hidden",
  background: "#f5f5f5",
  minHeight: "100vh",
};

const heading = {
  marginBottom: "30px",
};

const cardsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  boxSizing: "border-box",
};

const tableContainer = {
  background: "#fff",
  marginTop: "15px",
  borderRadius: "12px",
  padding: "20px",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  boxSizing: "border-box",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 500,
};

const th = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  whiteSpace: "nowrap",
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};

const emptyStateStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "40px 20px",
  marginTop: "15px",
  textAlign: "center",
  color: "#888",
  boxSizing: "border-box",
};

const cardListStyle = {
  flexDirection: "column",
  gap: 12,
  marginTop: "15px",
};

const orderCardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "16px",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const orderCardTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
};

const monoStyle = {
  fontFamily: "monospace",
  fontWeight: 600,
  color: "#6b4e16",
};

export default AdminDashboard;