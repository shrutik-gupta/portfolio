import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-bg-primary text-text-primary px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! I don't have that page at this moment.</p>
      <Link
        to="/"
        className="text-accent-primary hover:underline text-lg"
      >
        Go back to Home
      </Link>
    </div>
    </>
    
  );
};

export default NotFound;
