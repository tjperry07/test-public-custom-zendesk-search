const moduleAlias = require('module-alias');
moduleAlias.addAlias('react', 'preact/compat');
moduleAlias.addAlias('react-dom', 'preact/compat');
moduleAlias.addAlias('react/jsx-runtime', 'preact/jsx-runtime');
const config = require('@algolia/satellite/cjs/styles/tailwind.config.js');

config.variants.backgroundColor = ['responsive', 'hover', 'focus', 'active'];

module.exports = {
  ...config,
  theme: {
    ...config.theme,
    screens: {
      ...config.theme.screens,
      aa: '680px', // detached autocomplete full height breakpoint
    },
  },
  purge: {
    ...config.purge,
    content: [
      './node_modules/@algolia/satellite/esm/Link/**/*.js',
      './node_modules/@algolia/satellite/esm/Tabs/**/*.js',
      './src/**/*.ts',
      './src/**/*.tsx',
    ],
    enabled:
      process.env.NODE_ENV === 'demo' || process.env.NODE_ENV === 'production',
  },
  important: true,
};
