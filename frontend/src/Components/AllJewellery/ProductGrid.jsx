import React from 'react';
import ProductCard from './ProductCard';
import DailywearCarousel from './DailywearCarousel';

const ProductGrid = ({ products }) => {
  const row1 = products.slice(0, 3);
  const row2 = products.slice(3, 4); // 1 product
  const row3 = products.slice(4, 7);

  return (
    <div style={gridWrapper}>
      {/* Row 1: 3 products */}
      <div style={gridStyleRow1}>
        {row1.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Row 2: 1 product + carousel */}
      <div style={row2Wrapper}>
        {row2[0] && (
          <div style={{ flex: 1 }}>
            <ProductCard product={row2[0]} />
          </div>
        )}
        <div style={{ flex: 2 }}>
          <DailywearCarousel />
        </div>
      </div>
      <div style={gridStyleRow1}>
        {row3.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

// === Styles ===
const gridWrapper = {
  padding: '0 60px',
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
};

const gridStyleRow1 = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '40px',
};

const row2Wrapper = {
  display: 'flex',
  gap: '40px',
};
