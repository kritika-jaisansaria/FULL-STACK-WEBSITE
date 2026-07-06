import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronDown, ChevronUp, MapPin, Gem, Weight, Info, FileText
} from 'lucide-react';

export default function DeliveryDetailsForm() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [openSection, setOpenSection] = useState('metal');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p style={{ padding: '40px', textAlign: 'center' }}>Loading product details...</p>;

  const countries = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' }
  ];

  const selectedCountryData = countries.find(c => c.name === selectedCountry);

  const handlePincodeChange = (e) => {
    const value = e.target.value;
    setPincode(value);
    if (selectedCountry === 'India' && value && !/^\d{6}$/.test(value)) {
      setPincodeError('Enter valid 6-digit pincode');
    } else {
      setPincodeError('');
    }
  };

  const handleCheck = () => {
    if (!pincode) {
      setPincodeError('Please Enter Pincode');
      return;
    }
    if (selectedCountry === 'India' && !/^\d{6}$/.test(pincode)) {
      setPincodeError('Enter valid 6-digit pincode');
      return;
    }
    console.log('Checking delivery for:', { selectedCountry, pincode });
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const metalDetails = product?.metalDetails || {};
  const generalDetails = product?.generalDetails || {};
  const description = product?.description || '—';
  const mainImage = product?.media?.find(m => m.type === 'image')?.url || "https://via.placeholder.com/500x500";

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Karatage and Delivery Heading */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', color: '#712e2e', fontWeight: '600', fontSize: '18px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gem size={18} color="#f59e0b" />
          <span>{metalDetails.karatage || '—'}</span>
        </div>
        <span style={{ fontSize: '20px' }}>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Weight size={18} color="#f59e0b" />
          <span>{metalDetails.GrossWeight || '—'}</span>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '700', marginBottom: '20px', color: '#442e1f' }}>
        Delivery Details
      </h2>

      {/* Delivery Inputs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
          <button onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} style={{
            width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ccc',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', fontSize: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{selectedCountryData?.flag}</span><span>{selectedCountry}</span>
            </div>
            <ChevronDown size={18} />
          </button>
          {isCountryDropdownOpen && (
            <div style={{
              position: 'absolute', top: '105%', left: 0, right: 0, background: '#fff',
              border: '1px solid #ccc', borderRadius: '8px', zIndex: 10
            }}>
              {countries.map((country) => (
                <button key={country.code} onClick={() => {
                  setSelectedCountry(country.name);
                  setIsCountryDropdownOpen(false);
                  setPincode('');
                  setPincodeError('');
                }} style={{
                  padding: '10px 14px', display: 'flex', gap: '10px', width: '100%',
                  border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer'
                }}>
                  <span>{country.flag}</span> <span>{country.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '400px' }}>
          <MapPin size={18} style={{
            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999'
          }} />
          <input type="text" value={pincode} onChange={handlePincodeChange} placeholder="Enter Pincode" style={{
            width: '100%', padding: '14px 40px', borderRadius: '8px',
            border: `1px solid ${pincodeError ? 'red' : '#ccc'}`, fontSize: '16px'
          }} />
          <button onClick={handleCheck} style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: '#c2410c', fontWeight: '600', cursor: 'pointer'
          }}>Check →</button>
          {pincodeError && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{pincodeError}</p>}
        </div>
      </div>
      <h2 style={{
        fontSize: '26px',
        fontWeight: '700',
        color: '#442e1f',
        marginTop: '50px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Jewellery Details
      </h2>

      {/* Details and Image side-by-side */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '40px',
        marginTop: '50px',
        width:'100%'
      }}>
        {/* Accordion Left */}
        <div style={{
          flex: '1 1 55%',
          minWidth: '420px',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          background: '#ffffff',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
          paddingBottom: '10px'
        }}>
          {[
            { label: 'METAL DETAILS', icon: <Gem size={18} color="#b45309" />, section: 'metal', content: metalDetails },
            { label: 'GENERAL DETAILS', icon: <Info size={18} color="#b45309" />, section: 'general', content: generalDetails },
            { label: 'DESCRIPTION', icon: <FileText size={18} color="#b45309" />, section: 'desc', content: description }
          ].map(item => (
            <div key={item.section}>
              <div onClick={() => toggleSection(item.section)} style={{
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: openSection === item.section ? 'none' : '1px solid #f3f4f6',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#374151',
                backgroundColor: openSection === item.section ? '#fafafa' : 'transparent'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
                  {item.icon} {item.label}
                </span>
                {openSection === item.section
                  ? <ChevronUp size={18} color="#6b7280" />
                  : <ChevronDown size={18} color="#6b7280" />}
              </div>
              {openSection === item.section && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#fafafa',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  {item.section === 'desc' ? (
                    <p>{item.content}</p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      rowGap: '20px',
                      columnGap: '24px'
                    }}>
                      {Object.entries(item.content).map(([key, value]) => (
                        <div key={key}>
                          <div style={{
                            fontWeight: '600',
                            fontSize: '18px',
                            marginBottom: '6px',
                            color: '#111827'
                          }}>
                            {value}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: '#9ca3af'
                          }}>
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Product Image Right */}
        <div style={{
          flex: '1 1 33%',
          minWidth: '350px',
          maxWidth: '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <img
            src={mainImage}
            alt="Product"
            style={{
              width: '100%',
              maxHeight: '650px',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
