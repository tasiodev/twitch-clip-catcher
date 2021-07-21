const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  context: path.join(__dirname, './'),
  entry: './app/app.jsx',
  mode:"production",
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'app')
        ],
        exclude: [
          path.resolve(__dirname, "node_modules")
        ],
        use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-react']
              ]
            }
          }],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: 'url-loader?limit=100000'
      }
    ],
  },
  plugins:[
     new webpack.EnvironmentPlugin(['TWITCH_APP_CLIENTID'])
  ]
};