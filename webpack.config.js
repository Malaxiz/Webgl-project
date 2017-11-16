var CopyWebpackPlugin = require('copy-webpack-plugin');

exports.default = {
  entry: './src',
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }]
    },{
      test: /\.s?css$/,
      use: [{
        loader: 'style-loader'
      },{
        loader: 'css-loader'
      }]
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      context: './src',
      from: '*.html',
      to: `${__dirname}/build`
    }])
  ]
}