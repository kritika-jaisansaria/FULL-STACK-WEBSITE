import React from 'react';
import trending1 from '../../assets/images/trending2.webp';
import trending2 from '../../assets/images/trending3.webp';
import trending3 from '../../assets/images/trending1.webp';

const trendingItems = [
  { title: 'Auspicious Occasion', image: trending1 },
  { title: 'Gifting Jewellery', image: trending2 },
  { title: '18Kt Jewellery', image: trending3 },
];

const TrendingNow = () => {
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Trending Now</h2>
      <p style={styles.subheading}>Jewellery pieces everyone’s eyeing right now</p>
      <div style={styles.cardContainer}>
        {trendingItems.map((item, index) => (
          <div key={index} style={styles.card}>
            <img src={item.image} alt={item.title} style={styles.image} />
            <p style={styles.cardTitle}>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor:'#FFFFFA',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '8px',
    color:'#3e0f0f',
  },
  subheading: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  card: {
    width: '360px',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height:'auto',
    display: 'block',
    borderRadius: '15px',
    cursor:'pointer',
  },
  cardTitle: {
    marginTop: '12px',
    fontSize: '24px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '10px',
  },
};

export default TrendingNow;
