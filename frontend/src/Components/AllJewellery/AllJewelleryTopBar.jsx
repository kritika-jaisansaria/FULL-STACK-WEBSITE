
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { FILTER_CONFIG } from "../../utils/filterConfig";

const FILTER_OPTIONS = [
  {
    label: "₹25,000 - ₹50,000",
    type: "price",
    value: {
      min: 25000,
      max: 50000,
    },
  },

  {
    label: "Men",
    type: "gender",
    value: "men",
  },

  {
    label: "Women",
    type: "gender",
    value: "women",
  },

  {
    label: "Kids",
    type: "gender",
    value: "kids",
  },

  {
    label: "Gold",
    type: "material",
    value: "gold",
  },

  {
    label: "22K",
    type: "karatage",
    value: "22",
  },

  {
    label: "Daily Wear",
    type: "occasion",
    value: "daily_wear",
  },

  {
    label: "Party",
    type: "occasion",
    value: "party",
  },

  {
    label: "Wedding",
    type: "occasion",
    value: "wedding",
  },

  {
    label: "Office",
    type: "occasion",
    value: "office",
  },
];



const SORT_OPTIONS = [
  'Best Matches',
  'Price : Low To High',
  'Price : High To Low'
];

const AllJewelleryTopBar = ({
  totalCount,
  selectedFilters,
  setSelectedFilters,
  products,
  setProducts
}) => {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
const location = useLocation();
const category = location.pathname.split("/")[1];

const config = FILTER_CONFIG[category] || {
  styles: [],
  materials: [],
  genders: [],
};
const dynamicFilters = [
  ...config.styles.map((style) => ({
    label: style
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    type: "style",
    value: style,
  })),

  ...config.materials.map((material) => ({
    label: material.charAt(0).toUpperCase() + material.slice(1),
    type: "material",
    value: material,
  })),

  ...config.genders.map((gender) => ({
    label: gender.charAt(0).toUpperCase() + gender.slice(1),
    type: "gender",
    value: gender,
  })),
];
console.log(config);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Best Matches');

  const toggleFilter = (filter) => {
  const exists = selectedFilters.find(
    (f) =>
      f.type === filter.type &&
      JSON.stringify(f.value) === JSON.stringify(filter.value)
  );

  let updatedFilters;

  if (exists) {
    updatedFilters = selectedFilters.filter(
      (f) =>
        !(
          f.type === filter.type &&
          JSON.stringify(f.value) === JSON.stringify(filter.value)
        )
    );
  } else {
    updatedFilters = [...selectedFilters, filter];
  }

  setSelectedFilters(updatedFilters);

  // ----------------------------
  // Update URL Query Parameters
  // ----------------------------
  const params = new URLSearchParams(location.search);

  // Remove old values
  params.delete("gender");
  params.delete("material");
  params.delete("occasion");
  params.delete("karatage");
  params.delete("minPrice");
  params.delete("maxPrice");

  // Add new values
  updatedFilters.forEach((f) => {
    switch (f.type) {
      case "style":
  params.set("style", f.value);
  break;
      case "gender":
        params.set("gender", f.value);
        break;

      case "material":
        params.set("material", f.value);
        break;

      case "occasion":
        params.set("occasion", f.value);
        break;

      case "karatage":
        params.set("karatage", f.value);
        break;

      case "price":
        params.set("minPrice", f.value.min);
        params.set("maxPrice", f.value.max);
        break;

      default:
        break;
    }
  });

  navigate({
    pathname: location.pathname,
    search: params.toString(),
  });
};

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortDropdownOpen(false);

    let sortedProducts = [...products];

    if (option === 'Price : Low To High') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === 'Price : High To Low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setProducts(sortedProducts);
  };

  const shownFilters = dynamicFilters.slice(0, 4);
