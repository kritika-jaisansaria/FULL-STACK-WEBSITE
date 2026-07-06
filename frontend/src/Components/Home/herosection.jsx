import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import hero1 from '../../assets/images/hero1.jpg';
import hero2 from '../../assets/images/hero2.jpg';
import hero3 from '../../assets/images/hero3.jpg';
import hero4 from '../../assets/images/hero4.jpg';

const herosection = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500, // Slide animation speed
    autoplaySpeed: 4000, // Time each image stays (2.5s)
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: false,
  };

  const images = [
    { src: hero1, link: '/offer1' },
    { src: hero2, link: '/offer2' },
    { src: hero3, link: '/offer3' },
    { src: hero4, link: '/offer4' },
  ];

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {images.map((item, idx) => (
          <div key={idx}>
            <a href={item.link}>
              <img src={item.src} alt={`Slide ${idx + 1}`} className="slider-image" />
            </a>
          </div>
        ))}
      </Slider>

      <style>{`
        .hero-slider {
          width: 100%;
          position: relative;
        }

        .slider-image {
          width: 100%;
          height: 80vh;
          object-fit: cover;
          cursor: pointer;
        }

        .slick-dots li button:before {
          color: #b8860b;
          font-size: 12px;
        }

        .slick-dots li.slick-active button:before {
          color: #b8860b;
        }
      `}</style>
    </div>
  );
};

export default herosection;




