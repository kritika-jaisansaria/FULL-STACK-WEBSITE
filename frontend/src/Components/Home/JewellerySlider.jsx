import React, { useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';

import ring from '../../assets/images/ring.jpg';
import earrings from '../../assets/images/earrings.png';
import pendant from '../../assets/images/pendant.jpg';
import bangles from '../../assets/images/bangles.png';
import chain from '../../assets/images/chain.png';
import nosepin from '../../assets/images/nosepin.jpg';
import bracelet from '../../assets/images/bracelet.png';
import mangalsutra from '../../assets/images/mangalsutra.png';
import set from '../../assets/images/set.jpg';

const items = [
    { label: 'RINGS', image: ring, link: '#' },
    { label: 'EARRINGS', image: earrings, link: '#' },
    { label: 'PENDANTS', image: pendant, link: '#' },
    { label: 'BANGLES', image: bangles, link: '#' },
    { label: 'CHAIN', image: chain, link: '#' },
    { label: 'NOSEPIN', image: nosepin, link: '#' },
    { label: 'BRACELET', image: bracelet, link: '#' },
    { label: 'MANGALSUTRA', image: mangalsutra, link: '#' },
    { label: 'SETS', image: set, link: '#' },
];

const JewellerySlider = () => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 300;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const styles = {
        wrapper: {
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            padding: '80px 0 20px',
            backgroundColor: '#FFFFFA',
        },
        slider: {
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: '0px',
            padding: '10px 40px',
            scrollbarWidth: 'none',
        },
        item: {
            minWidth: '320px',
            flexShrink: 0,
            textDecoration: 'none',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '350px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
        },
        overlay: {
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fff',
            fontSize: '24px',
            fontWeight: 600,
            textTransform: 'uppercase',
            padding: '8px 12px',
            borderRadius: '4px',
            textShadow: '0px 0px 3px rgba(0, 0, 0, 0.6)',
        },
        arrowIcon: {
            fontSize: '24px',
            opacity: 1,
            transition: 'transform 0.3s ease',
        },

        arrow: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#333',
            fontSize: '28px',
            cursor: 'pointer',
            zIndex: 1,
        },
        leftArrow: {
            left: '10px',
        },
        rightArrow: {
            right: '10px',
        },

    };

    return (
        <div style={styles.wrapper}>
            <button style={{ ...styles.arrow, ...styles.leftArrow }} onClick={() => scroll('left')}>&#10094;</button>

            <div
                ref={sliderRef}
                style={styles.slider}
                onWheel={(e) => e.preventDefault()}
            >
                {items.map((item, index) => (
                    <a
                        href={item.link}
                        key={index}
                        style={styles.item}
                        onMouseEnter={(e) => {
                            e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                            e.currentTarget.querySelector('svg').style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                            e.currentTarget.querySelector('svg').style.opacity = '0';
                        }}
                    >
                        <img src={item.image} alt={item.label} style={styles.image} />
                        <div style={styles.overlay}>
                            {item.label}
                            <FaArrowRight style={styles.arrowIcon} />
                        </div>
                    </a>
                ))}
            </div>

            <button style={{ ...styles.arrow, ...styles.rightArrow }} onClick={() => scroll('right')}>&#10095;</button>
        </div>
    );
};

export default JewellerySlider;

