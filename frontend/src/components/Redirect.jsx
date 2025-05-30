import React from 'react';
import { Link } from 'react-router-dom';

const Redirect = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-bg-secondary text-text-primary gap-1 p-4 text-sm italic">
      <p>Since you made it this far...</p>
      <Link to="/parallel" className="underline hover:text-accent-primary transition-colors duration-200">
        There’s a not-so-obvious page about me.
      </Link>
    </div>
  );
};

export default Redirect;
