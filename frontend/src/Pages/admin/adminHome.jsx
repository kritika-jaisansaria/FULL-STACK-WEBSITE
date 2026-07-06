import React, { useEffect, useState } from 'react';
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
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <Outlet />
    </div>
  );
};

export default AdminHome;
