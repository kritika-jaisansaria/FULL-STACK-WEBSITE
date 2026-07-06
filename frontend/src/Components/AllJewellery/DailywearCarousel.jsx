import React, { useState } from 'react';
import ringImg from '../../assets/images/ring.jpg';
import earringsImg from '../../assets/images/earrings.png';
import mangalsutraImg from '../../assets/images/mangalsutra.png';
import pendantImg from '../../assets/images/pendant.jpg';

const items = [
  { title: 'Dailywear Rings', image: ringImg },
  { title: 'Dailywear Earrings', image: earringsImg },
  { title: 'Dailywear Mangalsutra', image: mangalsutraImg },
  { title: 'Dailywear Pendant', image: pendantImg },
];

const DailywearCarousel = () => {
  const [index, setIndex] = useState(0);
  const visibleCount = 3;
  const cardWidth = 280;

  const next = () => {
    setIndex((prev) => Math.min(prev + 1, items.length - visibleCount));
  };

  const prev = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div style={carouselWrapper}>
      <h2 style={carouselTitle}>Dailywear Jewellery</h2>
      <div style={carouselContent}>
        <button
          onClick={prev}
          disabled={index === 0}
          style={{
            ...arrowStyle,
            opacity: index === 0 ? 0.4 : 1,
            cursor: index === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ←
        </button>
        <div style={viewport}>
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease',
              transform: `translateX(-${index * cardWidth}px)`,
              width: `${items.length * cardWidth}px`,
              gap: '20px',
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                style={dailywearCard}
                onClick={() => alert(`Clicked on ${item.title}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && alert(`Clicked on ${item.title}`)}
              >
                <div
                  style={{ overflow: 'hidden' }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <img src={item.image} alt={item.title} style={dailywearImg} />
                </div>
                <p style={dailywearLabel}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={next}
          disabled={index >= items.length - visibleCount}
          style={{
            ...arrowStyle,
            opacity: index >= items.length - visibleCount ? 0.4 : 1,
            cursor: index >= items.length - visibleCount ? 'not-allowed' : 'pointer',
          }}
        >
          →
        </button>
      </div>
    </div>
  );
};

// === Styles ===

const carouselWrapper = {
  background: 'linear-gradient(135deg, #2c1810 0%, #4a2c20 50%, #6b3728 100%)',
  padding: '4px 60px',
  color: '#fff',
  userSelect: 'none',
  width: `${2 * 280 + 1 * 20 + 2 * 60}px`,
  height: '430px',
  margin: 'auto',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
};

const carouselTitle = {
  fontSize: '32px',
  fontWeight: '600',
  textAlign: 'center',
  marginBottom: '40px',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};

const carouselContent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '20px',
};

const viewport = {
  overflow: 'hidden',
  width: '840px', // 3 cards * 280px width
};

const dailywearCard = {
  backgroundColor: 'transparent',
  padding: '0',
  textAlign: 'center',
  color: '#333',
  cursor: 'pointer',
  userSelect: 'none',
  width: '260px',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  border: 'none',
};

const dailywearImg = {
  width: '100%',
  height: '220px',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
  borderRadius:'10px'
};

const dailywearLabel = {
  fontWeight: '700',
  marginTop: '15px',
  marginLeft:'5px',
  fontSize: '20px',
  color: '#fff',
  display:'flex',

};

const arrowStyle = {
  fontSize: '24px',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '50%',
  color: '#fff',
  cursor: 'pointer',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)',
  fontWeight: 'bold',
};

export default DailywearCarousel;
