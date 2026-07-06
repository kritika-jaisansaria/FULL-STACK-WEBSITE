import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductHeader from '../../Components/ProductDetails/ProductHeader';
import ProductImageGallery from '../../Components/ProductDetails/ProductImageGallery';
import DeliveryDetailsForm from '../../Components/ProductDetails/DeliveryDetailsForm';
import Recommendations from '../../Components/ProductDetails/Recommendations';
import WhyTanishq from '../../Components/Home/assurance';
import CustomerReviews from '../../Components/ProductDetails/CustomerReviews';
import FixedBottomBar from '../../Components/ProductDetails/FixedBottomBar';
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
  fetch(`http://localhost:8080/api/products/${id}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Product not found');
      }
      return res.json();
    })
    .then(data => setProduct(data))
    .catch(err => {
      console.error(err);
      setProduct(null); // optional
    });
}, [id]);


  if (!product) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: 'auto' }}>
      <ProductHeader _id={product._id}  name={product.name} price={product.price}  media={product.media} />
      <ProductImageGallery media={product.media} />
      <DeliveryDetailsForm product={product} />
      <Recommendations />
      <CustomerReviews/>
      <WhyTanishq/>
         <FixedBottomBar product={product} />

    </div>
    
  );
};

export default ProductDetails;
