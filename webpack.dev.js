const path = require('path')
const merge = require('webpack-merge')
const webpackCommon = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const files = ['index', 'vertical', 'all']
const autoprefixer = require('autoprefixer')
const DEV_MODE = process.env.npm_lifecycle_event == 'start'

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
    module: {
        rules: [
            {
                test: /\.(scss)/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: DEV_MODE,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                            sourceMap: DEV_MODE,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: DEV_MODE,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        inline: true,
        hot: true,
        contentBase: [path.resolve('build'), path.resolve('public')],
        open: true,
        compress: true,
        writeToDisk: false,
        watchOptions: {
            poll: true,
        },
    },
})
