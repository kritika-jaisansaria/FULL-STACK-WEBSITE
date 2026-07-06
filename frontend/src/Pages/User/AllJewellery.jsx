import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import AllJewelleryTopBar from '../../Components/AllJewellery/AllJewelleryTopBar';
import ProductGrid from '../../Components/AllJewellery/ProductGrid';
import JewelryCategories from '../../Components/AllJewellery/JewelryCategories';
import WhyTanishq from '../../Components/Home/assurance';
import { CATEGORY_SLUG_MAP } from '../../utils/categoryRoutes';

const AllJewellery = () => {
  const location = useLocation();
  const { category, style: styleFromPath } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const style = styleFromPath || queryParams.get("style");
const gender = queryParams.get("gender");
const material = queryParams.get("material");
const occasion = queryParams.get("occasion");
const karatage = queryParams.get("karatage");
const minPrice = queryParams.get("minPrice");
const maxPrice = queryParams.get("maxPrice");
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Figure out if the current URL is a category page (e.g. /rings, /earrings)
  const slug = category || location.pathname.replace("/", "");

const routeFilter =
  CATEGORY_SLUG_MAP[slug] ||
  (category
    ? {
        type: "category",
        value: category.toLowerCase(),
        label:
          category.charAt(0).toUpperCase() + category.slice(1),
      }
    : null);

  useEffect(() => {
  const params = new URLSearchParams();

   if (routeFilter) {
    params.set(routeFilter.type, routeFilter.value);
  } else if (category) {
    params.set("category", category.toLowerCase());
  }

  // Style
  if (style) {
    params.append("style", style.toLowerCase());
  } 

  if (gender) {
  params.append("gender", gender);
}

if (material) {
  params.append("material", material);
}

if (occasion) {
  params.append("occasion", occasion);
}

if (karatage) {
  params.append("karatage", karatage);
}

if (minPrice) {
  params.append("minPrice", minPrice);
}

if (maxPrice) {
  params.append("maxPrice", maxPrice);
}

  fetch(`http://localhost:8080/api/products?${params.toString()}`)
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);
      setDisplayProducts(data);
    })
    .catch((err) => console.error(err));

}, [
  category,
  style,
  gender,
  material,
  occasion,
  karatage,
  minPrice,
  maxPrice,
]);

useEffect(() => {
  const filters = [];

  // Category
 if (routeFilter) {
    filters.push({
      type: routeFilter.type,
      value: routeFilter.value,
    });
  }

  // Style
  if (style) {
    filters.push({
      type: "style",
      value: style.toLowerCase(),
    });
  }

  // Gender
  if (gender) {
    filters.push({
      type: "gender",
      value: gender,
    });
  }

  // Material
  if (material) {
    filters.push({
      type: "material",
      value: material,
    });
  }

  // Occasion
  if (occasion) {
    filters.push({
      type: "occasion",
      value: occasion,
    });
  }

  // Karatage
  if (karatage) {
    filters.push({
      type: "karatage",
      value: karatage,
    });
  }

  // Price
  if (minPrice && maxPrice) {
    filters.push({
      type: "price",
      value: {
        min: Number(minPrice),
        max: Number(maxPrice),
      },
    });
  }

  setSelectedFilters(filters);
}, [
  routeFilter,
  style,
  gender,
  material,
  occasion,
  karatage,
  minPrice,
  maxPrice,
]);

  useEffect(() => {
  setDisplayProducts(products);
}, [products]);

  return (
    <div>
      {/* Only show the karat/category tiles on the main "All Jewellery" page,
          not on individual category pages like /rings */}
      {!routeFilter && <JewelryCategories />}

      {routeFilter && (
        <div style={{ padding: '30px 60px 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, color: '#5c1c1c', fontWeight: 500 }}>
            {routeFilter.label}
          </h1>
        </div>
      )}

      <AllJewelleryTopBar
        totalCount={displayProducts.length}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        products={displayProducts}
        setProducts={setDisplayProducts}
      />

      {/* Row 1: Product Cards */}
      <div style={{ padding: '0 60px' }}>
        {displayProducts.length > 0 ? (
          <ProductGrid products={displayProducts} />
        ) : (
          <p style={{ textAlign: 'center', padding: '60px 0', color: '#777' }}>
            No products found in this category yet.
          </p>
        )}
      </div>
      <WhyTanishq />
    </div>
  );
};

export default AllJewellery;