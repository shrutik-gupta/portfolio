import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { easeThemeChange } from '../lib/themeSwitch';
import Navbar from '../components/Navbar';
import Magnetic from '../components/Magnetic';

const THEMES = [
  {
    id: 'light',
    name: 'Daylight',
    note: 'Warm paper and black ink. Good for bright rooms and long reads.',
    // Shown as a miniature of the theme, whatever the current one is.
    ground: '#efe7d6',
    ink: '#1c1613',
    disc: '#f3c43c',
    inks: ['#b22814', '#2440c4', '#f3cf4d'],
  },
  {
    id: 'dark',
    name: 'After dark',
    note: 'A wine-dark desk with the lamp on. Easier on the eyes at night.',
    ground: '#180c0f',
    ink: '#f3e9d6',
    disc: '#f3e9d6',
    inks: ['#ff745c', '#9ebef0', '#f0cd60'],
  },
];

const Preference = () => {
  const { theme, updateTheme, resetToSystem } = useTheme();
  const [saved, setSaved] = useState(false);

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="shell min-h-[100svh] pb-20 pt-24 lg:pt-16">
          <p className="label mb-6 text-accent-primary">Preferences</p>

          <h1 className="mb-12 max-w-[12ch] text-fluid-7 text-text-primary">
            Pick your <span className="display-i text-accent-primary">light</span>
          </h1>

          <div className="max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {THEMES.map((option, i) => {
                const isSelected = theme === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      easeThemeChange();
                      updateTheme(option.id);
                      flash();
                    }}
                    className={`group relative flex flex-col text-left transition-transform duration-500 ease-spring hover:-translate-y-1 hover:rotate-0 ${
                      i === 0 ? '-rotate-1' : 'rotate-1'
                    }`}
                  >
                    {/* A swatch card of the theme */}
                    <span
                      className={`relative block aspect-[4/3] w-full overflow-hidden border-2 shadow-print ${
                        isSelected ? 'border-accent-primary' : 'border-text-primary'
                      }`}
                      style={{ background: option.ground }}
                    >
                      <span
                        className="absolute left-1/2 top-[58%] aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-700 ease-out-expo group-hover:-translate-y-[62%]"
                        style={{ background: option.disc }}
                      />
                      <span
                        className="absolute inset-x-0 bottom-0 h-[30%] border-t-2"
                        style={{ background: option.ground, borderColor: option.ink }}
                      />
                      <span className="absolute bottom-3 left-3 flex gap-1.5">
                        {option.inks.map((c) => (
                          <span key={c} className="block h-4 w-4 rounded-full" style={{ background: c }} />
                        ))}
                      </span>
                      <span
                        className="display absolute left-3 top-2 text-fluid-3"
                        style={{ color: option.ink }}
                      >
                        Aa
                      </span>
                      {isSelected && (
                        <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-accent-primary text-text-inverse">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </span>

                    <span className="mt-4 font-display text-fluid-3 font-semibold leading-tight text-text-primary">
                      {option.name}
                    </span>
                    <span className="mt-1 text-fluid--1 text-text-secondary">{option.note}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 border-t-2 border-text-primary pt-8">
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  onClick={() => {
                    easeThemeChange();
                    resetToSystem();
                    flash();
                  }}
                  className="stamp"
                >
                  <span data-magnetic-inner className="flex items-center gap-3">
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Follow my device
                  </span>
                </button>
              </Magnetic>

              <p role="status" aria-live="polite" className="label text-text-muted">
                {saved ? (
                  <span className="text-success">Saved</span>
                ) : (
                  <>
                    Current<span className="mx-3 text-accent-primary">/</span>
                    {theme === 'dark' ? 'After dark' : 'Daylight'}
                  </>
                )}
              </p>
            </div>

            <p className="measure mt-10 text-fluid--1 text-text-muted">
              Motion follows your device’s reduce-motion setting. With it on,
              smooth scrolling, the 3D blocks and scroll-driven animation are
              swapped for plain, still versions.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Preference;
