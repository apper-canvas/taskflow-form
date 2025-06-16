/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#dc4c3e',
        secondary: '#f9f9f9',
        accent: '#ff7066',
        surface: {
          50: '#fafafa',
          100: '#f9f9f9',
          200: '#f5f5f5',
          300: '#f0f0f0',
          400: '#e5e5e5',
          500: '#d4d4d4',
          600: '#a3a3a3',
          700: '#737373',
          800: '#525252',
          900: '#404040'
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        priority: {
          1: '#dc4c3e',
          2: '#f59e0b',
          3: '#3b82f6',
          4: '#737373'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px'
      },
      borderRadius: {
        'DEFAULT': '6px'
      },
      spacing: {
        '18': '4.5rem'
      }
    },
  },
  plugins: [],
}