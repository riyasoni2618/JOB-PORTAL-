// import React from 'react'
// import Navbar from './shared/Navbar'
// import HeroSection from './HeroSection'
// // import CategoryCarousel from './CategoryCarousel';
// // import LatestJobs from './LatestJobs';            
// // import Footer from './Footer';  

// const Home = () => {
//   return (
//     <>
//     <Navbar/>
//     <HeroSection/>
//     <CategoryCarousel/>
//     <LatestJobs/>
//     <Footer/>
//     </>
//   )
// }
// export default Home;
import React from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
};


export default Home;
