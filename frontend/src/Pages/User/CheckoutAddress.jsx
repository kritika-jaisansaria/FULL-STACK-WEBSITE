import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../../Components/CheckoutSteps';
import axios from "axios";
import {
  Phone,
  Mail,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
const BASE_URL = 'http://localhost:8080/api/addresses';


const EMPTY_ADDRESS = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  addressType: "Home",
  isDefault: false,
  address1: "",
  address2: "",
  pincode: "",
  city: "",
  state: "",
};

const CheckoutAddress = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [addressesLoading, setAddressesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deliveringId, setDeliveringId] = useState(null);

  const [address, setAddress] = useState(EMPTY_ADDRESS);

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to proceed to checkout.');
      navigate('/');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.info('Your bag is empty. Add items before checkout.');
      navigate('/cart');
      return;
    }
    fetchSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSavedAddresses = async () => {
  try {
    setAddressesLoading(true);

    const { data } = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSavedAddresses(data);

  } catch (err) {
    console.error("Failed to fetch addresses", err);

    toast.error(
      err.response?.data?.message ||
      "Could not load saved addresses."
    );
  } finally {
    setAddressesLoading(false);
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
  if (
    !addr.firstName.trim() ||
    !addr.lastName.trim() ||
    !addr.email.trim() ||
    !addr.mobile.trim() ||
    !addr.address1.trim() ||
    !addr.city.trim() ||
    !addr.state.trim() ||
    !addr.pincode.trim()
  ) {
    toast.error("Please fill all required fields.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(addr.email)) {
    toast.error("Please enter a valid email address.");
    return false;
  }

  if (!/^\d{10}$/.test(addr.mobile)) {
    toast.error("Mobile number must be exactly 10 digits.");
    return false;
  }

  if (!/^\d{6}$/.test(addr.pincode)) {
    toast.error("Pincode must be exactly 6 digits.");
    return false;
  }

  return true;
};

  const handleSubmit = async () => {
    if (!token) return toast.error('You must be logged in');
    if (!isAddressValid(address)) return;

    try {
      setSubmitting(true);
      if (isEditing) {
  await axios.put(
    `${BASE_URL}/${editingAddress._id}`,
    address,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
} else {
  await axios.post(
    BASE_URL,
    address,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

      toast.success(isEditing ? 'Address updated' : 'Address saved');

      setIsEditing(false);
      setEditingAddress(null);
      setShowPopup(false);
      setAddress(EMPTY_ADDRESS);

      await fetchSavedAddresses();
    } catch (err) {
      toast.error(err.message || 'Failed to save address. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`${BASE_URL}/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      setSavedAddresses(prev => prev.filter(a => a._id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
      toast.success('Address removed');
    } catch (err) {
      toast.error(
  err.response?.data?.message ||
  "Failed to delete address."
);
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeliverHere = (addr) => {
    if (!cartItems || cartItems.length === 0) {
      toast.info('Your bag is empty.');
      return;
    }
    setSelectedAddressId(addr._id);
    setDeliveringId(addr._id);
    localStorage.setItem('selectedShippingAddress', JSON.stringify(addr));
    navigate('/payment');
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
      <div style={formGroup}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  First Name *
</label><input name="firstName" value={data.firstName} onChange={onChange} style={inputStyle} /></div>
      <div style={formGroup}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  Last Name *
</label><input name="lastName" value={data.lastName} onChange={onChange} style={inputStyle} /></div>
      <div style={formGroup}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  Email *
</label><input name="email" value={data.email} onChange={onChange} type="email" style={inputStyle} /></div>
      <div style={formGroup}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  Mobile *
</label><input name="mobile" value={data.mobile} onChange={onChange} type="tel" style={inputStyle} /></div>
<div style={formGroup}>
  <label
    style={{
      fontSize: "14px",
      fontWeight: 600,
      color: "#555",
    }}
  >
    Address Type
  </label>

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "4px",
    }}
  >
    {["Home", "Office", "Other"].map((type) => (
      <button
        key={type}
        type="button"
        onClick={() =>
          setAddress((prev) => ({
            ...prev,
            addressType: type,
          }))
        }
        style={{
          padding: "8px 18px",
          borderRadius: "20px",
          border:
            data.addressType === type
              ? "2px solid #7b2424"
              : "1px solid #ddd",
          background:
            data.addressType === type ? "#7b2424" : "#fff",
          color:
            data.addressType === type ? "#fff" : "#555",
          fontWeight: 600,
          cursor: "pointer",
          transition: "0.25s",
        }}
      >
        {type}
      </button>
    ))}
  </div>
</div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  }}
>
  <input
    type="checkbox"
    id="defaultAddress"
    checked={data.isDefault}
    onChange={(e) =>
      setAddress((prev) => ({
        ...prev,
        isDefault: e.target.checked,
      }))
    }
    style={{
      width: "16px",
      height: "16px",
      cursor: "pointer",
    }}
  />

  <label
    htmlFor="defaultAddress"
    style={{
      fontSize: "14px",
      color: "#555",
      cursor: "pointer",
      userSelect: "none",
    }}
  >
    Set as my default delivery address
  </label>
</div>
      <div style={formGroup}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  Address Line 1 *
</label><input name="address1" value={data.address1} onChange={onChange} style={inputStyle} /></div>
      <div style={formGroup}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  Address Line 2
</label><input name="address2" value={data.address2} onChange={onChange} style={inputStyle} /></div>
      <div style={rowInputContainerStyle} className="checkout-address-row-inputs">
        <div style={pincodeStyle}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  Pincode *
</label><input name="pincode" value={data.pincode} onChange={onChange} style={inputStyle} /></div>
        <div style={cityStyle}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  City *
</label><input name="city" value={data.city} onChange={onChange} style={inputStyle} /></div>
        <div style={stateStyle}><label
  style={{
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  }}
>
  State *
</label><input name="state" value={data.state} onChange={onChange} style={inputStyle} /></div>
      </div>
    </>
  );

  const popupCardAnimatedStyle = (visible) => ({
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    opacity: visible ? 1 : 0,
    transition: 'all 300ms ease'
  });

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .checkout-address-page { flex-direction: column !important; padding: 1.2rem !important; }
        }
        @media (max-width: 480px) {
          .checkout-address-row-inputs { flex-direction: column !important; }
          .checkout-address-row-inputs > div { flex: 1 1 100% !important; }
        }
        .deliver-here-btn:disabled, .edit-remove-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes checkout-address-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
      `}</style>

      <div style={pageContainer} className="checkout-address-page">
        <div style={{ flex: 2, minWidth: 0 }}>
          <h2 style={sectionHeading}>SHIPPING ADDRESS</h2>

          {addressesLoading ? (
            <div>
              {[1, 2].map(i => <div key={i} style={skeletonCardStyle} />)}
            </div>
          ) : (
            <>
              {savedAddresses.length === 0 && (
                <p style={{ color: '#777', marginBottom: '1rem' }}>
                  You don't have any saved addresses yet. Add one to continue.
                </p>
              )}

              {savedAddresses.map(addr => {
                const isBusy = deletingId === addr._id || deliveringId === addr._id;
                return (
                 <div
  key={addr._id}
  style={getCardStyle(addr._id)}
  onMouseEnter={(e) => {
    if (selectedAddressId !== addr._id) {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow =
        "0 10px 24px rgba(123,36,36,0.12)";
    }
  }}
  onMouseLeave={(e) => {
    if (selectedAddressId !== addr._id) {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow =
        "0 4px 18px rgba(0,0,0,0.06)";
    }
  }}
                    onClick={() => setSelectedAddressId(addr._id)}
                  >
                    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  }}
>
  <span
    style={{
      background: "#f7efe0",
      color: "#7b2424",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600,
    }}
  >
    {addr.addressType || "Home"}
  </span>

  {addr.isDefault && (
    <span
      style={{
        background:
  selectedAddressId === addr._id
    ? "#2e7d32"
    : "#7b2424",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      Default
    </span>
  )}
</div>

<p
  style={{
    fontWeight: 700,
    fontSize: "18px",
    marginBottom: "8px",
  }}
>
  {addr.firstName} {addr.lastName}
</p>
                <div
  style={{
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "10px",
    lineHeight: "1.6",
    color: "#444",
    fontSize: "15px",
  }}
>
  <MapPin
    size={18}
    color="#7b2424"
    style={{ marginTop: "2px", flexShrink: 0 }}
  />

  <div>
    {addr.address1}
    {addr.address2 && (
      <>
        <br />
        {addr.address2}
      </>
    )}
    <br />
    {addr.city}, {addr.state} - {addr.pincode}
  </div>
</div>
                    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
    color: "#555",
    fontSize: "14px",
  }}
>
  <Phone size={16} color="#7b2424" />
  {addr.mobile}
</div>
                    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "6px",
    color: "#555",
    fontSize: "14px",
  }}
>
  <Mail size={16} color="#7b2424" />
  {addr.email}
</div>
                    <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "18px",
    flexWrap: "wrap",
  }}
>
  <button
   disabled={isBusy || selectedAddressId === addr._id}
    onClick={(e) => {
      e.stopPropagation();
      handleDeliverHere(addr);
    }}
    style={{
      background: "#7b2424",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 18px",
      fontWeight: 600,
      cursor:
  isBusy || selectedAddressId === addr._id
    ? "not-allowed"
    : "pointer",
      transition: "0.25s",
    }}
  >
    {
       selectedAddressId === addr._id
      ? "Selected"
      : deliveringId === addr._id
      ? "Please wait..."
      : "Deliver Here"
    }
  </button>

  <button
    disabled={isBusy}
    onClick={(e) => {
      e.stopPropagation();
      setEditingAddress(addr);
      setAddress({ ...EMPTY_ADDRESS, ...addr });
      setIsEditing(true);
      setShowPopup(true);
    }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    <Pencil size={16} />
    Edit
  </button>

  <button
    disabled={isBusy}
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteAddress(addr._id);
    }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#fff",
      border: "1px solid #e5b5b5",
      color: "#b00020",
      borderRadius: "8px",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    <Trash2 size={16} />
    {deletingId === addr._id ? "Removing..." : "Delete"}
  </button>
</div>
                  {selectedAddressId === addr._id && (
  <div
    style={{
      marginTop: "14px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "#e8f5e9",
      color: "#2e7d32",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: 600,
      border: "1px solid #c8e6c9",
    }}
  >
    ✓ Selected for Delivery
  </div>
)} 
                  </div>
                );
              })}

              {savedAddresses.length < 3 && (
                <div
    onClick={() => setShowPopup(true)}
    style={addAddressBoxStyle}
    onMouseEnter={(e)=>{
        e.currentTarget.style.transform="translateY(-3px)";
        e.currentTarget.style.boxShadow="0 12px 24px rgba(184,134,11,0.12)";
    }}
    onMouseLeave={(e)=>{
        e.currentTarget.style.transform="translateY(0)";
        e.currentTarget.style.boxShadow="none";
    }}
>
                  <div style={plusCircleStyle}>+</div>
                  <p style={addText}>Add Address</p>
                </div>
              )}
            </>
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
              if (!selected) return toast.error("Please select a shipping address to continue.");
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
            <>
  <h2
    style={{
      color: "#7b2424",
      fontWeight: 700,
      marginBottom: "10px",
    }}
  >
    {isEditing ? "Edit Address" : "Add New Address"}
  </h2>

  <div
    style={{
      width: "60px",
      height: "3px",
      background: "#b8860b",
      borderRadius: "999px",
      marginBottom: "24px",
    }}
  />

  {renderAddressForm(address, handleChange)}
</>
            
            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button onClick={() => setShowPopup(false)} disabled={submitting} style={cancelButtonStyle}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{ ...submitButtonStyle, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

// Styles (unchanged except for dynamic card)
const pageContainer = { display: 'flex', padding: '2rem', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start' };
const sectionHeading = { color: '#7b2424', marginBottom: '1.2rem', fontWeight: '700' };
const addText = {
  marginTop: "16px",
  fontWeight: 600,
  fontSize: "17px",
  color: "#7b2424",
};
const addAddressBoxStyle = {
  border: "2px dashed #d8c4a8",
  background: "#fffdf9",
  padding: "2.2rem",
  textAlign: "center",
  borderRadius: "16px",
  marginTop: "1.5rem",
  cursor: "pointer",
  userSelect: "none",
  transition: "all 0.25s ease",
  color: "#7b2424",
};
const plusCircleStyle = {
  width: 58,
  height: 58,
  margin: "0 auto",
  borderRadius: "50%",
  border: "2px solid #b8860b",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "34px",
  color: "#b8860b",
  fontWeight: 300,
  transition: "0.25s",
};
const popupOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "40px",
  paddingBottom: "40px",
  overflowY: "auto",
  zIndex: 999,
};
const popupCardStyle = { background: '#fff', padding: '2rem 3rem', width: '100%', maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '24px', boxShadow: "0 20px 50px rgba(0,0,0,0.15)" };
const formGroup = {
  marginBottom: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};
const rowInputContainerStyle = { display: 'flex', gap: '12px', flexWrap: 'wrap' };
const pincodeStyle = { flex: '0 0 25%' };
const cityStyle = { flex: '0 0 35%' };
const stateStyle = { flex: '0 0 35%' };
const inputStyle = {
  padding: "13px 16px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "1px solid #d8d8d8",
  background: "#fff",
  transition: "all 0.25s ease",
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
};
const cancelButtonStyle = { marginRight: '1rem', background: '#ccc', padding: '10px 22px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '16px', cursor: 'pointer' };
const submitButtonStyle = { backgroundColor: '#7b2424', color: 'white', padding: '10px 22px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '16px', cursor: 'pointer' };
const proceedButtonStyle = { marginTop: '1.5rem', width: '100%', padding: '14px', backgroundColor: '#7b2424', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '18px', cursor: 'pointer', boxShadow: '0 5px 15px rgb(123 36 36 / 0.4)' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '16px' };
const savedCardStyle = {
  border: "1px solid #e7dfd6",
  borderRadius: "16px",
  padding: "1.5rem",
  marginBottom: "1.25rem",
  background: "#fff",
  boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  transition: "all 0.25s ease",
};
const skeletonCardStyle = { height: '140px', borderRadius: '12px', marginBottom: '1rem', background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 37%, #f0f0f0 63%)', backgroundSize: '400% 100%', animation: 'checkout-address-shimmer 1.4s ease infinite' };

export default CheckoutAddress;