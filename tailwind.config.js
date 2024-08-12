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
        secondary: '#868E96',
        accent: '#FF3B30',
        neutral: '#B0B0B0'
      },
      colors: {
        primary: {
          DEFAULT: '#213773',
          light: '#2A70B9',
          enableDark:'#868E96',
          enableLight:'#E9EAEB',
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
          info: '#2196F3'
        },
      }
    },
  },
  plugins: [],
}

