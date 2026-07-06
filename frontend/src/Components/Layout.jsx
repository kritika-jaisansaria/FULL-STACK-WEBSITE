// src/components/Layout.jsx
import React from 'react';
import Header from './Home/index';
import Navbar from './Home/navbar';
import Footer from './Home/Footer';  
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div style={{ minHeight: '80vh' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
