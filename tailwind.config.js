export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FAF9F6',
          dark: '#0B0F19',
        },
        ink: {
          DEFAULT: '#1E1B4B',
          dark: '#F8FAFC',
        },
        card: {
          light: '#FFFFFF',
          dark: '#131B2E',
        },
        pos: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          darkBg: 'rgba(16, 185, 129, 0.15)',
          darkBorder: 'rgba(16, 185, 129, 0.3)',
          darkText: '#34D399',
        },
        neu: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          darkBg: 'rgba(245, 158, 11, 0.15)',
          darkBorder: 'rgba(245, 158, 11, 0.3)',
          darkText: '#FBBF24',
        },
        neg: {
          DEFAULT: '#F43F5E',
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          darkBg: 'rgba(244, 63, 94, 0.15)',
          darkBorder: 'rgba(244, 63, 94, 0.3)',
          darkText: '#FB7185',
        },
      },
      fontFamily: {
        head: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
