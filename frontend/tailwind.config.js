/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Grounds
        'bg-primary': token('bg-primary'),
        'bg-secondary': token('bg-secondary'),
        'bg-tertiary': token('bg-tertiary'),
        'bg-card': token('bg-card'),
        'bg-surface': token('bg-surface'),
        'bg-hover': token('bg-hover'),

        // Ink
        'text-primary': token('text-primary'),
        'text-secondary': token('text-secondary'),
        'text-muted': token('text-muted'),
        'text-inverse': token('text-inverse'),

        // Rules
        'border-default': token('border-default'),
        'border-hover': token('border-hover'),
        'border-focus': token('border-focus'),

        // The three inks
        'accent-primary': token('accent-primary'),
        'accent-secondary': token('accent-secondary'),
        'accent-primary-hover': token('accent-primary-hover'),
        'accent-secondary-hover': token('accent-secondary-hover'),
        highlight: token('highlight'),

        // Objects that stay paper-coloured in both themes
        paper: 'rgb(var(--paper) / <alpha-value>)',
        disc: 'rgb(var(--disc) / <alpha-value>)',

        success: token('success'),
        warning: token('warning'),
        error: token('error'),
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        serif: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        hand: ['"Caveat Variable"', '"Segoe Print"', 'cursive'],
      },
      // Fluid scale — mirrors the --step-* custom properties in index.css
      fontSize: {
        'fluid--2': 'var(--step--2)',
        'fluid--1': 'var(--step--1)',
        'fluid-0': 'var(--step-0)',
        'fluid-1': 'var(--step-1)',
        'fluid-2': 'var(--step-2)',
        'fluid-3': 'var(--step-3)',
        'fluid-4': 'var(--step-4)',
        'fluid-5': 'var(--step-5)',
        'fluid-6': 'var(--step-6)',
        'fluid-7': 'var(--step-7)',
        'fluid-8': 'var(--step-8)',
      },
      spacing: {
        gutter: 'var(--gutter)',
        rail: 'var(--rail)',
        dock: 'var(--dock)',
      },
      maxWidth: {
        measure: 'var(--measure)',
        shell: '92rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        print: '0 1px 1px rgb(var(--shadow) / 0.10), 0 10px 24px -8px rgb(var(--shadow) / 0.30), 0 30px 60px -30px rgb(var(--shadow) / 0.35)',
        'print-lift': '0 2px 2px rgb(var(--shadow) / 0.10), 0 24px 40px -12px rgb(var(--shadow) / 0.38), 0 50px 80px -40px rgb(var(--shadow) / 0.45)',
        hard: '4px 4px 0 rgb(var(--color-text-primary))',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.6) rotate(-8deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(var(--tw-rotate, 0deg))', opacity: '1' },
        },
        'stamp-in': {
          '0%': { transform: 'scale(2.2) rotate(-24deg)', opacity: '0' },
          '60%': { transform: 'scale(0.94) rotate(-12deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' },
        },
        nudge: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'stamp-in': 'stamp-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        nudge: 'nudge 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
