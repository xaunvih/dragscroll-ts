const path = require('path')
const merge = require('webpack-merge')
const webpackCommon = require('./webpack.common')
const webpackTemplates = require('./webpack.templates')

module.exports = merge(webpackTemplates, webpackCommon, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        inline: true,
        hot: true,
        contentBase: [path.resolve('build'), path.resolve('public')],
        open: true,
        compress: true,
        writeToDisk: true,
        watchOptions: {
            poll: true,
        },
    },
})
