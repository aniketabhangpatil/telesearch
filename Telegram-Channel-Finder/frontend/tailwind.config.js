/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#070d1e',
          850: '#0a142c',
          800: '#0d1d3d',
          700: '#142b58',
          600: '#1c3d7c',
        },
        accent: {
          blue: '#0088cc',
          cyan: '#00d2ff',
          neon: '#38bdf8',
          purple: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b'
        }
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(0, 136, 204, 0.25)',
        'glow-md': '0 0 30px rgba(0, 136, 204, 0.35)',
        'glow-lg': '0 0 50px rgba(0, 210, 255, 0.4)',
        'glow-cyan': '0 0 30px rgba(0, 210, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

