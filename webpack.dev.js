const path = require('path')
const merge = require('webpack-merge')
const webpackCommon = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const files = ['index', 'vertical', 'all']
const autoprefixer = require('autoprefixer')
const DEV_MODE = process.env.npm_lifecycle_event == 'start'

module.exports = merge(webpackCommon, {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        styles: path.resolve(__dirname, 'public/scss/styles.scss'),
        dragscroll: path.resolve(__dirname, 'src/index.ts'),
    },
    plugins: [
        ...files.map((file) => {
            return new HtmlWebpackPlugin({
                filename: `${file}.html`,
                template: path.resolve(__dirname, `public/${file}.ejs`),
            })
        }),
        new MiniCssExtractPlugin({
            filename: `[name].css`,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(scss)/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
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
        writeToDisk: true,
        watchOptions: {
            poll: true,
        },
    },
})
