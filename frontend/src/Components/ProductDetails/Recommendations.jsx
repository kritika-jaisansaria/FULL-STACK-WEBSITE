import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Recommendations = () => {
  const { id } = useParams();
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    const url = `http://localhost:8080/api/products/recommended/${id}`;
    console.log("🔍 Fetching recommendations from:", url);

    axios.get(url)
      .then(res => {
        console.log("✅ Recommendations received:", res.data);
        setRecommended(res.data);
      })
      .catch(err => {
        console.error("❌ Failed to load recommendations", err);
      });
  }, [id]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  if (recommended.length === 0) return null;

  return (
    <div style={{ marginTop: '60px', padding: '0 20px' }}>
      
      {/* Heading and Scroll Arrows in One Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#3f1d0b',
          margin: 0
        }}>
          You may also like
        </h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => scroll('left')}
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: 36,
              height: 36,
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: 36,
              height: 36,
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Product Card Scroll Container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          gap: '20px',
          paddingBottom: '10px',
          paddingTop: '10px'
        }}
      >
        {recommended.map(product => {
          const image = product.media?.find(m => m.type === 'image')?.url || "https://via.placeholder.com/300";
          return (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              style={{
                minWidth: 240,
                maxWidth: 240,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                position: 'relative',
                paddingBottom: 15
              }}
            >
              {/* Wishlist icon */}
              <button style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'none',
                border: 'none',
                fontSize: 20,
                color: '#555'
              }}>♡</button>

              {/* Optional badge */}
              {product.isExpertChoice && (
                <span style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: '#7c2d12',
                  color: '#fff',
                  fontSize: '10px',
                  padding: '4px 6px',
                  borderRadius: '4px'
                }}>
                  EXPERT'S CHOICE
                </span>
              )}

              <img
                src={image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 220,
                  objectFit: 'cover',
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14
                }}
              />
              <div style={{ padding: '10px 12px' }}>
                <p style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#1f1f1f',
                  marginBottom: 4
                }}>
                  {product.name}
                </p>
                <p style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#9a3412'
                }}>
                  ₹ {product.price}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
