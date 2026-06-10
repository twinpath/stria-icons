export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false
        }
      }
    },
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeEditorsNSData',
    'cleanupIds',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['class', 'data-.*', 'xml:space']
      }
    }
  ]
};
