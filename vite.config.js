import dts from 'vite-plugin-dts';
export default {
  resolve: {
    alias: [
      { find: 'react', replacement: 'preact/compat' },
      { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
    ],
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'customSearch',
      fileName: 'index',
    },
    outDir: 'lib',
  },
  plugins: [dts({ insertTypesEntry: true })],
};
