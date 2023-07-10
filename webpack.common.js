const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const banner = require('./banner.config')

module.exports = {
  entry: {
    dragscroll: path.resolve(__dirname, 'src/index.ts'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    library: 'DragScroll',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
  },
  plugins: [new CleanWebpackPlugin(), new webpack.BannerPlugin(banner)],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
