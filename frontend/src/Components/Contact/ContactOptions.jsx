import React from "react";
import ContactCard from "./ContactCard";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const ContactOptions = () => {
  return (
    <div style={wrapper}>
      <h2 style={subtitle}>Have A Question</h2>
      <div style={cardRow}>
        <ContactCard
          icon={<FaWhatsapp />}
          title="Chat with Us"
          detail=""
          link="https://wa.me/6367533573"
        />
        <ContactCard
          icon={<FaPhoneAlt />}
          title="Call Us At"
          detail="1800-266-0123"
          link="tel:18002660123"
        />
        <ContactCard
          icon={<FaEnvelope />}
          title="Write to Us"
          detail=""
          link="mailto:jaisansariakritika8@gmail.com"
        />
      </div>
      <p style={noteStyle}>
        The toll free number is only applicable for domestic orders within India. For international
        customers or deliveries please reach us out through whatsapp, Live chat or email.
      </p>
    </div>
  );
};

const wrapper = {
  backgroundColor: "#fcfcfc",
  padding: "20px 10%",
  borderRadius: "6px",
};

const subtitle = {
  textAlign: "center",
  fontSize: "24px",
  marginBottom: "30px",
  color: "#000",
};

const cardRow = {
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid #eee",
  borderBottom: "1px solid #eee",
};

const noteStyle = {
  textAlign: "center",
  fontSize: "19px",
  color: "#333",
  marginTop: "30px",
  maxWidth: "80%",
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: "1.6",
};

export default ContactOptions;
