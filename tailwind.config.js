/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily:{
        primaryBold : ['Bold'],
        primarySemiBold : ['SemiBold'],
        primaryItalic : ['Italic'],
        primaryLight : ['Light'],
        primaryMedium : ['Medium'],
        primaryRegular : ['Regular']
      },
      textColor: {
        primary: '#3F4047',
        accent: '#FF3B30',
        enable: '#868E96',
        neutral: '#B0B0B0',
        secondary:'#213773',
        tertiary: '#6FC5CE'
      },
      colors: {
        primary: {
          DEFAULT: '#213773',
          light: '#2A70B9',
          200: "#1d3167",
          400: "#172650",
          600: "#101b39",
          800: "#091022",
        },
        secondary: {
          DEFAULT: '#76C7C0',
          light: '#56AEA6',
        },
        actions: {
          cancel: '#FF6C6C',
          error: '#FF0000',
          success: '#4CAF50',
          warning: '#FFC107',
          info: '#2196F3',
          enableDark:'#868E96',
          enableLight:'#E9EAEB'
        },
      }
    },
  },
  plugins: [],
}