const hiddenFilters = dynamicFilters.slice(4);

  return (
    <>
      {/* Background overlay removed as requested */}

      <div style={topBarContainer}>
        <h1 style={headingStyle}>
          All Jewellery <span style={resultCount}>({totalCount} results)</span>
        </h1>

        <div style={filterBar}>
          {/* Left: Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', marginRight: '16px' }}>
                <button style={filterButton}>
                  <FaFilter style={{ marginRight: '6px' }} />
                  Filter <span style={{ transform: 'rotate(90deg)', fontSize: '10px', marginLeft: '4px' }}>▼</span>
                </button>
                {selectedFilters.length > 0 && <span style={badge}>{selectedFilters.length}</span>}
              </div>

              {shownFilters.map((filter, index) => {
                const isActive = selectedFilters.some(
                  f => f.type === filter.type && f.value.toString() === filter.value.toString()
                );
                return (
                  <button
                    key={index}
                    onClick={() => toggleFilter(filter)}
                    style={isActive ? selectedPillStyle : pillStyle}
                  >
                    {isActive ? (
                      <>
                        {filter.label}
                        <IoClose style={{ marginLeft: '6px' }} />
                      </>
                    ) : (
                      <>
                        <FaPlus style={{ marginRight: '6px', fontSize: '10px' }} />
                        {filter.label}
                      </>
                    )}
                  </button>
                );
              })}

              <span onClick={() => setShowMore(!showMore)} style={showMoreStyle}>
                {showMore ? '- Show Less' : '+ Show More'}
              </span>
            </div>

            {showMore && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {hiddenFilters.map((filter, index) => {
                  const isActive = selectedFilters.some(
                    f => f.type === filter.type && f.value.toString() === filter.value.toString()
                  );
                  return (
                    <button
                      key={index}
                      onClick={() => toggleFilter(filter)}
                      style={isActive ? selectedPillStyle : pillStyle}
                    >
                      {isActive ? (
                        <>
                          {filter.label}
                          <IoClose style={{ marginLeft: '6px' }} />
                        </>
                      ) : (
                        <>
                          <FaPlus style={{ marginRight: '6px', fontSize: '10px' }} />
                          {filter.label}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Sort By */}
          <div style={{ position: 'relative', zIndex: 9999 }}>
            <div
              style={{
                ...sortByWrapper,
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            >
              Sort By: <span style={sortValue}>{selectedSort} ▼</span>
            </div>

            {sortDropdownOpen && (
              <div style={dropdownStyle}>
                <div style={dropdownHeaderStyle}>
                  Sort By
                  <span
                    style={closeButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortDropdownOpen(false);
                    }}
                  >
                    ×
                  </span>
                </div>
                {SORT_OPTIONS.slice(1).map((option, index) => (
                  <div
                    key={index}
                    style={{
                      ...dropdownItemStyle,
                      backgroundColor: selectedSort === option ? '#f2f2f2' : 'transparent',
                      fontWeight: selectedSort === option ? '600' : '400',
                      color: selectedSort === option ? '#8B4513' : '#333',
                    }}
                    onClick={() => handleSortSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllJewelleryTopBar;

const topBarContainer = {
  padding: '20px 60px 30px',
  background: '#fff',
  paddingLeft: '140px',
  position: 'relative',
  zIndex: 10,
};

const headingStyle = {
  fontSize: '28px',
  fontWeight: '500',
  color: '#5c1c1c',
  marginBottom: '16px',
};

const resultCount = {
  color: '#777',
  fontSize: '20px',
};

const filterBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '20px',
  flexWrap: 'nowrap',
};

const filterButton = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  padding: '10px 16px',
  borderRadius: '24px',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};

const badge = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  backgroundColor: 'red',
  color: '#fff',
  fontSize: '12px',
  borderRadius: '50%',
  padding: '2px 6px',
};

const pillStyle = {
  backgroundColor: '#fff',
  border: '1px solid #d3b5b5',
  color: '#7a2626',
  fontWeight: '500',
  borderRadius: '24px',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  cursor: 'pointer',
};

const selectedPillStyle = {
  ...pillStyle,
  backgroundColor: '#f2f2f2',
  border: '1px solid #7a2626',
};

const showMoreStyle = {
  color: '#7a2626',
  fontWeight: '500',
  fontSize: '14px',
  padding: '10px 10px',
  cursor: 'pointer',
};

const sortByWrapper = {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '24px',
  padding: '10px 16px',
  fontSize: '14px',
  whiteSpace: 'nowrap',
};

const sortValue = {
  fontWeight: '600',
  marginLeft: '4px',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  right: 0,
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  zIndex: 9999,
  minWidth: '280px',
  marginTop: '8px',
  padding: '0',
};

const dropdownHeaderStyle = {
  padding: '16px 20px',
  fontSize: '16px',
  fontWeight: '600',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#333',
};

const closeButtonStyle = {
  fontSize: '20px',
  cursor: 'pointer',
  color: '#666',
  lineHeight: '1',
  padding: '4px',
};

const dropdownItemStyle = {
  padding: '16px 20px',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};
