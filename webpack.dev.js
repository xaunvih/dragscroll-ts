const path = require('path')
const merge = require('webpack-merge')
const webpackCommon = require('./webpack.common')

module.exports = merge(webpackCommon, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        inline: true,
        hot: true,
        contentBase: [path.resolve('./build')],
        watchContentBase: true,
        open: true,
        compress: true,
        writeToDisk: false,
        watchOptions: {
            poll: true,
        },
    },
})
