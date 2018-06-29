const path = require('path')
const webpack = require('webpack')
const FlowWebpackPlugin = require('flow-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'webpack-worker-wrapper',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        // include: path.resolve(__dirname, 'src'),
      },
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new FlowWebpackPlugin(),
    new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
  ]
}
