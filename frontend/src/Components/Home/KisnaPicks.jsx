import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

import ring1 from '../../assets/images/product1.webp';
import ring2 from '../../assets/images/product2.webp';
import pendant from '../../assets/images/product3.webp';
import bangle from '../../assets/images/product4.webp';
import chain from '../../assets/images/product5.webp';
import set from '../../assets/images/product6.webp';
import bracelet from '../../assets/images/product7.webp';
import mangalsutra from '../../assets/images/product8.webp';

const products = [
  { name: 'Nimrat Ring', price: '₹16,002', image: ring1, link: '#' },
  { name: 'Rosie Ring', price: '₹22,107', originalPrice: '₹22,816', offer: '25% off on making charges', image: ring2, link: '#' },
  { name: 'Eliz Pendant', price: '₹23,725', offer: '25% off on making charges', image: pendant, link: '#' },
  { name: 'Elegant Bangle', price: '₹19,499', image: bangle, link: '#' },
  { name: 'Gold Chain', price: '₹27,820', image: chain, link: '#' },
  { name: 'Bridal Set', price: '₹49,999', image: set, link: '#' },
  { name: 'Classic Bracelet', price: '₹18,540', image: bracelet, link: '#' },
  { name: 'Mangalsutra', price: '₹21,300', image: mangalsutra, link: '#' },
];

const KisnaPicks = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;

  const handleNext = () => {
    if (currentIndex < products.length - cardsPerView) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '60px',
      backgroundColor: '#f7e7ce',
      overflow: 'hidden',
    }}>
      
      {/* LEFT SIDE - KISNA TEXT */}
      <div style={{
        flex: '1',
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}>
        <div style={{ color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>
          Best Collection
        </div>
        <div style={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '30px', color: 'rgb(62, 15, 15)' }}>
          KISNA PICKS
        </div>
        <p style={{ fontSize: '16px', color: '#555' }}>
          The curated collection of elegant, handpicked jewellery pieces that reflect timeless beauty and craftsmanship.
        </p>
      </div>

      {/* RIGHT SIDE - PRODUCTS & ARROWS */}
      <div style={{ flex: '2', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
        {/* Product Slider Wrapper */}
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            gap: '25px',
            transform: `translateX(-${currentIndex * (400 + 25)}px)`,
            transition: 'transform 0.5s ease',
          }}>
            {products.map((product, index) => (
              <div key={index} style={{
                backgroundColor: '#fff',
                padding: '24px',
                width: '400px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                position: 'relative',
                transition: 'background 0.3s ease',
                overflow: 'hidden',
                flexShrink: 0,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <a href={product.link}>
                    <img src={product.image} alt={product.name} style={{
                      width: '100%',
                      height: '350px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      transition: 'transform 0.3s ease',
                    }} />
                  </a>
                  <FaHeart style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '25px',
                    color: '#888',
                    cursor: 'pointer',
                    zIndex: 2,
                  }} />
                </div>
                <h4>{product.name}</h4>
                <p style={{ fontWeight: 'bold', fontSize: '15px' }}>
                  {product.price}
                  {product.originalPrice && (
                    <span style={{
                      fontSize: '13px',
                      textDecoration: 'line-through',
                      color: 'grey',
                      marginLeft: '6px',
                    }}>
                      {product.originalPrice}
                    </span>
                  )}
                </p>
                {product.offer && <p style={{ color: '#6c63ff', fontSize: '13px', marginTop: '4px' }}>{product.offer}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows Below */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={handlePrev}
            style={{
              fontSize: '28px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
            disabled={currentIndex === 0}
          >
            ❮
          </button>

          <button
            onClick={handleNext}
            style={{
              fontSize: '28px',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
            disabled={currentIndex >= products.length - cardsPerView}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default KisnaPicks;
