const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const DEV_MODE = process.env.npm_lifecycle_event == 'start'

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
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/template.ejs'),
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
}
