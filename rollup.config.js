const commonjsPlugin = require('rollup-plugin-commonjs')
const typescriptPlugin = require('rollup-plugin-typescript')
const resolvePlugin = require('rollup-plugin-node-resolve')
import copy from 'rollup-plugin-copy'

const plugins = [
    typescriptPlugin(),
    commonjsPlugin(),
    resolvePlugin(),
    copy({
        targets: [{ src: 'src/dragscroll.scss', dest: 'build' }],
    }),
]

export default [
    {
        input: 'src/index.es.ts',
        output: {
            format: 'es',
            exports: 'named',
            file: './build/dragscroll.es.js',
        },
        plugins,
    },
    {
        input: 'src/index.es.ts',
        output: {
            format: 'cjs',
            exports: 'default',
            file: './build/dragscroll.cjs.js',
        },
        plugins,
    },
]
