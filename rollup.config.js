import commonjsPlugin from 'rollup-plugin-commonjs'
import typescriptPlugin from 'rollup-plugin-typescript'
import resolvePlugin from 'rollup-plugin-node-resolve'
const banner = require('./banner.config')

const customBanner = `/* ${banner} */`
const plugins = [typescriptPlugin(), commonjsPlugin(), resolvePlugin()]

export default [
    {
        input: 'src/index.ts',
        output: {
            banner: customBanner,
            format: 'es',
            exports: 'named',
            file: './build/dragscroll.es.js',
        },
        plugins,
    },
    {
        input: 'src/index.ts',
        output: {
            banner: customBanner,
            format: 'cjs',
            exports: 'default',
            file: './build/dragscroll.cjs.js',
        },
        plugins,
    },
]
