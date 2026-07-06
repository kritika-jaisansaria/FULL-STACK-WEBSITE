import React from "react";

const ContactCard = ({ icon, title, detail, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" style={cardStyle}>
      <div style={iconStyle}>{icon}</div>
      <h3 style={titleStyle}>{title}</h3>
      {detail && <p style={detailStyle}>{detail}</p>}
    </a>
  );
};

const cardStyle = {
  flex: 1,
  textAlign: "center",
  padding: "40px 20px",
  textDecoration: "none",
  color: "#7A1E1E",
  borderRight: "1px solid #ddd",
};

const iconStyle = {
  fontSize: "32px",
  marginBottom: "12px",
  color: "#7A1E1E",
};

const titleStyle = {
  fontSize: "18px",
  fontWeight: 600,
  marginBottom: "5px",
};

const detailStyle = {
  fontSize: "14px",
  color: "#333",
};

export default ContactCard;
