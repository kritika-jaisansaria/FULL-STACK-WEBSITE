import React from 'react';
import Header from'../../Components/Home/index';
import NavBar from '../../Components/Home/navbar';
import HeroSection from '../../Components/Home/herosection';
import JewellerySlider from '../../Components/Home/JewellerySlider';
import TrendingNow from '../../Components/Home/TrendingNow';
import TanishqWorld from '../../Components/Home/TanishqWorld';
import NewArrivals from '../../Components/Home/NewArrivals';
import CuratedByGender from '../../Components/Home/CuratedByGender';
import KisnaPicks from '../../Components/Home/KisnaPicks';
import SplitBanner from '../../Components/Home/SplitBanner';
import WhyTanishq from '../../Components/Home/assurance';
import ConnectSection from '../../Components/Home/ConnectSection';
import Footer from '../../Components/Home/Footer';
const Home=()=>{
    return (
    <>
    <Header/>
    <NavBar/>
    <HeroSection/>
    <JewellerySlider />
    <TrendingNow/>
    <TanishqWorld/>
    <NewArrivals/>
    <CuratedByGender/>
    <KisnaPicks/>
    <SplitBanner/>
    <WhyTanishq/>
    <ConnectSection/>  
    <Footer/>
    </>
  );
};
export default Home;