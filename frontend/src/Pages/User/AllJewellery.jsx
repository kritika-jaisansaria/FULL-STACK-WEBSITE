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
  const collection = queryParams.get("collection");
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

  // ---- Effect 1: build query params from route + query string, fetch products ----
  useEffect(() => {
    const params = new URLSearchParams();

    // The :category URL segment can mean different backend filters depending
    // on the slug (see CATEGORY_SLUG_MAP): a real category (rings, earrings),
    // a gender shortcut (/male), or an occasion (/daily-wear, /wedding)
    // or material (/gold, /diamond) shortcut. Send whichever field it actually maps to.
    if (routeFilter) {
      params.set(routeFilter.type, routeFilter.value);
    } else if (category) {
      params.set("category", category.toLowerCase());
    }

    if (style) {
      params.set("style", style.toLowerCase());
    }

    if (gender) {
      params.set("gender", gender);
    }

    if (material) {
      params.set("material", material);
    }

    if (collection) {
      params.set("collection", collection);
    }

    if (occasion) {
      params.set("occasion", occasion);
    }

    if (karatage) {
      params.set("karatage", karatage);
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
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
    routeFilter,
    style,
    gender,
    material,
    collection,
    occasion,
    karatage,
    minPrice,
    maxPrice,
  ]);

  // ---- Effect 2: build the filter-chip list shown in the top bar ----
  useEffect(() => {
    const filters = [];

    // Category / gender / occasion / material — whatever the route slug maps to
    if (routeFilter) {
      filters.push({
        type: routeFilter.type,
        value: routeFilter.value,
      });
    }

    if (style) {
      filters.push({
        type: "style",
        value: style.toLowerCase(),
      });
    }

    if (gender) {
      filters.push({
        type: "gender",
        value: gender,
      });
    }

    if (material) {
      filters.push({
        type: "material",
        value: material,
      });
    }

    if (collection) {
      filters.push({
        type: "collection",
        value: collection,
      });
    }

    if (occasion) {
      filters.push({
        type: "occasion",
        value: occasion,
      });
    }

    if (karatage) {
      filters.push({
        type: "karatage",
        value: karatage,
      });
    }

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
    collection,
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