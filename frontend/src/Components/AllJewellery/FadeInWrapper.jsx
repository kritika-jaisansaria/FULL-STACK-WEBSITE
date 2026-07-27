import React, { useEffect, useRef, useState } from 'react';

/**
 * Wraps children and applies a fade‑in + slide‑up animation when the element scrolls into view.
 */
const FadeInWrapper = ({ children }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
};

export default FadeInWrapper;
