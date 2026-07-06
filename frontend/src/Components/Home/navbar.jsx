import React, { useState } from 'react';
import {
  FaGem, FaRing, FaCrown, FaBoxOpen, FaStar,
  FaShoppingBag, FaHeart, FaUserFriends, FaPhone
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import jewelleryImage from '../../assets/images/dropdown1.webp';
import { CATEGORY_SLUG_MAP } from "../../utils/categoryRoutes";
const navItems = [
  { icon: <FaGem />, label: 'All Jewellery', path: '/all-jewellery', dropdown: true },
  { icon: <FaCrown />, label: 'Gold', path: '/gold', dropdown: true },
  { icon: <FaStar />, label: 'Diamond', path: '/diamond', dropdown: true },
  { icon: <FaRing />, label: 'Earrings', path: '/earrings', dropdown: true },
  { icon: <FaHeart />, label: 'Rings', path: '/rings', dropdown: true },
  { icon: <FaBoxOpen />, label: 'Daily Wear', path: '/daily-wear', dropdown: true },
  { icon: <FaShoppingBag />, label: 'Collections', path: '/collections', dropdown: true },
  { icon: <FaUserFriends />, label: 'Wedding', path: '/wedding', dropdown: true },
  { icon: <FaPhone />, label: 'Contact', path: '/contact', dropdown: false }
];

const getCategoryPath = (categoryValue) => {
  const entry = Object.entries(CATEGORY_SLUG_MAP).find(
    ([, value]) =>
      value.type === "category" && value.value === categoryValue
  );

  return entry ? `/${entry[0]}` : "/all-jewellery";
};

const Navbar = () => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const buildFilterLink = (filters) => {
    const isSamePage = basePath === location.pathname;
 const params = new URLSearchParams(isSamePage ? location.search : "");

  Object.entries(filters).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

   return `${basePath}?${params.toString()}`;
};

  return (
    <>
      <style>{`
        .nav-wrapper {
          width: 100vw;
          background-color: white;
          border-bottom: 1px solid #ccc;
          position: relative;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 40px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .nav-item-wrapper {
          position: relative;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 16px;
          color: #494F55;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
          padding: 10px;
        }

        .nav-item-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: inherit;
          text-decoration: none;
        }

        .nav-item:hover {
          color: #b8860b;
        }

        .nav-item svg {
          font-size: 24px;
          margin-bottom: 4px;
          color: #494F55;
          transition: color 0.3s ease;
        }

        .nav-item:hover svg {
          color: #b8860b;
        }

        .nav-item span {
          color: #494F55;
          text-decoration: none;
          font-size: 16px;
          transition: color 0.3s ease;
        }

        .nav-item:hover span {
          color: #b8860b;
          text-decoration: underline;
        }

        .mega-dropdown {
          width: 1420px;
          height: 400px;
          position: absolute;
          top: calc(100% - 1px);
  left: 40px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          padding: 50px 80px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          gap: 0px;
        }

        .dropdown-column {
          display: flex;
          flex-direction: column;
        }

        .dropdown-column h4 {
          font-size: 24px;
          color: #494F55;
          margin-bottom: 14px;
          font-weight: 600;
        }

        .dropdown-item {
          padding: 8px 16px;
          text-decoration: none;
          color: rgb(62, 15, 15);
          font-weight: 600;
          display: block;
          font-size: 15px;
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
          color: #b8860b;
        }

        .dropdown-image {
          flex-shrink: 0;
        }

        .dropdown-image img {
          width: 350px;
          height: 300px;
          object-fit: contain;
          border-radius: 10px;
        }

        .view-all-button {
          width:200px;
          background-color: #b8860b;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 20px;
          display: inline-block;
        }
      `}</style>
      <div className="nav-wrapper">
        <div className="nav-container">
          {navItems.map((item, index) => (
            <div
              className="nav-item-wrapper"
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="nav-item">
                <Link to={item.path} className="nav-item-link">
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mega Dropdown */}
        {hoveredIndex !== null && navItems[hoveredIndex].dropdown && (
          <div
            className="mega-dropdown"
            onMouseEnter={() => setHoveredIndex(hoveredIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {(() => {
              const label = navItems[hoveredIndex].label;

              if (label === 'Earrings') {
  return (
    <>
      <div className="dropdown-column">
        <h4>By Style</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="dropdown-item" to="/earrings/chandelier">Chandelier</Link>
            <Link className="dropdown-item" to="/earrings/front_back">Front Back</Link>
            <Link className="dropdown-item" to="/earrings/sui-dhaga">Sui Dhaga</Link>
            <Link className="dropdown-item" to="/earrings/studs">Studs</Link>
            <Link className="dropdown-item" to="/earrings/floral">Floral</Link>
            <Link className="dropdown-item" to="/earrings/drops">Drops</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="dropdown-item" to="/earrings/jhumkas">Jhumkas</Link>
            <Link className="dropdown-item" to="/earrings/danglers">Danglers</Link>
            <Link className="dropdown-item" to="/earrings/hoops_huggies">Hoops & Huggies</Link>
            <Link className="dropdown-item" to="/earrings/hearts">Hearts</Link>
            <Link className="dropdown-item" to="/earrings/fashion">Fashion</Link>
          </div>
        </div>
        <Link to="/earrings" className="view-all-button">View All</Link>
      </div>

      <Link className="dropdown-item" to={buildFilterLink({ material: "gold" })}>
  Gold
</Link>

<Link className="dropdown-item" to={buildFilterLink({ material: "diamond" })}>
  Diamond
</Link>

<Link className="dropdown-item" to={buildFilterLink({ material: "gemstone" })}>
  Gemstone
</Link>

      <div className="dropdown-column">
        <h4>By Price</h4>
        <Link className="dropdown-item" to="/earrings?maxPrice=10000">
  Under 10k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({
  minPrice: 10000,
  maxPrice: 20000,
})}>
  10k–20k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({
  minPrice: 20000,
  maxPrice: 30000,
})}>
  20k–30k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 30000, maxPrice: 40000 })}>
  30k–40k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 40000, maxPrice: 50000 })}>
  40k–50k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 50000, maxPrice: 60000 })}>
  50k–60k
</Link>
      </div>

      <Link className="dropdown-item" to={buildFilterLink({ gender: "men" })}>
  Male
</Link>

<Link className="dropdown-item" to={buildFilterLink({ gender: "women" })}>
  Female
</Link>

<Link className="dropdown-item" to={buildFilterLink({ gender: "kids" })}>
  Kids
</Link>

      <div className="dropdown-image">
        <img src={jewelleryImage} alt="jewellery" />
      </div>
    </>
  );
}

