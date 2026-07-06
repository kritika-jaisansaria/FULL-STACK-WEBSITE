import React from 'react';
import ringImg from '../../assets/images/ring.jpg';
import earringsImg from '../../assets/images/earrings.png';
import mangalsutraImg from '../../assets/images/mangalsutra.png';

const JewelryCategories = () => {
  const categories = [
    {
      id: '14kt',
      title: '14',
      image: ringImg,
    },
    {
      id: '18kt',
      title: '18',
      image: earringsImg,
    },
    {
      id: '22kt',
      title: '22',
      image: mangalsutraImg,
    }
  ];

  const handleCategoryClick = (category) => {
    console.log(`Filtering by ${category.title}`);
    if (setSelectedFilters) {
      setSelectedFilters(prevFilters => {
        const otherFilters = prevFilters.filter(f => f.type !== 'karatage');
        return [...otherFilters, { type: 'karatage', value: category.filterValue }];
      });
    }

    const productsSection = document.querySelector('[style*="padding: 0 60px"]');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBreadcrumbClick = (page) => {
    console.log(`Navigating to ${page}`);
    if (page === 'Home') {
      navigate('/');
    } else if (page === 'All Jewellery') {
      if (setSelectedFilters) {
        setSelectedFilters([]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={containerStyle}>
      {/* Page Title */}
      <h1 style={titleStyle}>All Jewellery</h1>

      {/* Category Cards */}
      <div style={categoriesGridStyle}>
        {categories.map((category) => (
          <div
            key={category.id}
            style={categoryCardStyle}
            onClick={() => handleCategoryClick(category)}
          >
            <div style={imageContainerStyle}>
              <img
                src={category.image}
                alt={category.title}
                style={categoryImageStyle}
              />
            </div>
            <div style={categoryContentStyle}>
              <h3 style={karatTextStyle}>{category.title} Kt</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Breadcrumb */}
      <div style={breadcrumbStyle}>
        <span
          style={breadcrumbLinkStyle}
          onClick={() => handleBreadcrumbClick('Home')}
        >
          Home
        </span>
        <span style={breadcrumbSeparatorStyle}>&gt;</span>
        <span
          style={breadcrumbCurrentStyle}
          onClick={() => handleBreadcrumbClick('All Jewellery')}
        >
          All Jewellery
        </span>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '40px 20px',
  paddingTop:'10px',
  backgroundColor: '#EFECE8', // slightly darker, warm tone background
  fontFamily: `'Georgia', serif`,
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '600',
  color: '#1f1f1f',
  marginBottom: '30px',
};

const categoriesGridStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  flexWrap: 'wrap',
};

const categoryCardStyle = {
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const imageContainerStyle = {
  width: '180px',
  height: '180px',
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const categoryImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const categoryContentStyle = {
  marginTop: '10px',
};

const karatTextStyle = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#1f1f1f',
  margin: 0,
};

const breadcrumbStyle = {
  display: 'flex',
  justifyContent: 'flex-start', // 👈 move to the left
  alignItems: 'center',
  gap: '8px',
  fontSize: '18px',
  color: '#666',
  marginTop: '30px',
  paddingLeft: '60px', // 👈 adjust this value as needed
};


const breadcrumbLinkStyle = {
  color: '#8B0000',
  cursor: 'pointer',
  fontWeight: '500',
};

const breadcrumbSeparatorStyle = {
  color: '#999',
  fontSize: '18px',
};

const breadcrumbCurrentStyle = {
  color: '#8B0000',
  fontWeight: '600',
  cursor: 'pointer',
};

export default JewelryCategories;
