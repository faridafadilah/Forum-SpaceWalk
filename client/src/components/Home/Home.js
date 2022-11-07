import React from 'react'
import LandingPage from '../UI Public/Landing/LandingPage'
import Footer from '../UI Public/Footer/Footer'
import CatBest from '../UI Public/CategoryBest/CatBest'
import Team from "../UI Public/Team/Team"

const Home = ({theme}) => {
  return (
    <>
      <LandingPage theme={theme}/>
      <CatBest />
      <Team />
      <Footer theme={theme}/>
    </>
  );
};

export default Home;