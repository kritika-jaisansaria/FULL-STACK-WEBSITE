import React from 'react';
import './ConnectSection.css'; // ✅ tImport he CSS file
import storeImage from '../../assets/images/store.png';
import { FaWhatsapp, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const ConnectSection = () => {
  return (
    <div style={styles.wrapper}>
      {/* Heading + Subtitle */}
      <div style={styles.textBlock}>
        <h2 style={styles.heading}>Connect With Us!</h2>
        <p style={styles.subheading}>
          We Are Always Available To Guide You At Your Convenience
        </p>
      </div>

      {/* Store Image */}
      <img src={storeImage} alt="Store" style={styles.storeImage} />

      {/* Buttons */}
      <div style={styles.buttons}>
        <a href="https://wa.me/919999999999" className="hover-box">
          <div style={styles.iconText}>
            <FaWhatsapp size={24} />
            <span style={styles.label}>Connect on WhatsApp</span>
          </div>
          <FaArrowRight size={18} className="arrow" />
        </a>

        <a href="/appointment" className="hover-box">
          <div style={styles.iconText}>
            <FaCalendarAlt size={24} />
            <span style={styles.label}>Book an Appointment</span>
          </div>
          <FaArrowRight size={18} className="arrow" />
        </a>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    textAlign: 'center',
    backgroundColor: '#fffdfb',
    padding: '60px 20px 80px',
  },
  textBlock: {
    marginBottom: '30px',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#3e0f0f',
    marginBottom: '10px',
  },
  subheading: {
    fontSize: '18px',
    color: '#555',
  },
  storeImage: {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '40px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  label: {
    fontSize: '16px',
  },
};

export default ConnectSection;
