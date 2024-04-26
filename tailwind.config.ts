import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ['./public/index.html', './src/**/*.tsx'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
    },
    screens: {
      xs: '425px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      duration: {
        default: 300,
      },
      backdropBlur: {
        xs: '1px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('accessible', ':merge(.accessible):hover &');
      addVariant('reduced-motion', ':merge(.reduced-motion):first-child &');
      // :merge() is important to merge all variant pseudos on that selector and not the child
      // this is inspirted by the core .group plugin https://github.com/tailwindlabs/tailwindcss/blob/master/src/corePlugins.js#L107
    }),
  ],
} satisfies Config;