if (label === 'Rings') {
  return (
    <>
      <div className="dropdown-column" style={{ flex: '1' }}>
        <h4>By Style</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="dropdown-item" to="/rings/dailywear">Dailywear</Link>
            <Link className="dropdown-item" to="/rings/cocktail">Cocktail</Link>
            <Link className="dropdown-item" to="/rings/bands">Bands</Link>
            <Link className="dropdown-item" to="/rings/floral">Floral</Link>
            <Link className="dropdown-item" to="/rings/adjustable">Adjustable</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="dropdown-item" to="/rings/couple-bands">Couple Bands</Link>
            <Link className="dropdown-item" to="/rings/engagement">Engagement</Link>
            <Link className="dropdown-item" to="/rings/infinity">Infinity</Link>
            <Link className="dropdown-item" to="/rings/fashion">Fashion</Link>
          </div>
        </div>
        <Link to="/rings" className="view-all-button">View All Rings</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Price</h4>
        <Link className= "dropdown-item" to={buildFilterLink({
    maxPrice:10000
})}>Under 10k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 10000, maxPrice: 20000 })}>
  10k–20k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 20000, maxPrice: 30000 })}>
  20k–30k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 30000, maxPrice: 40000 })}>
  30k–40k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 40000, maxPrice: 50000 })}>
  40k–50k
</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 50000, maxPrice: 60000 })}>
  50k–60k
</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Material</h4>
        <Link
  className="dropdown-item"
  to={buildFilterLink({ material: "gold" })}
>
  Gold
</Link>

<Link
  className="dropdown-item"
  to={buildFilterLink({ material: "diamond" })}
>
  Diamond
