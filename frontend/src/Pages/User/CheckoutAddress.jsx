import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../Components/CheckoutSteps';

const BASE_URL = 'http://localhost:8080/api/addresses';

const CheckoutAddress = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: '', mobile: '', type: 'shipping',
    address1: '', address2: '', pincode: '', city: '', state: ''
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  useEffect(() => {
    if (!token) {
      alert("Please log in to proceed to checkout.");
      navigate('/');
    } else {
      fetchSavedAddresses();
    }
  }, []);

  const fetchSavedAddresses = async () => {
    try {
      const res = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const shipping = data.filter(a => a.type === 'shipping');
      setSavedAddresses(shipping.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  useEffect(() => {
    if (showPopup) setPopupVisible(true);
    else {
      const timeout = setTimeout(() => setPopupVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  const isAddressValid = (addr) => {
    return (
      addr.firstName.trim() && addr.lastName.trim() && addr.email.trim() && addr.mobile.trim() &&
      addr.address1.trim() && addr.pincode.trim() && addr.city.trim() && addr.state.trim()
    );
  };

  const handleSubmit = async () => {
    try {
      if (!token) return alert('You must be logged in');
      if (!isAddressValid(address)) return alert('Please fill all required fields');

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${BASE_URL}/${editingAddress._id}` : BASE_URL;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...address, type: 'shipping' })
      });

      if (!res.ok) throw new Error('Error saving address');
      alert(isEditing ? 'Address updated' : 'Address saved');

      setIsEditing(false);
      setEditingAddress(null);
      setShowPopup(false);
      setAddress({
        firstName: '', lastName: '', email: '', mobile: '', type: 'shipping',
        address1: '', address2: '', pincode: '', city: '', state: ''
      });

      fetchSavedAddresses();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(prev => prev.filter(a => a._id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const getCardStyle = (id) => ({
    ...savedCardStyle,
    borderColor: selectedAddressId === id ? '#7b2424' : '#110744',
    background: selectedAddressId === id ? '#fff4f4' : '#fafafa',
    boxShadow: selectedAddressId === id ? '0 0 10px rgba(123,36,36,0.2)' : savedCardStyle.boxShadow,
    cursor: 'pointer'
  });

  const renderAddressForm = (data, onChange) => (
    <>
      <div style={formGroup}><label>First Name*</label><input name="firstName" value={data.firstName} onChange={onChange} style={inputStyle} /></div>
      <div style={formGroup}><label>Last Name*</label><input name="lastName" value={data.lastName} onChange={onChange} style={inputStyle} /></div>
      <div style={formGroup}><label>Email*</label><input name="email" value={data.email} onChange={onChange} type="email" style={inputStyle} /></div>
      <div style={formGroup}><label>Mobile*</label><input name="mobile" value={data.mobile} onChange={onChange} type="tel" style={inputStyle} /></div>
      <div style={formGroup}><label>Address Line 1*</label><input name="address1" value={data.address1} onChange={onChange} style={inputStyle} /></div>
      <div style={formGroup}><label>Address Line 2</label><input name="address2" value={data.address2} onChange={onChange} style={inputStyle} /></div>
      <div style={rowInputContainerStyle}>
        <div style={pincodeStyle}><label>Pincode*</label><input name="pincode" value={data.pincode} onChange={onChange} style={inputStyle} /></div>
        <div style={cityStyle}><label>City*</label><input name="city" value={data.city} onChange={onChange} style={inputStyle} /></div>
        <div style={stateStyle}><label>State*</label><input name="state" value={data.state} onChange={onChange} style={inputStyle} /></div>
      </div>
    </>
  );

  const popupCardAnimatedStyle = (visible) => ({
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    opacity: visible ? 1 : 0,
    transition: 'all 300ms ease'
  });

  return (
    <div style={pageContainer}>
      <div style={{ flex: 2 }}>
        <h2 style={sectionHeading}>SHIPPING ADDRESS</h2>

        {savedAddresses.map(addr => (
          <div
            key={addr._id}
            style={getCardStyle(addr._id)}
            onClick={() => setSelectedAddressId(addr._id)}
          >
            <p style={{ fontWeight: 700, fontSize: '18px' }}>{addr.firstName} {addr.lastName}</p>
            <p>{addr.address1}, {addr.city}, {addr.state}, {addr.pincode}</p>
            <p>📞 {addr.mobile}</p>
            <p>📧 {addr.email}</p>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={(e) => {
                e.stopPropagation();
                setEditingAddress(addr);
                setAddress(addr);
                setIsEditing(true);
                setShowPopup(true);
              }} style={{ marginRight: '1rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Edit</button>
              <button onClick={(e) => {
                e.stopPropagation();
                handleDeleteAddress(addr._id);
              }} style={{ color: 'crimson', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>🗑 Remove</button>
            </div>
            {selectedAddressId === addr._id && (
              <div style={{ marginTop: '0.5rem', color: '#7b2424', fontWeight: 700 }}>✔️ Selected</div>
            )}
          </div>
        ))}

        {savedAddresses.length < 3 && (
          <div onClick={() => setShowPopup(true)} style={addAddressBoxStyle}>
            <div style={plusCircleStyle}>+</div>
            <p style={addText}>Add Address</p>
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <CheckoutSteps currentStep={2} />
        <div>
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', marginBottom: '1rem' }}>
              <img src={item.product.media[0].url} alt={item.product.name} style={{ width: 50, height: 50, borderRadius: 8 }} />
              <div style={{ marginLeft: '1rem' }}>
                <div style={{ fontWeight: 700 }}>{item.product.name}</div>
                <div>Quantity: {item.quantity}</div>
                <div style={{ color: '#7b2424', fontWeight: 700 }}>₹{item.product.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <div style={rowStyle}><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div style={rowStyle}><span>Shipping</span><span>Free</span></div>
          <div style={{ ...rowStyle, fontWeight: 700, fontSize: '18px' }}><span>Total</span><span>₹{subtotal}</span></div>
          <button
            onClick={() => {
              const selected = savedAddresses.find(a => a._id === selectedAddressId);
              if (!selected) return alert("Please select a shipping address to continue.");
              localStorage.setItem('selectedShippingAddress', JSON.stringify(selected));
              navigate('/payment');
            }}
            style={proceedButtonStyle}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {popupVisible && (
        <div style={{ ...popupOverlayStyle, opacity: showPopup ? 1 : 0 }} onClick={() => setShowPopup(false)}>
          <div style={{ ...popupCardStyle, ...popupCardAnimatedStyle(showPopup) }} onClick={(e) => e.stopPropagation()}>
            <h2 style={sectionHeading}>{isEditing ? 'Edit Address' : 'Add Shipping Address'}</h2>
            {renderAddressForm(address, handleChange)}
            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button onClick={() => setShowPopup(false)} style={cancelButtonStyle}>Cancel</button>
              <button onClick={handleSubmit} style={submitButtonStyle}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles (unchanged except for dynamic card)
const pageContainer = { display: 'flex', padding: '2rem', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start' };
const sectionHeading = { color: '#7b2424', marginBottom: '1.2rem', fontWeight: '700' };
const addText = { marginTop: '1rem', fontWeight: '700', color: '#333', fontSize: '18px' };
const addAddressBoxStyle = { background: '#f5f5f5', padding: '2rem', textAlign: 'center', borderRadius: '12px', marginTop: '1.5rem', cursor: 'pointer', userSelect: 'none', boxShadow: '0 4px 12px rgb(0 0 0 / 0.05)', color: '#7b2424', fontWeight: '600' };
const plusCircleStyle = { fontSize: '34px', border: '3px solid #7b2424', width: 44, height: 44, borderRadius: '50%', margin: '0 auto', lineHeight: '36px' };
const popupOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '1rem', overflowY: 'auto' };
const popupCardStyle = { background: '#fff', padding: '2rem 3rem', width: '100%', maxWidth: '680px', maxHeight: '85vh', overflowY: 'scroll', borderRadius: '20px', boxShadow: '0 8px 24px rgba(123, 36, 36, 0.25)' };
const formGroup = { marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '6px' };
const rowInputContainerStyle = { display: 'flex', gap: '12px', flexWrap: 'wrap' };
const pincodeStyle = { flex: '0 0 25%' };
const cityStyle = { flex: '0 0 35%' };
const stateStyle = { flex: '0 0 35%' };
const inputStyle = { padding: '12px 15px', fontSize: '16px', borderRadius: '8px', border: '1.8px solid #ccc', outlineColor: '#7b2424' };
const cancelButtonStyle = { marginRight: '1rem', background: '#ccc', padding: '10px 22px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '16px', cursor: 'pointer' };
const submitButtonStyle = { backgroundColor: '#7b2424', color: 'white', padding: '10px 22px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer' };
const proceedButtonStyle = { marginTop: '1.5rem', width: '100%', padding: '14px', backgroundColor: '#7b2424', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', boxShadow: '0 5px 15px rgb(123 36 36 / 0.4)' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '16px' };
const savedCardStyle = { border: '2px solid #110744', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', background: '#fafafa', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' };

export default CheckoutAddress;
