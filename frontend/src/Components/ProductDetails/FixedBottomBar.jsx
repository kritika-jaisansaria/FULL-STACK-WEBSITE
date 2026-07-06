import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Weight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const FixedBottomBar = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isInCart = cartItems.some(item => item.product?._id === product._id);
  const grossWeight = product?.metalDetails?.grossWeight;

  const handleAddToCart = async () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo?.token) {
      toast.error('Please login to add items to your cart');
      navigate('/login', { state: { background: window.location } });
      return;
    }

    setLoading(true);
    try {
      await addToCart(product, 1);
      toast.success('🛒 Added to Cart!');
    } catch (err) {
      // CartContext already shows an error toast; nothing more to do here.
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div style={styles.loaderOverlay}>
          <FaSpinner size={40} color="#7b2424" className="spinner" />
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.innerBar}>
          <div style={styles.price}>₹{Number(product?.price || 0).toLocaleString('en-IN')}</div>

          <div style={styles.divider} />

          <div style={styles.weightSelector}>
            <Weight size={16} style={{ marginRight: 4 }} />
            <span style={styles.label}>Weight:</span>
            <span style={styles.weight}>{grossWeight ? `${grossWeight} g` : 'N/A'}</span>
          </div>

          <div style={styles.divider} />

          <button style={styles.button} onClick={handleAddToCart} disabled={loading}>
            {isInCart ? 'Go to Cart' : loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '12px 0',
    zIndex: 9999,
  },
  innerBar: {
    maxWidth: '600px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: 16,
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    border: '1.5px solid #2b0303',
  },
  price: {
    fontSize: '25px',
    fontWeight: '600',
    color: '#2b0303',
  },
  divider: {
    height: '100%',
    width: 1,
    backgroundColor: '#ccc',
  },
  weightSelector: {
    display: 'flex',
    alignItems: 'center',
    background: '#f7f7f7',
    borderRadius: 10,
    padding: '8px 14px',
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  label: {
    marginRight: 4,
    color: '#666',
  },
  weight: {
    color: '#000',
    fontWeight: '600',
  },
  button: {
    background: '#7b2424',
    color: '#fff',
    border: 'none',
    padding: '10px 25px',
    borderRadius: 50,
    fontWeight: 'bold',
    fontSize: 18,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  loaderOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

export default FixedBottomBar;