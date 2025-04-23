// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#34d399',
          900: '#064e3b',
        },
        gray: {
          800: '#1f2937',
          900: '#111827',
          950: '#0b1120',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(52, 211, 153, 0.2)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}