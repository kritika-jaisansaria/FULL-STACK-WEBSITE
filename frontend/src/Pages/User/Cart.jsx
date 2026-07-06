import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from '../../Components/Cart/CartItem';
import CartSummary from '../../Components/Cart/CartSummary';
import EmptyCart from '../../Components/Cart/EmptyCart';

const Cart = () => {
  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div style={{ display: 'flex', padding: '2rem', gap: '2rem' }}>
      {/* Left Side - Cart Items */}
      <div style={{ flex: 2 }}>
        {cartItems.map(item => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>

      {/* Right Side - Summary */}
      <CartSummary />
    </div>
  );
};

export default Cart;
