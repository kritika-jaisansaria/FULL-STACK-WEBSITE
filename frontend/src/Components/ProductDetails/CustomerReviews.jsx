import React, { useState } from 'react';
import { Star, X, UploadCloud } from 'lucide-react';

const CustomerReviews = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index);
  };

  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'serif' }}>
      <h2 style={{ fontSize: '32px', fontWeight: '600', color: '#3f0d1b', marginBottom: '8px' }}>
        Customer Reviews
      </h2>
      <p style={{ fontSize: '18px', color: '#4b4b4b', marginBottom: '40px' }}>
        See what our clients have to say
      </p>

      <div
        style={{
          background: 'linear-gradient(to bottom, #d8a75c, #774924)',
          borderRadius: '8px',
          padding: '40px 20px',
          margin: 'auto',
          maxWidth: '500px',
          color: '#fff'
        }}
      >
        <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
          Be the first to write a review
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              size={28}
              onClick={() => handleStarClick(i)}
              style={{ cursor: 'pointer' }}
              color={i <= rating ? '#e0cba7' : '#fff'}
              fill={i <= rating ? '#e0cba7' : 'none'}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowPopup(true)}
        style={{
          marginTop: '40px',
          background: '#a56969',
          color: 'white',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '999px',
          padding: '12px 30px',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Write a review
        <span style={{
          width: 28,
          height: 28,
          background: '#7e4e4e',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'white', fontSize: '18px' }}>&gt;</span>
        </span>
      </button>

      {/* Review Popup */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={() => setShowPopup(false)} style={styles.close}><X /></button>
            <h2 style={styles.title}>Share your thoughts</h2>

            <label style={styles.label}>Rate your experience</label>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map(i => (
                <span
                  key={i}
                  onClick={() => setRating(i)}
                  style={{
                    cursor: 'pointer',
                    fontSize: 30,
                    color: i <= rating ? '#b8860b' : '#ccc'
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <input placeholder="Add a headline" style={styles.input} />
            <textarea placeholder="Write a review" rows={4} style={styles.textarea} />
            <div style={{ display: 'flex', gap: 12 }}>
              <input placeholder="Your name" style={{ ...styles.input, flex: 1 }} />
              <input placeholder="Your email address" style={{ ...styles.input, flex: 1 }} />
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={styles.label}>Add media</label>
              <button style={styles.upload}><UploadCloud size={16} /> Upload</button>
              <p style={styles.uploadNote}>Upload up to 10 images and 3 videos (max 5GB)</p>
            </div>

            <button style={styles.send}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 999
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: 30,
    width: '90%', maxWidth: 600, position: 'relative', fontFamily: 'serif'
  },
  close: {
    position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer'
  },
  title: {
    fontSize: 22, fontWeight: '600', marginBottom: 20, color: '#1f1f1f'
  },
  label: {
    fontWeight: 500, marginBottom: 6, display: 'block', color: '#3f1d0b'
  },
  stars: {
    marginBottom: 20
  },
  input: {
    width: '100%', padding: '10px 12px', fontSize: 14,
    marginBottom: 15, border: '1px solid #ccc', borderRadius: 6
  },
  textarea: {
    width: '100%', padding: '10px 12px', fontSize: 14,
    marginBottom: 15, border: '1px solid #ccc', borderRadius: 6, resize: 'vertical'
  },
  upload: {
    padding: '10px 14px', background: '#9a3412', color: '#fff',
    borderRadius: 8, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6
  },
  uploadNote: {
    fontSize: 12, color: '#666', marginTop: 5
  },
  send: {
    display: 'block', margin: '30px auto 0 auto', padding: '12px 30px',
    background: '#6a1b1a', color: '#fff', borderRadius: 30,
    border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer'
  }
};

export default CustomerReviews;
