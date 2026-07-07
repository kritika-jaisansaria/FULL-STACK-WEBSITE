import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from '../../Components/Cart/CartItem';
import CartSummary from '../../Components/Cart/CartSummary';
import EmptyCart from '../../Components/Cart/EmptyCart';

const Cart = () => {
  const { cartItems, initialLoad } = useCart();

  // Show loading while fetching cart for the first time
  if (initialLoad) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px',
          fontSize: '18px',
          color: '#7b2424',
          fontWeight: '500',
        }}
      >
        Loading your cart...
      </div>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        padding: '2rem',
        alignItems: 'flex-start',
      }}
    >
      {/* Cart Items */}
      <div
        style={{
          flex: '2',
          minWidth: '320px',
        }}
      >
        {cartItems.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>

      {/* Cart Summary */}
      <div
        style={{
          flex: '1',
          minWidth: '300px',
        }}
      >
        <CartSummary />
      </div>
    </div>
  );
};

export default Cart;