import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaComments } from 'react-icons/fa';
import qrCode from '../../assets/images/QR-Code.webp'; // your QR
import playStore from '../../assets/images/play.jpg';
import appStore from '../../assets/images/app.jpg';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* LEFT SECTION */}
        <div style={styles.left}>
          <h2 style={styles.logo}>NUPUR</h2>
          <p style={styles.downloadText}>Download the Nupur App Now</p>
          <img src={qrCode} alt="QR Code" style={styles.qrCode} />
          <div style={styles.badges}>
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <img src={playStore} alt="Play Store" style={styles.storeBadge} />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src={appStore} alt="App Store" style={styles.storeBadge} />
            </a>
          </div>
        </div>

        {/* LINK COLUMNS */}
        <div style={styles.linksSection}>
          <div style={styles.linkColumn}>
            <h4 style={styles.heading}>Useful Links</h4>
            <a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Delivery Information
</a>

            <a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  International Shipping
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Paymnet Options
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Track Your Order
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Returns
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Find a Store
</a>

          </div>

          <div style={styles.linkColumn}>
            <h4 style={styles.heading}>Information</h4>
           <a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Blogg
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Offers & Contest Details
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Help & FAQs
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  About Nupur
</a>

          </div>

          <div style={styles.linkColumn}>
            <h4 style={styles.heading}>Contact Us</h4>
            <p style={styles.contact}>1800-123-4567</p>

            <h4 style={{ ...styles.heading, marginTop: '15px' }}>Chat With Us</h4>
            <p style={styles.contact}>+91 9876543210</p>

            <div style={styles.socialIcons}>
              <a href="#" style={styles.iconLink} onMouseOver={e => e.target.style.color = styles.iconLinkHover.color} onMouseOut={e => e.target.style.color = styles.iconLink.color}>
  <FaWhatsapp size={18} />
</a>

              <a href="#" style={styles.iconLink} onMouseOver={e => e.target.style.color = styles.iconLinkHover.color} onMouseOut={e => e.target.style.color = styles.iconLink.color}>
  <FaEnvelope size={18} />
</a>

              <a href="#" style={styles.iconLink} onMouseOver={e => e.target.style.color = styles.iconLinkHover.color} onMouseOut={e => e.target.style.color = styles.iconLink.color}>
  <FaComments size={18} />
</a>

            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div style={styles.bottom}>
        <div style={styles.socialRow}>
          <span style={styles.socialLabel}>Follow Us:</span>
          <a href="#" style={styles.iconLink} onMouseOver={e => e.target.style.color = styles.iconLinkHover.color} onMouseOut={e => e.target.style.color = styles.iconLink.color}>
  <FaYoutube size={18} />
</a>

          <a href="#" style={styles.iconLink} onMouseOver={e => e.target.style.color = styles.iconLinkHover.color} onMouseOut={e => e.target.style.color = styles.iconLink.color}>
  <FaFacebookF size={18} />
</a>

<a href="#" style={styles.iconLink} onMouseOver={e => e.target.style.color = styles.iconLinkHover.color} onMouseOut={e => e.target.style.color = styles.iconLink.color}>
  <FaInstagram size={18} />
</a>

        </div>
        <div style={styles.bottomLinks}>
          <p>© 2025 Nupur. All Rights Reserved.</p>
          <div style={styles.policyLinks}>
          <a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Terms & Conditions
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Privacy Policy
</a>
<a href="#" style={styles.link} onMouseOver={e => e.target.style.color = styles.linkHover.color} onMouseOut={e => e.target.style.color = styles.link.color}>
  Disclaimer
</a>

          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#360707',
    color: '#fff',
    fontFamily: 'sans-serif',
    padding: '60px 20px 30px',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '50px',
    justifyContent: 'space-between',
  },
  left: {
    flex: '1',
    minWidth: '250px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  downloadText: {
    fontSize: '16px',
    marginBottom: '16px',
  },
  qrCode: {
    width: '140px',
    marginBottom: '16px',
  },
  badges: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  storeBadge: {
    height: '42px',
    cursor: 'pointer',
  },
  linksSection: {
    flex: '2',
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkColumn: {
    minWidth: '180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
  color: '#ddd',
  textDecoration: 'none',
  fontSize: '14px',
  transition: 'color 0.3s ease',
},
linkHover: {
  color: '#fff',
},
iconLink: {
  color: '#fff',
  transition: 'color 0.3s ease',
},
iconLinkHover: {
  color: '#f7c59f',
},

  heading: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: '10px',
  },
  contact: {
    fontSize: '14px',
    margin: 0,
  },
  socialIcons: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px',
  },
  bottom: {
    borderTop: '1px solid #ffffff33',
    marginTop: '50px',
    paddingTop: '20px',
    textAlign: 'center',
  },
  socialRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    alignItems: 'center',
    marginBottom: '10px',
  },
  socialLabel: {
    fontWeight: '500',
    fontSize: '15px',
  },
  bottomLinks: {
    fontSize: '14px',
    color: '#ccc',
  },
  policyLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '8px',
  },
};

export default Footer;
