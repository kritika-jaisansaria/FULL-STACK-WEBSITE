import React from 'react';
import bgBanner from '../../assets/images/new-arrivals-background.webp'; // your banner

const NewArrivals = () => {
    return (
        <div style={{ ...styles.wrapper, backgroundImage: `url(${bgBanner})` }}>
            <div style={styles.overlay}>
                {/* Left text block */}
                <div style={styles.left}>
                    <h2 style={styles.title}>New Arrivals</h2>
                    <div style={styles.badge}>500+ New Items</div>
                    <p style={styles.description}>
                        New Arrivals Dropping Daily, Monday through Friday. <br />
                        Explore the Latest Launches Now!
                    </p>
                </div>

              

            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        position: 'relative',
        margin: '50px 0px',
    },
    overlay: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column', // stack text above cards
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '40px',
        padding: '0px 20px 20px 0',
        height: '100%', // full height
        minHeight: '250px', // adjust based on background image
    },
    cardWrapper: {
        position: 'absolute',
        bottom: '-80px', // Pulls it below background
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        height:'300px',
        display: 'flex',
        justifyContent: 'center',
    },

    left: {
        flex: 1,
        minWidth: '280px',
    },
    title: {
        fontSize: '48px',
        fontWeight: '700',
        color: '#fff',
        marginBottom: '16px',
    },
    badge: {
        display: 'inline-block',
        backgroundColor: '#ffffffcc',
        color: '#3d2212',
        fontSize: '14px',
        padding: '6px 14px',
        borderRadius: '20px',
        marginBottom: '14px',
    },
    description: {
        fontSize: '18px',
        color: '#fff',
        lineHeight: '1.6',
    },

   
};

export default NewArrivals;
