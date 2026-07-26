/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'bg-tertiary': 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        'bg-card': 'rgb(var(--color-bg-card) / <alpha-value>)',
        'bg-surface': 'rgb(var(--color-bg-surface) / <alpha-value>)',
        'bg-hover': 'rgb(var(--color-bg-hover) / <alpha-value>)',

        // Text Colors
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'text-inverse': 'rgb(var(--color-text-inverse) / <alpha-value>)',

        // Border Colors
        'border-default': 'rgb(var(--color-border-default) / <alpha-value>)',
        'border-hover': 'rgb(var(--color-border-hover) / <alpha-value>)',
        'border-focus': 'rgb(var(--color-border-focus) / <alpha-value>)',

        // Accent Colors
        'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
        'accent-secondary': 'rgb(var(--color-accent-secondary) / <alpha-value>)',
        'accent-primary-hover': 'rgb(var(--color-accent-primary-hover) / <alpha-value>)',
        'accent-secondary-hover': 'rgb(var(--color-accent-secondary-hover) / <alpha-value>)',

        // Status Colors
        'success': 'rgb(var(--color-success) / <alpha-value>)',
        'warning': 'rgb(var(--color-warning) / <alpha-value>)',
        'error': 'rgb(var(--color-error) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'ui-serif', 'Georgia', 'serif'],
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
      },
      maxWidth: {
        measure: 'var(--measure)',
        shell: '96rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgb(var(--color-shadow-light)), 0 2px 4px -1px rgb(var(--color-shadow-light))',
        'custom-medium': '0 10px 15px -3px rgb(var(--color-shadow-medium)), 0 4px 6px -2px rgb(var(--color-shadow-medium))',
        'lift': '0 24px 60px -20px rgb(var(--color-shadow-medium))',
        'accent-primary': '0 0 0 3px rgb(var(--color-accent-primary) / 0.3)',
        'accent-secondary': '0 0 0 3px rgb(var(--color-accent-secondary) / 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(var(--color-accent-primary)) 0%, rgb(var(--color-accent-secondary)) 100%)',
        'gradient-bg': 'linear-gradient(180deg, rgb(var(--color-bg-primary)) 0%, rgb(var(--color-bg-secondary)) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
