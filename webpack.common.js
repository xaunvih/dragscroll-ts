const path = require('path')

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
