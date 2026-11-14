import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import KineticText from '../components/KineticText';
import { ArrowRight } from '../components/Doodles';

const HeroCanvas = lazy(() => import('../three/HeroCanvas'));

/** The same blocks as the cover — knocked over. */
const NotFound = () => (
  <>
    <Navbar />
    <main className="page">
      <div className="shell grid min-h-[100svh] items-center gap-10 pb-12 pt-24 lg:grid-cols-12 lg:pt-12">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <p className="label text-accent-primary">404 · Not found</p>

          <KineticText as="h1" className="max-w-[11ch] text-fluid-8 text-text-primary" stagger={0.09}>
            This page fell over.
          </KineticText>

          <p className="measure text-fluid-0 text-text-secondary">
            The link is broken, the page moved, or it was never built. All
            three are fixable.
          </p>

          <Link to="/" className="stamp stamp--solid w-fit">
            Back to the start
            <ArrowRight className="h-4 w-6" />
          </Link>
        </div>

        <div className="relative aspect-[5/4] w-full lg:col-span-5">
          <Suspense fallback={null}>
            <HeroCanvas fallen />
          </Suspense>
          <p className="hand pointer-events-none absolute bottom-0 right-4 text-text-muted">
            (you can still poke them)
          </p>
        </div>
      </div>
    </main>
  </>
);

export default NotFound;
