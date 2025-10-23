module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#FF3E6E',
        backgroundStart: '#1A1A2E',
        backgroundEnd: '#16213E',
        textLight: '#E6E6E6'
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};
