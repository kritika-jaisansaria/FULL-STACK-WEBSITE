import React from 'react';

const SplitBanner = () => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      backgroundColor: '#fff',
      padding: '80px 130px',
      paddingBottom: '40px',
      fontFamily: 'sans-serif',
      minHeight: '650px',
      gap: '14px',
    }}>
      {/* Left Side */}
      <div style={{
        flex: 1,
        backgroundColor: '#f4ece3',
        padding: '80px 60px',
        minWidth: '300px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopRightRadius: '50px',
        borderBottomRightRadius: '50px',
      }}>
        {/* Vertical Ribbon */}
        <div style={{
          position: 'absolute',
          left: '60px',
          top: '0px',
          bottom: '0px',
          width: '40px',
          backgroundColor: '#9b5e2c',
        }}></div>

        {/* Horizontal Ribbon */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '0px',
          right: '0px',
          height: '40px',
          backgroundColor: '#9b5e2c',
        }}></div>

        {/* Bow Circle */}
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          width: '45px',
          height: '45px',
          backgroundColor: '#b37842',
          borderRadius: '50%',
        }}></div>

        {/* Text and Button */}
        <h2 style={{ fontSize: '55px', color: '#6e3c1f', marginBottom: '16px', marginLeft: '70px' }}>#GiftOfChoice</h2>
        <p style={{ color: '#3a2b1d', fontSize: '18px', marginBottom: '10px', marginLeft: '70px' }}>
          Breathtaking gifts for your loved one's
        </p>
        <p style={{ color: '#6e3c1f', fontWeight: 'bold', fontSize: '18px', marginBottom: '28px', marginLeft: '70px' }}>
          STARTING AT ₹10,000
        </p>
        <button style={{
          padding: '14px 36px',
          minWidth: '180px',
          border: '2px solid #6e3c1f',
          backgroundColor: 'white',
          color: '#6e3c1f',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          marginLeft: '70px',
          marginBottom:'70px',
        }}>
          Explore Now →
        </button>
      </div>

      {/* Right Side */}
      <div style={{
        flex: 1,
        backgroundColor: '#fff7eb',
        padding: '80px 60px',
        minWidth: '300px',
        borderTopLeftRadius: '50px',
        borderBottomLeftRadius: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h2 style={{ fontSize: '48px', color: '#4a2f2f', marginBottom: '16px' }}>
          Exchange your Old Gold for 100% Value!
        </h2>
        <p style={{ color: '#333', fontSize: '18px', marginBottom: '12px' }}>
          Unlock full value for your old gold today with our <strong>Exchange Program!</strong>
        </p>
        <button style={{
          padding: '14px 36px',
          width: '220px',
          border: '2px solid #6e3c1f',
          backgroundColor: 'white',
          color: '#6e3c1f',
          borderRadius: '30px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
        }}>
          Know More →
        </button>
      </div>
    </div>
  );
};

export default SplitBanner;
