const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: '/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react']
        }
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  devServer: {
    port: 8080,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' }
      }
    ],
    static: {
      directory: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
}