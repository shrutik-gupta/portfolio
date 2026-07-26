import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Magnetic from '../components/Magnetic';
import KineticText from '../components/KineticText';

const NotFound = () => (
  <>
    <Navbar />
    <div className="flex min-h-[100svh] flex-col justify-between px-gutter pb-10 pt-32">
      <p className="eyebrow">
        <span className="text-accent-primary">404</span> Not found
      </p>

      <div className="flex flex-col gap-8">
        <KineticText
          as="h1"
          className="max-w-[14ch] text-fluid-8 leading-[0.85] text-text-primary"
          stagger={0.09}
        >
          This page doesn’t exist yet.
        </KineticText>
        <p className="measure text-fluid-0 text-text-secondary">
          The link is broken, the page moved, or it was never built. All three
          are fixable.
        </p>
      </div>

      <Magnetic strength={0.4} className="w-fit">
        <Link
          to="/"
          data-cursor="link"
          className="group flex items-center gap-3 border-b border-accent-primary pb-2 text-fluid--1 uppercase tracking-[0.2em] text-accent-primary"
        >
          <span data-magnetic-inner>Back to the start</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      </Magnetic>
    </div>
  </>
);

export default NotFound;
