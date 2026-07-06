import React from 'react';

const ProductImageGallery = ({ media }) => {
  const images = media?.filter(m => m.type === 'image') || [];

  const chunkImages = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        alignItems: 'center',
      }}
    >
      {chunkImages(images, 2).map((row, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {row.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`product-${i}`}
              style={{
                width: row.length === 1 ? '68%' : '78%',  // ✅ SAME width for all
                height: '600px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductImageGallery;
