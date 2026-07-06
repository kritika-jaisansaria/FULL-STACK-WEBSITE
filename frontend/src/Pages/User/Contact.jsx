import React from "react";
import ContactOptions from "../../Components/Contact/ContactOptions";
import FAQSection from "../../Components/Contact/FAQSection";
const Contact = () => {
  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <span>Home</span> <span style={{ margin: "0 6px" }}>|</span>{" "}
        <span style={{ color: "#7A1E1E", fontWeight: 500 }}>Help & Contact</span>
      </div>

      {/* Title */}
      <h1 style={titleStyle}>Help & Contact</h1>

      {/* Contact Options */}
      <ContactOptions />
      <FAQSection />
    </div>
  );
};

const breadcrumbStyle = {
  fontSize: "14px",
  color: "#555",
  marginLeft: "50px",
  marginTop: "20px",
};

const titleStyle = {
  textAlign: "center",
  color: "#7A1E1E",
  fontSize: "34px",
  fontWeight: "600",
  marginBottom: "30px",
};

export default Contact;
