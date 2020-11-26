const path = require('path')
const merge = require('webpack-merge')
const webpackDev = require('./webpack.dev')

module.exports = merge(webpackDev, {
    mode: 'production',
    devtool: false,
    output: {
        path: path.resolve('docs'),
    },
})
