import React from 'react';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import ContactMe from './ContactMe';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Hero/>
      <About/>
      <Projects/>
      <Experience/>
      <ContactMe/>
    </div>
  );
};

export default Home;