import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cloudName = "dcf9z8ubg";
const uploadPreset = "admin_uploads";

const ManageProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [product, setProduct] = useState(initialProduct());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/products");
        setProducts(res.data);
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setProduct(initialProduct());
      setEditingId(null);
    }
  };

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleMetalChange = (e) => {
    setProduct({
      ...product,
      metalDetails: {
        ...product.metalDetails,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleGeneralChange = (e) => {
    setProduct({
      ...product,
      generalDetails: {
        ...product.generalDetails,
        [e.target.name]: e.target.value
      }
    });
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('context', `custom=karatage=${product.metalDetails.karatage}|grossWeight=${product.metalDetails.grossWeight}`);

      const fileType = file.type.startsWith('video') ? 'video' : 'image';
      const endpoint = fileType === 'video' ? 'video/upload' : 'image/upload';

      try {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${endpoint}`, formData);
        const url = res.data.secure_url;
        setProduct(prev => ({
          ...prev,
          media: [...prev.media, { type: fileType, url }]
        }));
      } catch (err) {
        toast.error("Media upload failed.");
      }
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    uploadFiles(files);
  };

  const handleDragAreaClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = async () => {
    const { name, price, description, media} = product;

    if (!name || !price || !description || media.length === 0) {
      return toast.error("Please fill name, price, description and upload at least one media file.");
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return toast.error("Price must be a valid number (digits only, no ₹ or commas).");
    }

    try {
      const submitProduct = {
        ...product,
        price: parsedPrice
      };

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const authHeaders = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

      if (editingId) {
        const res = await axios.put(`http://localhost:8080/api/products/${editingId}`, submitProduct, authHeaders);
        const updated = products.map(p => (p._id === editingId ? res.data : p));
        setProducts(updated);
        toast.success("Product updated!");
      } else {
        const res = await axios.post("http://localhost:8080/api/products", submitProduct, authHeaders);
        setProducts([...products, res.data]);
        toast.success("Product added!");
      }

      setProduct(initialProduct());
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit product.");
    }
  };

  const handleDelete = async (index) => {
    const productToDelete = products[index];
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.delete(`http://localhost:8080/api/products/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
      toast.success("Product deleted!");
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const removeMedia = (index) => {
    const updatedMedia = [...product.media];
    updatedMedia.splice(index, 1);
    setProduct({ ...product, media: updatedMedia });
  };

  return (
    <div style={{ padding: 40 }}>
      <div style={headerStyle}>
        <h1>Manage Products</h1>
        <button onClick={toggleForm} style={topButtonStyle}>
          {showForm ? 'Close' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <div style={popupOverlay}>
          <div style={popupContent}>
            <button onClick={toggleForm} style={closePopupButton}>×</button>
            <h2>{editingId ? "Edit Product" : "Add Product"}</h2>

            {/* Drag and Drop Upload Box */}
            <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={handleDragAreaClick} style={dragBoxStyle}>
              <input id="fileInput" type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              <div style={dragContentStyle}>
                <div style={dragIconStyle}>📁</div>
                <p style={dragTextStyle}>Drag and drop images/videos here</p>
                <p style={dragSubTextStyle}>or click to browse files</p>
                {uploading && <p style={uploadingTextStyle}>Uploading...</p>}
              </div>

              {product.media.length > 0 && (
                <div style={mediaPreviewContainerStyle}>
                  {product.media.map((item, i) => (
                    <div key={i} style={mediaItemStyle}>
                      {item.type === 'image' ? (
                        <img src={item.url} alt="media" style={mediaPreviewStyle} />
                      ) : (
                        <video src={item.url} style={mediaPreviewStyle} muted autoPlay loop />
                      )}
                      <button onClick={() => removeMedia(i)} style={removeMediaButtonStyle}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Text Inputs */}
            <input name="name" placeholder="Product Name" value={product.name} onChange={handleChange} style={inputStyle} />
            <input name="price" placeholder="Price" value={product.price} onChange={handleChange} style={inputStyle} />

            {/* Category Dropdown */}
            <h3>Category</h3>
<select
  name="category"
  value={product.category || ""}
  onChange={handleChange}
  style={inputStyle}
>
  <option value="">Select Category</option>
  <option value="solitaire">Solitaire</option>
  <option value="rings">Rings</option>
  <option value="pendant">Pendant</option>
  <option value="bracelet">Bracelet</option>
  <option value="mangalsutra_bracelet">Mangalsutra Bracelet</option>
  <option value="nosepin">Nosepin</option>
  <option value="watchpin">Watchpin</option>
  <option value="chain">Chain</option>
  <option value="rakhi_pendant">Rakhi Pendant</option>
  <option value="earrings">Earrings</option>
  <option value="bangles">Bangles</option>
  <option value="mangalsutra">Mangalsutra</option>
  <option value="necklace">Necklace</option>
  <option value="watch_charm">Watch Charm</option>
  <option value="souvenir">Souvenir</option>
</select>

<h3>Style</h3>
<select name="style" value={product.style || ""} onChange={handleChange} style={inputStyle}>
  <option value="">Select Style</option>

  {/* Earrings Styles */}
  {product.category === "earrings" && (
    <>
      <option value="chandelier">Chandelier</option>
      <option value="front_back">Front Back</option>
      <option value="sui_dhaga">Sui Dhaga</option>
      <option value="studs">Studs</option>
      <option value="floral">Floral</option>
      <option value="drops">Drops</option>
      <option value="jhumkas">Jhumkas</option>
      <option value="danglers">Danglers</option>
      <option value="hoops_huggies">Hoops & Huggies</option>
      <option value="hearts">Hearts</option>
      <option value="fashion">Fashion</option>
    </>
  )}

  {/* Rings Styles */}
  {product.category === "rings" && (
    <>
      <option value="dailywear">Dailywear</option>
      <option value="cocktail">Cocktail</option>
      <option value="bands">Bands</option>
      <option value="floral">Floral</option>
      <option value="adjustable">Adjustable</option>
      <option value="couple_bands">Couple Bands</option>
      <option value="engagement">Engagement</option>
      <option value="infinity">Infinity</option>
      <option value="fashion">Fashion</option>
    </>
  )}
</select>

            <h3>Metal Details</h3>
            <div style={gridStyle}>
              {renderInput("Karatage", "karatage", product.metalDetails.karatage, handleMetalChange)}
              {renderInput("Gross Weight", "grossWeight", product.metalDetails.grossWeight, handleMetalChange)}
              {renderInput("Metal", "metal", product.metalDetails.metal, handleMetalChange)}
              {renderInput("Height", "earringHeight", product.metalDetails.earringHeight, handleMetalChange)}
              {renderInput("Width", "earringWidth", product.metalDetails.earringWidth, handleMetalChange)}
              {renderInput("Material Colour", "materialColour", product.metalDetails.materialColour, handleMetalChange)}
            </div>

            <h3>General Details</h3>
            <div style={gridStyle}>
              {renderInput("Jewellery Type", "jewelleryType", product.generalDetails.jewelleryType, handleGeneralChange)}
              {renderInput("Product Type", "productType", product.generalDetails.productType, handleGeneralChange)}
              {renderInput("Brand", "brand", product.generalDetails.brand, handleGeneralChange)}

              <select name="collection" value={product.generalDetails.collection} onChange={handleGeneralChange} style={inputStyle}>
  <option value="">Select Collection</option>
  <option value="festive">Festive</option>
  <option value="bestseller">Bestseller</option>
  <option value="new_arrivals">New Arrivals</option>
  <option value="bridal">Bridal</option>
  <option value="everyday">Everyday</option>
  <option value="echo">Echo</option>
  <option value="akshaya">Akshaya</option>
  <option value="charms">Charms</option>
  <option value="evil-eye">Evil Eye</option>
  <option value="ti-amo">Ti Amo</option>
  <option value="tanishta">Tanishta</option>
  <option value="parineeta">Parineeta</option>
  <option value="tiny-tale">Tiny Tale</option>
  <option value="letter-of-love">Letter Of Love</option>
  <option value="orla">Orla</option>
  <option value="tisha">Tisha</option>
  <option value="aranka">Aranka</option>
  <option value="uphaar">Uphaar</option>
  <option value="panache">Panache</option>
</select>

              <select name="gender" value={product.generalDetails.gender} onChange={handleGeneralChange} style={inputStyle}>
                <option value="">Select Gender</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>

              <select name="occasion" value={product.generalDetails.occasion} onChange={handleGeneralChange} style={inputStyle}>
                <option value="">Select Occasion</option>
                <option value="daily_wear">Daily Wear</option>
                <option value="party">Party</option>
                <option value="wedding">Wedding</option>
                <option value="engagement">Engagement</option>
                <option value="office">Office</option>
              </select>
            </div>

            <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" style={{ ...inputStyle, height: 100 }} />

            <button onClick={handleSubmit} style={submitButtonStyle}>
              {editingId ? "Update Product" : "Submit Product"}
            </button>
          </div>
        </div>
      )}

      {/* Product Cards */}
      <div style={cardGridStyle}>
        {products.map((p, i) => (
          <div key={i} style={cardStyle}>
            {p.media[0]?.type === "image" ? (
              <img src={p.media[0].url} alt="img" onClick={() => setSelectedProduct(p)} style={cardImageStyle} />
            ) : (
              <video src={p.media[0].url} onClick={() => setSelectedProduct(p)} style={cardImageStyle} muted autoPlay loop />
            )}
            <h4>{p.name}</h4>
            <div style={{ display: 'flex' }}>
              <button style={editButtonStyle} onClick={() => {
                setProduct(p);
                setEditingId(p._id);
                setShowForm(true);
              }}>Edit</button>
              <button style={deleteButtonStyle} onClick={() => handleDelete(i)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Popup */}
      {selectedProduct && (
        <div style={popupOverlay}>
          <div style={popupContent}>
            <button onClick={() => setSelectedProduct(null)} style={closePopupButton}>×</button>
            <h2>{selectedProduct.name}</h2>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
              {selectedProduct.media.map((m, i) =>
                m.type === "image" ? (
                  <img key={i} src={m.url} style={popupMediaStyle} />
                ) : (
                  <video key={i} src={m.url} style={popupMediaStyle} controls />
                )
              )}
            </div>
            <p><b>Price:</b> ₹{selectedProduct.price}</p>
            <p><b>Description:</b> {selectedProduct.description}</p>
            <h4>Metal Details</h4>
            <ul>{Object.entries(selectedProduct.metalDetails).map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}</ul>
            <h4>General Details</h4>
            <ul>{Object.entries(selectedProduct.generalDetails).map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}</ul>
            <p><b>Style:</b> {selectedProduct.style}</p>
            <p><b>Category:</b> {selectedProduct.category}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper and styles
const initialProduct = () => ({
  name: '',
  price: '',
  description: '',
  category: '',
  media: [],
  metalDetails: {
    karatage: '',
    grossWeight: '',
    metal: '',
    earringHeight: '',
    earringWidth: '',
    materialColour: ''
  },
  generalDetails: {
    jewelleryType: '',
    productType: '',
    brand: '',
    collection: '',
    gender: '',
    occasion: ''
  },
  style: ''
});

const renderInput = (label, name, value, onChange) => (
  <input name={name} placeholder={label} value={value} onChange={onChange} style={inputStyle} />
);

// ✨ Your inline styles remain unchanged
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '2px solid #a67c00', paddingBottom: 20 };
const topButtonStyle = { background: '#a67c00', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', fontSize: 16, fontWeight: 'bold', cursor: 'pointer' };
const dragBoxStyle = { border: '3px dashed #a67c00', padding: 30, marginBottom: 20, textAlign: 'center', borderRadius: 12, backgroundColor: '#fafafa', cursor: 'pointer' };
const dragContentStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 };
const dragIconStyle = { fontSize: 48, opacity: 0.6 };
const dragTextStyle = { fontSize: 18, fontWeight: 'bold', color: '#a67c00', margin: 0 };
const dragSubTextStyle = { fontSize: 14, color: '#666', margin: 0 };
const uploadingTextStyle = { color: '#a67c00', fontWeight: 'bold', margin: 0 };
const mediaPreviewContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: 15, marginTop: 20, justifyContent: 'center' };
const mediaItemStyle = { position: 'relative', display: 'inline-block' };
const mediaPreviewStyle = { width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '2px solid #a67c00' };
const removeMediaButtonStyle = { position: 'absolute', top: -8, right: -8, background: '#ff4444', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 16, fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: 12, marginBottom: 12, borderRadius: 6, border: '1px solid #ddd' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 };
const submitButtonStyle = { background: '#6b4e16', color: '#fff', padding: '12px 24px', border: 'none', borderRadius: 8, marginTop: 20, cursor: 'pointer', fontWeight: 'bold' };
const cardGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginTop: 40 };
const cardStyle = { border: '1px solid #ccc', padding: 16, borderRadius: 10, textAlign: 'center' };
const cardImageStyle = { width: '100%', height: '180px', objectFit: 'cover', borderRadius: 6, cursor: 'pointer' };
const editButtonStyle = { flex: 1, marginRight: 5, background: '#795548', color: '#fff', padding: 8, border: 'none', borderRadius: 4, cursor: 'pointer' };
const deleteButtonStyle = { flex: 1, background: '#c62828', color: '#fff', padding: 8, border: 'none', borderRadius: 4, cursor: 'pointer' };
const popupOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, overflowY: 'auto', padding: 20 };
const popupContent = { background: '#fff', padding: 30, borderRadius: 15, maxWidth: 800, width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' };
const closePopupButton = { position: 'absolute', top: 15, right: 20, background: 'transparent', border: 'none', fontSize: 30, cursor: 'pointer', color: '#444' };
const popupMediaStyle = { width: 160, height: 160, objectFit: 'cover', borderRadius: 8, marginRight: 10 };

export default ManageProducts;