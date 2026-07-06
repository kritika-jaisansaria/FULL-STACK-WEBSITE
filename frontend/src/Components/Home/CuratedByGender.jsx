import React from 'react';
import trending1 from '../../assets/images/gendersection.webp';
import trending2 from '../../assets/images/gendersection2.jpg';
import trending3 from '../../assets/images/gendersection3.webp';

const trendingItems = [
  { title: 'Women Jewellery', image: trending2 },
  { title: 'Men Jewellery', image: trending1 },
  { title: 'Kids Jewellery', image: trending3 },
];

const CuratedByGender = () => {
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Curated For You</h2>
      <p style={styles.subheading}>Shop By Gender</p>
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

export default CuratedByGender;