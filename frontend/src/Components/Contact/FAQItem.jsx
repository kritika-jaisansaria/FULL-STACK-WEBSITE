import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQItem = ({ question, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={box} onClick={() => setOpen(!open)}>
        <span style={questionStyle}>{question}</span>
        <span style={iconStyle}>{open ? <FaMinus /> : <FaPlus />}</span>
      </div>

      {open && (
        <div style={answerBox}>
          {children}
        </div>
      )}
    </div>
  );
};

const box = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px 20px",
  backgroundColor: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
};

const questionStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#7A1E1E",
  textDecoration: "underline",
};

const iconStyle = {
  fontSize: "14px",
  color: "#7A1E1E",
};

const answerBox = {
  border: "1px solid #7A1E1E",
  borderRadius: "8px",
  padding: "16px 20px",
  backgroundColor: "#fff",
  color: "#333",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "8px",
};

export default FAQItem;
