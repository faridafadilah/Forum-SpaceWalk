import React from 'react'
import LandingPage from '../UI Public/Landing/LandingPage'
import Footer from '../UI Public/Footer/Footer'
import CatBest from '../UI Public/CategoryBest/CatBest'
import Team from "../UI Public/Team/Team"
import Video from "../UI Public/Video/Video"

const Home = ({theme}) => {
  return (
    <>
      <LandingPage theme={theme}/>
      <CatBest />
      <Video theme={theme}/>
      <Team />
      <Footer theme={theme}/>
    </>
  );
};

export default Home;