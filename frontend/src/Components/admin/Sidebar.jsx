import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      setOpen(!isMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const linkStyle = ({ isActive }) => ({
    padding: "12px 15px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#fff",
    background: isActive ? "#7b2424" : "transparent",
    fontWeight: isActive ? "700" : "500",
    transition: "0.25s",
  });

  return (
    <>
      {mobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            top: 15,
            left: 15,
            zIndex: 2000,
            background: "#7b2424",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      )}

      {mobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            zIndex: 999,
          }}
        />
      )}

      <div
        style={{
          position: mobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          height: "100vh",
          width: 240,
          boxSizing: "border-box",
          background: "#2f2f2f",
          color: "#fff",
          padding: "25px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          transform:
            mobile && !open ? "translateX(-100%)" : "translateX(0)",
          transition: ".3s",
          zIndex: 1000,
        }}
      >
        <h2 style={{ marginBottom: "25px" }}>Admin Panel</h2>

        <NavLink
          to="/admin"
          end
          style={linkStyle}
          onClick={() => mobile && setOpen(false)}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          style={linkStyle}
          onClick={() => mobile && setOpen(false)}
        >
          👥 Users
        </NavLink>

        <NavLink
          to="/admin/products"
          style={linkStyle}
          onClick={() => mobile && setOpen(false)}
        >
          💍 Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          style={linkStyle}
          onClick={() => mobile && setOpen(false)}
        >
          📦 Orders
        </NavLink>

        <div style={{ flex: 1 }} />

        <NavLink
          to="/"
          style={{
            color: "#d4af37",
            textDecoration: "none",
            padding: "12px 15px",
          }}
        >
          ← Back to Home
        </NavLink>
      </div>
    </>
  );
};

export default AdminSidebar;