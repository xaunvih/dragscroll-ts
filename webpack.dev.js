const path = require('path')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackCommon = require('./webpack.common')
const CopyPlugin = require('copy-webpack-plugin')
const files = ['horizontal-transform', 'vertical-transform', 'all-transform', 'horizontal-native', 'vertical-native', 'all-native']

module.exports = merge(webpackCommon, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: ['public/style.css'],
        }),
        ...files.map((file) => {
            return new HtmlWebpackPlugin({
                filename: `${file}.html`,
                template: path.resolve(__dirname, `public/${file}.ejs`),
            })
        }),
    ],
    devServer: {
        inline: true,
        hot: true,
        contentBase: [path.resolve('build')],
        open: true,
        compress: true,
        writeToDisk: true,
        watchOptions: {
            poll: true,
        },
    },
})
