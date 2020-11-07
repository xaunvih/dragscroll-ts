import commonjsPlugin from 'rollup-plugin-commonjs'
import typescriptPlugin from 'rollup-plugin-typescript'
import resolvePlugin from 'rollup-plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

const plugins = [
    typescriptPlugin(),
    commonjsPlugin(),
    resolvePlugin(),
    scss({
        output: 'build/dragscroll.css',
        processor: () => postcss([autoprefixer()]),
    }),
]

export default [
    {
        input: 'src/index.ts',
        output: {
            format: 'es',
            exports: 'named',
            file: './build/dragscroll.es.js',
        },
        plugins,
    },
    {
        input: 'src/index.ts',
        output: {
            format: 'cjs',
            exports: 'default',
            file: './build/dragscroll.cjs.js',
        },
        plugins,
    },
]
