const path = require('path');
const webpack = require('webpack'); 

module.exports = {
  webpack: {
    alias: {
      '@customTypes': path.resolve(__dirname, 'src/types'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@customUtils': path.resolve(__dirname, 'src/utils'),

    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ],
  },
};