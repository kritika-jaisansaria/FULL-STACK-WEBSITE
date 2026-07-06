import React from 'react';
import weddingImg from '../../assets/images/world1.webp';
import diamondImg from '../../assets/images/world2.webp';
import goldImg from '../../assets/images/world3.jpg';
import dailywearImg from '../../assets/images/world4.webp';

const items = [
  {
    label: 'Wedding',
    image: weddingImg,
    link: '/world1',
    gridStyles: {
      gridColumnStart: 1,
      gridRowStart: 1,
      gridRowEnd: 5,
      height: 385,
    },
  },
  {
    label: 'Diamond',
    image: diamondImg,
    link: '/world2',
    gridStyles: {
      gridColumnStart: 1,
      gridRowStart: 5,
      gridRowEnd: 11,
      height: 432,
    },
  },
  {
    label: 'Gold',
    image: goldImg,
    link: '/world3',
    gridStyles: {
      gridColumnStart: 2,
      gridRowStart: 1,
      gridRowEnd: 7,
      height: 432,
    },
  },
  {
    label: 'Dailywear',
    image: dailywearImg,
    link: '/world4',
    gridStyles: {
      gridColumnStart: 2,
      gridRowStart: 7,
      gridRowEnd: 11,
      height: 385,
    },
  },
];

const TanishqWorld = () => {
  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Nupur World</h2>
      <p style={styles.subheading}>A companion for every occasion</p>

      <div style={styles.grid}>
        {items.map((item, index) => (
          <a key={index} href={item.link} style={{ ...styles.link, ...item.gridStyles }}>
            <div style={{ ...styles.card, height: item.gridStyles.height }}>
              <img src={item.image} alt={item.label} style={styles.image} />
              <div style={styles.overlay}>
                <span style={styles.label}>{item.label}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    textAlign: 'center',
    padding: '40px 80px',
    backgroundColor: '#FFFDFB',
  },
  heading: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#3e0f0f',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '30px',
  },
  grid: {
  display: 'grid',
  gridTemplateColumns: '480px 480px', // fixed column widths
  gridTemplateRows: 'repeat(10, auto)',
  gap: '10px', // minimal horizontal + vertical gap
  justifyContent: 'center',
},

  link: {
    textDecoration: 'none',
    color: 'inherit',
    width: '100%',
    display: 'block',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '520px', // reduce for clarity
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    objectFit:'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: '20px',
  },
  label: {
    color: 'white',
    fontSize: '35px',
    fontWeight: '600',
    textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
  },
};

export default TanishqWorld;
