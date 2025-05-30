import React from 'react';
import { Link } from 'react-router-dom';

const Redirect = () => {
  return (
    <div className="flex items-center justify-center bg-bg-secondary text-text-primary gap-1 p-2 text-sm italic">
      <span>Since you made it this far...</span>
      <Link to="/parallel" className="underline hover:text-accent-primary transition-colors duration-200">
        There’s a not-so-obvious page about me.
      </Link>
    </div>
  );
};

export default Redirect;
