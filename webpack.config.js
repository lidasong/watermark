const path = require('path');
const webpack = require('webpack');

module.exports = {

  entry: {
    watermark: './src/index.js',
    "watermark.min":'./src/index.js'
  },

  output: {
    path: path.resolve(__dirname,'dist'),
    filename: "[name].js",
    library: "[name]",
    libraryTarget: "umd"
  },
  externals: {},

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          ["es2015", { "modules": false }]
        ],
      }
    }]
  },
  plugins: [new webpack.optimize.UglifyJsPlugin()],
  devtool: 'source-map'
};