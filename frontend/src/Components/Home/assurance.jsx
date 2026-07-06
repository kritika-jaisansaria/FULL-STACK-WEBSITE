import React from 'react';
import {
  FaShieldAlt,
  FaGem,
  FaReceipt,
  FaStar,
  FaTruck,
  FaUndo,
  FaHandsHelping,
  FaHammer,
} from 'react-icons/fa';

const WhyTanishq = () => {
  const items = [
    {
      icon: <FaShieldAlt size={40} color="#a87c5f" />,
      title: 'Purity Guaranteed',
      desc: '100% Hallmarked Jewellery',
    },
    {
      icon: <FaGem size={40} color="#a87c5f" />,
      title: 'Certified Diamonds',
      desc: 'Every diamond comes with certification',
    },
    {
      icon: <FaReceipt size={40} color="#a87c5f" />,
      title: 'Transparent Pricing',
      desc: 'No hidden charges or markups',
    },
    {
      icon: <FaStar size={40} color="#a87c5f" />,
      title: 'Trusted by Millions',
      desc: 'India’s most loved jeweller',
    },
    {
      icon: <FaTruck size={40} color="#a87c5f" />,
      title: 'Free Delivery',
      desc: 'On all prepaid orders across India',
    },
    {
      icon: <FaUndo size={40} color="#a87c5f" />,
      title: 'Return Policy',
      desc: 'Easy 7-day return or exchange policy',
    },
    {
      icon: <FaHammer size={40} color="#a87c5f" />,
      title: 'Quality Craftsmanship',
      desc: 'Expertly crafted with attention to detail',
    },
    {
      icon: <FaHandsHelping size={40} color="#a87c5f" />,
      title: 'Ethically Sourced',
      desc: 'Responsibly sourced gold and diamonds',
    },
  ];

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Why Nupur?</h2>
      <div style={styles.grid}>
        {items.map((item, index) => (
          <div key={index} style={styles.card}>
            <div>{item.icon}</div>
            <h3 style={styles.title}>{item.title}</h3>
            <p style={styles.desc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '60px 20px',
    textAlign: 'center',
    backgroundColor: '#fffdfb',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#3e0f0f',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px 20px',
    borderRadius: '16px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#3e0f0f',
    marginTop: '15px',
    marginBottom: '10px',
  },
  desc: {
    fontSize: '14px',
    color: '#555',
  },
};

export default WhyTanishq;
