import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../Components/admin/Sidebar';

const AdminHome = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.role === 'admin') {
        setAdminInfo(user);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
    setCheckingAuth(false);
  }, [navigate]);

  if (checkingAuth) return null; // Optional: Add loader


   return (
  <div
    style={{
      display: "flex",
      minHeight: "100vh",
      background: "#f5f5f5",
    }}
  >
    <AdminSidebar />

    <main
      style={{
        flex: 1,
        minWidth: 0,
        overflowX: "auto",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <Outlet />
    </main>
  </div>
);
};

export default AdminHome;
