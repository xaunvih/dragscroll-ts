import commonjsPlugin from 'rollup-plugin-commonjs'
import typescriptPlugin from 'rollup-plugin-typescript'
import resolvePlugin from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
const banner = require('./banner.config')
const customBanner = `/* ${banner} */`

export default {
    input: 'src/index.ts',
    output: [
        {
            banner: customBanner,
            format: 'es',
            exports: 'named',
            file: './build/dragscroll.es.js',
        },
        {
            banner: customBanner,
            format: 'cjs',
            exports: 'default',
            file: './build/dragscroll.cjs.js',
        },
    ],
    plugins: [typescriptPlugin(), commonjsPlugin(), resolvePlugin(), terser()],
}