</Link>

<Link
  className="dropdown-item"
  to={buildFilterLink({ material: "gemstone" })}
>
  Gemstone
</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Gender</h4>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "men" })}>Male</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "women" })}>Female</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "kids" })}>Kids</Link>
      </div>

      <div className="dropdown-image" style={{ flexShrink: 0 }}>
        <img src={jewelleryImage} alt="rings" />
      </div>
    </>
  );
}


if (label === 'Collections') {
  return (
    <>
      <div className="dropdown-column" style={{ flex: '1.2' }}>
        <h4>By Type</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "echo" }, "/collections")}>Echo</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "akshaya" }, "/collections")}>Akshaya</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "charms" }, "/collections")}>Charms</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "evil-eye" }, "/collections")}>Evil Eye</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "ti-amo" }, "/collections")}>Ti Amo</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "tanishta" }, "/collections")}>Tanishta</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "parineeta" }, "/collections")}>Parineeta</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "tiny-tale" }, "/collections")}>Tiny Tale</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "letter-of-love" }, "/collections")}>Letter Of Love</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "orla" }, "/collections")}>Orla</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "tisha" }, "/collections")}>Tisha</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "aranka" }, "/collections")}>Aranka</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "uphaar" }, "/collections")}>Uphaar</Link>
            <Link className="dropdown-item" to={buildFilterLink({ collection: "panache" }, "/collections")}>Panache</Link>
          </div>
        </div>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Gender</h4>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "men" }, "/collections")}>Male</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "women" }, "/collections")}>Female</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "kids" }, "/collections")}>Kids</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Price</h4>
        <Link className="dropdown-item" to={buildFilterLink({ maxPrice: 10000 }, "/collections")}>Under 10k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 10000, maxPrice: 20000 }, "/collections")}>10k–20k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 20000, maxPrice: 30000 }, "/collections")}>20k–30k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 30000, maxPrice: 40000 }, "/collections")}>30k–40k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 40000, maxPrice: 50000 }, "/collections")}>40k–50k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 50000, maxPrice: 60000 }, "/collections")}>50k–60k</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Material</h4>
        <Link className="dropdown-item" to={buildFilterLink({ material: "gold" }, "/collections")}>Gold</Link>
        <Link className="dropdown-item" to={buildFilterLink({ material: "diamond" }, "/collections")}>Diamond</Link>
        <Link className="dropdown-item" to={buildFilterLink({ material: "gemstone" }, "/collections")}>Gemstone</Link>
      </div>

      <div className="dropdown-image" style={{ flexShrink: 0 }}>
        <img src={jewelleryImage} alt="collections" />
      </div>
    </>
  );
}

if (label === 'Daily Wear') {
  return (
    <>
      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Price</h4>
        <Link className="dropdown-item" to={buildFilterLink({ maxPrice: 10000 }, "/daily-wear")}>Under 10k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 10000, maxPrice: 20000 }, "/daily-wear")}>10k–20k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 20000, maxPrice: 30000 }, "/daily-wear")}>20k–30k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 30000, maxPrice: 40000 }, "/daily-wear")}>30k–40k</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Material</h4>
        <Link className="dropdown-item" to={buildFilterLink({ material: "gold" }, "/daily-wear")}>Gold</Link>
        <Link className="dropdown-item" to={buildFilterLink({ material: "diamond" }, "/daily-wear")}>Diamond</Link>
        <Link className="dropdown-item" to={buildFilterLink({ material: "gemstone" }, "/daily-wear")}>Gemstone</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Gender</h4>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "men" }, "/daily-wear")}>Male</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "women" }, "/daily-wear")}>Female</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "kids" }, "/daily-wear")}>Kids</Link>
      </div>

      <div className="dropdown-image" style={{ flexShrink: 0 }}>
        <img src={jewelleryImage} alt="daily wear" />
      </div>
    </>
  );
}

