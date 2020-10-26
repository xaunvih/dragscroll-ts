const TerserPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const webpackCommon = require('./webpack.common')

module.exports = merge(webpackCommon, {
    mode: 'production',
    devtool: false,
    output: {
        filename: '[name].min.js',
    },
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
        ],
    },
})
