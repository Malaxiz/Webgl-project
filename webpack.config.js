var CopyWebpackPlugin = require('copy-webpack-plugin');

var client = {
  entry: './src',
  output: {
    path: `${__dirname}/build/assets/`,
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
    },{
      test: /\.(vert|frag)$/,
      use: [{
        loader: 'raw-loader'
      }]
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      context: './src',
      from: '*.html',
      to: `${__dirname}/build`
    },{
      context: './src/game/shaders',
      from: '*',
      to: `${__dirname}/build/shaders`
    },{
      context: './assets',
      from: '*',
      to: `${__dirname}/build/assets`,
    }])
  ]
};

var server = {
  entry: './src/server/index.js',
  target: 'node',
  output: {
    path: `${__dirname}/backend/`,
    filename: 'backend.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader'
      }]
    },{
      test: /\.node$/,
      use: [{
        loader: 'raw-loader'
      }]
    }]
  }
};

exports.default = [ server, client ];