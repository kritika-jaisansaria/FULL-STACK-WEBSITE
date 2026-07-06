import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I redeem Encircle Points?",
      answer: (
        <>
          <p>
            <strong>Offline Redemption:</strong> Provide your registered mobile number during billing at Tanishq, Goldplus, Zoya, and other outlets. OTP is mandatory to redeem points at the store.
          </p>
          <p>
            <strong>Online Redemption:</strong> Available only for <strong>login/sign</strong> users. After OTP verification, points can be redeemed at checkout.
          </p>
        </>
      ),
    },
    {
      question: "Do I need to pay shipping / delivery charges?",
      answer: (
        <p>
          We offer free shipping for all domestic orders. For international deliveries, charges are calculated based on destination and product weight.
        </p>
      ),
    },
    {
      question: "Can I send gifts to my loved ones?",
      answer: (
        <p>
          Yes, you can mark your order as a gift and include a personal message during checkout. We offer premium gift-wrapping options.
        </p>
      ),
    },
    {
      question: "What happens if my order is lost in transit?",
      answer: (
        <p>
          If your order is delayed or lost, contact our support team. We’ll trace the package and initiate a replacement or refund promptly.
        </p>
      ),
    },
    {
      question: "Questions on Cash On Delivery (COD)",
      answer: (
        <p>
          COD is available for selected pin codes in India. You can check COD availability on the product or checkout page.
        </p>
      ),
    },
    {
      question: "Questions on Tokenization",
      answer: (
        <p>
          Tokenization ensures secure payments by replacing card data with encrypted tokens. It's enabled for all card transactions on our site.
        </p>
      ),
    },
  ];

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={container}>
      <div style={headerRow}>
        <h2 style={heading}>Top Customer Questions</h2>
        <a href="/faqs" style={allFaqsLink}>ALL FAQ'S</a>
      </div>

      {faqs.map((faq, index) => (
        <div key={index} style={{ paddingBottom: "16px" }}>
          <div style={questionBox} onClick={() => toggleOpen(index)}>
            <span style={questionStyle}>{faq.question}</span>
            <span style={iconStyle}>
              {openIndex === index ? <FaMinus /> : <FaPlus />}
            </span>
          </div>

          <div
            style={{
              ...answerBox,
              maxHeight: openIndex === index ? "500px" : "0px",
              padding: openIndex === index ? "16px 20px" : "0 20px",
            }}
          >
            <div style={{ opacity: openIndex === index ? 1 : 0, transition: "opacity 0.3s ease" }}>
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const container = {
  padding: "40px 10%", // matches contact section width
  backgroundColor: "#fff",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const heading = {
  fontSize: "22px",
  color: "#000",
};

const allFaqsLink = {
  color: "#7A1E1E",
  fontWeight: "600",
  fontSize: "18px",
  textDecoration: "none",
};

const questionBox = {
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
  fontSize: "18px",
  fontWeight: "600",
  color: "#7A1E1E",
};

const iconStyle = {
  fontSize: "14px",
  color: "#7A1E1E",
};

const answerBox = {
  overflow: "hidden",
  backgroundColor: "#fff",

  borderRadius: "8px",
  color: "#333",
  marginBottom: "0",
  fontSize: "18px",
  lineHeight: "1.6",
  transition: "all 0.4s ease",
};

export default FAQSection;
