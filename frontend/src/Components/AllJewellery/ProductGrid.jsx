import React, { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import DailywearCarousel from './DailywearCarousel';
import FadeInWrapper from './FadeInWrapper';

/**
 * Lazy‑loading grid for All Jewellery.
 * - First 7 items keep the special layout: 3 cards, 1 card + carousel, 3 cards.
 * - Remaining items are added in batches as the user scrolls.
 */
const LOAD_BATCH = 6; // number of items to add each scroll trigger

const ProductGrid = ({ products }) => {
  // split first 7 items for the special layout
  const row1 = products.slice(0, 3);
  const row2 = products.slice(3, 4); // single featured product
  const row3 = products.slice(4, 7);

  // state for lazy‑loaded items after the initial 7
  const [visibleCount, setVisibleCount] = useState(7);
  const loaderRef = useRef(null);

  // IntersectionObserver to load more when sentinel appears
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && visibleCount < products.length) {
        setVisibleCount((prev) => Math.min(prev + LOAD_BATCH, products.length));
      }
    }, { rootMargin: '200px' });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, products.length]);

  // products after the first 7 that should be displayed now
  const extraProducts = products.slice(7, visibleCount);

  return (
    <div style={gridWrapper}>
      {/* Row 1: 3 products */}
      <div style={gridStyleRow1}>
        {row1.map((product) => (
          <FadeInWrapper key={product._id}>
            <ProductCard product={product} />
          </FadeInWrapper>
        ))}
      </div>

      {/* Row 2: 1 product + carousel */}
      <div style={row2Wrapper}>
        {row2[0] && (
          <FadeInWrapper>
            <div style={{ flex: 2 }}>
              <ProductCard product={row2[0]} />
            </div>
          </FadeInWrapper>
        )}
        <div style={{ flex: 1 }}>
          <DailywearCarousel />
        </div>
      </div>

      {/* Row 3: 3 products */}
      <div style={gridStyleRow1}>
        {row3.map((product) => (
          <FadeInWrapper key={product._id}>
            <ProductCard product={product} />
          </FadeInWrapper>
        ))}
      </div>

      {/* Additional products loaded lazily */}
      {extraProducts.length > 0 && (
        <div style={gridStyleRow1}>
          {extraProducts.map((product) => (
            <FadeInWrapper key={product._id}>
              <ProductCard product={product} />
            </FadeInWrapper>
          ))}
        </div>
      )}

      {/* Sentinel element for IntersectionObserver */}
      <div ref={loaderRef} />
    </div>
  );
};

export default ProductGrid;

// === Styles ===
const gridWrapper = {
  width: '100%',
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
  width: '100%',
};
