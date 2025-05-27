/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
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
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-bg': 'var(--gradient-bg)',
      },
      boxShadow: {
        'custom-light': '0 4px 6px -1px rgb(var(--color-shadow-light)), 0 2px 4px -1px rgb(var(--color-shadow-light))',
        'custom-medium': '0 10px 15px -3px rgb(var(--color-shadow-medium)), 0 4px 6px -2px rgb(var(--color-shadow-medium))',
        'accent-primary': '0 0 0 3px rgb(var(--color-accent-primary) / 0.3)',
        'accent-secondary': '0 0 0 3px rgb(var(--color-accent-secondary) / 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

