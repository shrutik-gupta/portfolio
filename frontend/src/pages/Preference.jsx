import React, { useState } from 'react';
import { Check, Moon, Sun, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';
import Magnetic from '../components/Magnetic';

const THEMES = [
  {
    id: 'dark',
    name: 'Obsidian',
    icon: Moon,
    note: 'The intended look. Deep greys, warm brass, full WebGL.',
  },
  {
    id: 'light',
    name: 'Paper',
    icon: Sun,
    note: 'Warm bone and ink, for bright rooms and long reads.',
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
      <div className="min-h-[100svh] px-gutter pb-20 pt-32">
        <p className="eyebrow mb-10">Preferences</p>

        <h1 className="mb-14 max-w-[14ch] text-fluid-6 text-text-primary">
          Set the{' '}
          <span className="serif-italic text-accent-primary">surface</span>
        </h1>

        <div className="max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {THEMES.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  data-cursor="link"
                  onClick={() => {
                    updateTheme(option.id);
                    flash();
                  }}
                  className={`group relative flex flex-col gap-3 border p-6 text-left transition-colors duration-500 ease-out-expo ${
                    isSelected
                      ? 'border-accent-primary bg-bg-surface'
                      : 'border-border-default hover:border-border-hover'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected ? 'text-accent-primary' : 'text-text-muted'
                      }`}
                    />
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary">
                        <Check className="h-3 w-3 text-text-inverse" />
                      </span>
                    )}
                  </span>
                  <span className="text-fluid-2 text-text-primary">{option.name}</span>
                  <span className="text-fluid--1 text-text-secondary">{option.note}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border-default pt-8">
            <Magnetic strength={0.35}>
              <button
                type="button"
                data-cursor="link"
                onClick={() => {
                  resetToSystem();
                  flash();
                }}
                className="flex items-center gap-3 rounded-full border border-border-default px-6 py-3 text-fluid--2 uppercase tracking-[0.2em] text-text-secondary transition-colors duration-500 hover:border-accent-primary hover:text-accent-primary"
              >
                <span data-magnetic-inner className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4" />
                  Follow system
                </span>
              </button>
            </Magnetic>

            <p
              role="status"
              aria-live="polite"
              className="text-fluid--2 uppercase tracking-[0.2em] text-text-muted"
            >
              {saved ? (
                <span className="text-success">Saved</span>
              ) : (
                <>
                  Current<span className="mx-3 text-accent-primary">/</span>
                  {theme}
                </>
              )}
            </p>
          </div>

          <p className="mt-10 text-fluid--1 text-text-muted">
            Motion respects your system’s reduce-motion setting: with it on, the
            smooth scrolling, WebGL layers and scroll-driven sequences are
            replaced by plain, static equivalents.
          </p>
        </div>
      </div>
    </>
  );
};

export default Preference;
