// src/Components/admin/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: '#333',
      color: 'white',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <h2>Admin Panel</h2>
      <Link to="/admin/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>Users</Link>
      <Link to="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
      <Link to="/admin/orders" style={{ color: 'white', textDecoration: 'none' }}>Orders</Link>
      <Link to="/" style={{ color: '#b8860b', marginTop: 'auto' }}>← Back to Home</Link>
    </div>
  );
};

export default AdminSidebar;
