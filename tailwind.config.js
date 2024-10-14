const { bottom } = require('@popperjs/core')
const plugin = require('tailwindcss/plugin')

module.exports = {
    darkMode: ['class', '[data-mode="dark"]'],
    // content: ["./dist/**/*.{html,scss,js}"],
    content: ["./src/**/*.{html,scss,js}"],
    safelist: [
        {
            pattern: /(bg|text)-+/,
        }
    ],
    important: true,
    theme: {
        screens: {
            xs: "100%",
            sm: '540px',
            md: '720px	',
            lg: '960px',
            xl: '1140px',
            '2xl': '1320px',
        },
        container: {
            padding: '0.625rem',
        },
        fontFamily: {
            primary: ['Public Sans', 'sans-serif'],
        }, 
        extend: {
            fontSize: {
                '10': '0.625rem',
                '11': '0.688rem',
                '13': '0.813rem',
                '14': '0.875rem',
                base: '0.938rem',
                '16': '1rem',
                '17': '1.063rem',
                '19': '1.188rem',
                '21': '1.313rem',
                '22': '1.375rem',
            },
            colors: {
                violet: {
                    50: '#DFDDFB',
                    100: '#D9D6FB',
                    200: '#BFBBF8',
                    300: '#9892F3',
                    400: '#7F77F0',
                    500: '#7269ef',
                    600: '#685FD9',
                    700: '#5D56C4',
                    800: '#534CAE',
                    900: '#494398',
                },
                gray: {
                    50:  '#EFF2F7',
                    100: '#E6E7EA',
                    200: '#C0C2CB',
                    300: '#A7A9B6',
                    400: '#8D91A2',
                    500: '#74788D',
                    600: '#5F6273',
                    700: '#3F414D',
                    800: '#2A2C33',
                    900: '#202126',
                },
                green: {
                    50: '#CAEDDF',
                    100: '#d5ede3',
                    200: '#8BD7B8',
                    300: '#64C9A0',
                    400: '#3DBC89',
                    500: '#2ab57d',
                    600: '#229466',
                    700: '#1F845B',
                    800: '#176344',
                    900: '#0F422D',
                },
                sky: {
                    50: '#D2E9FB',
                    100: '#BEDFF9',
                    200: '#9DCEF6',
                    300: '#7CBEF3',
                    400: '#5BAEF0',
                    500: '#4BA6EF',
                    600: '#4497D9',
                    700: '#3D88C4',
                    800: '#306A98',
                    900: '#295B82',
                },
                yellow: {
                    50: '#FFF0D4',
                    100: '#FFE2B1',
                    200: '#FFD692',
                    300: '#FFD082',
                    400: '#FFC563',
                    500: '#ffbf53',
                    600: '#E8AE4B',
                    700: '#D19C44',
                    800: '#B98B3C',
                    900: '#A27A35',
                },
                red: {
                    50: '#FEDCDB',
                    100: '#FEC6C4',
                    200: '#FEB8B6',
                    300: '#FE8D8A',
                    400: '#FD706D',
                    500: '#FD625E',
                    600: '#E65955',
                    700: '#CF504D',
                    800: '#B84744',
                    900: '#A13E3C',
                },
                zinc: {
                    50: '#C6C9CB',
                    100: '#A5AAAE',
                    200: '#91979C',
                    300: '#6D747B',
                    400: '#48515A',
                    500: '#424B55',
                    600: '#36404a',
                    700: '#303841',
                    800: '#262e35',
                    900: '#22282e',
                },
                slate: {
                    50:  '#f5f7fb',
                    100: '#e6ebf5',
                    200: '#DFE4EE',
                    300: '#D8DDE6',
                    400: '#D1D6DF',
                    500: '#BEC3CB',
                    600: '#ABAFB6',
                    700: '#989CA2',
                    800: '#85888E',
                    900: '#72757A',
                },
            },
        },      
    },

    plugins: [
        require('@tailwindcss/forms'),
        plugin(function ({ addBase, theme }) {
            addBase({
                'h1': { fontSize: theme('fontSize.4xl'), fontWeight: theme('fontWeight.semibold'), fontFamily: theme('fontFamily.primary') },
                'h2': { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.semibold'), fontFamily: theme('fontFamily.primary') },
                'h3': { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.semibold'), fontFamily: theme('fontFamily.primary') },
                'h4': { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.semibold'), fontFamily: theme('fontFamily.primary') },
                'h5': { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.semibold'), fontFamily: theme('fontFamily.primary') },
                'h6': { fontSize: theme('fontSize.base'), fontWeight: theme('fontWeight.semibold'), fontFamily: theme('fontFamily.primary') },
            })
        }),
        plugin(function ({ addComponents, theme }) {
            addComponents({
                '.btn': {
                    padding: '0.4375rem 0.75rem',
                    borderRadius: '0.30rem',
                    fontWeight: theme('fontWeight.normal'),
                    fontSize: '0.875rem',
                    display: 'inline-block',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    textAlign: 'center',
                    transition: 'all 0.5s ease',
                },
                '.card': {
                    borderRadius: '0.30rem',
                    border: '1px',
                    borderStyle: 'solid',
                    borderColor: '#e5e7eb',
                    marginBottom: theme('margin.5')
                }
            })
        })
    ],
}