if (label === 'Wedding') {
  return (
    <>
      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Price</h4>
        <Link className="dropdown-item" to={buildFilterLink({ maxPrice: 30000 }, "/wedding")}>Under 30k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 30000, maxPrice: 50000 }, "/wedding")}>30k–50k</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 50000, maxPrice: 100000 }, "/wedding")}>50k–1L</Link>
        <Link className="dropdown-item" to={buildFilterLink({ minPrice: 100000 }, "/wedding")}>Above 1L</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Material</h4>
        <Link className="dropdown-item" to={buildFilterLink({ material: "gold" }, "/wedding")}>Gold</Link>
        <Link className="dropdown-item" to={buildFilterLink({ material: "diamond" }, "/wedding")}>Diamond</Link>
        <Link className="dropdown-item" to={buildFilterLink({ material: "gemstone" }, "/wedding")}>Gemstone</Link>
      </div>

      <div className="dropdown-column" style={{ flex: '0.7' }}>
        <h4>By Gender</h4>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "men" }, "/wedding")}>Male</Link>
        <Link className="dropdown-item" to={buildFilterLink({ gender: "women" }, "/wedding")}>Female</Link>
      </div>

      <div className="dropdown-image" style={{ flexShrink: 0 }}>
        <img src={jewelleryImage} alt="wedding" />
      </div>
    </>
  );
}
             

              if (label === 'Contact') {
                return (
                  <div className="dropdown-column">
                    <h4>Contact Us</h4>
                    <Link className="dropdown-item" to="/contact">Get in Touch</Link>
                    <Link className="dropdown-item" to="/support">Support</Link>
                  </div>
                );
              }

              // Default Mega Dropdown
              return (
                <>
                  <div className="dropdown-column">
                    <h4>By Category</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link className="dropdown-item" to="/solitaire">Solitaire</Link>
                        <Link className="dropdown-item" to="/rings">Rings</Link>
                        <Link className="dropdown-item" to={getCategoryPath("pendant")}>
                          Pendants
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("bracelet")}>
                          Bracelets
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("mangalsutra_bracelet")}>
                          Mangalsutra Bracelets
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("nosepin")}>
                          Nosepin
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("watchpin")}>
                          Watch Pin
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("chain")}>
                          Chain
                        </Link>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link className="dropdown-item" to={getCategoryPath("rakhi_pendant")}>
                          Rakhi Pendants
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("earrings")}>
                          Earrings
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("bangles")}>
                          Bangles
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("mangalsutra")}>
                          Mangalsutra
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("necklace")}>
                          Necklace
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("watchcharm")}>
                          Watch Charm
                        </Link>
                        <Link className="dropdown-item" to={getCategoryPath("souvenir")}>
                          Souvenir
                        </Link>
                      </div>
                    </div>
                    <Link to="/all-jewellery" className="view-all-button">View All Jewellery</Link>
                  </div>

                 <div className="dropdown-column">
  <h4>By Material</h4>

  <Link
    className="dropdown-item"
    to={buildFilterLink({ material: "gold" })}
  >
    Gold
  </Link>

  <Link
    className="dropdown-item"
    to={buildFilterLink({ material: "diamond" })}
  >
    Diamond
  </Link>

  <Link
    className="dropdown-item"
    to={buildFilterLink({ material: "gemstone" })}
  >
    Gemstone
  </Link>
</div>

                  <div className="dropdown-column">
                    <h4>By Price</h4>
                    <Link className="dropdown-item" to={buildFilterLink({ maxPrice: 10000 })}>
                      Under 10k
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ minPrice: 10000, maxPrice: 20000 })}>
                      10k–20k
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ minPrice: 20000, maxPrice: 30000 })}>
                      20k–30k
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ minPrice: 30000, maxPrice: 40000 })}>
                      30k–40k
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ minPrice: 40000, maxPrice: 50000 })}>
                      40k–50k
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ minPrice: 50000, maxPrice: 60000 })}>
                      50k–60k
                    </Link>
                  </div>

                  <div className="dropdown-column">
                    <h4>By Gender</h4>
                    <Link className="dropdown-item" to={buildFilterLink({ gender: "male" })}>
                      Male
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ gender: "female" })}>
                      Female
                    </Link>
                    <Link className="dropdown-item" to={buildFilterLink({ gender: "kids" })}>
                      Kids
                    </Link>
                  </div>

                  <div className="dropdown-image">
                    <img src={jewelleryImage} alt="jewellery" />
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
