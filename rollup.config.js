const babel = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const postcss = require('rollup-plugin-postcss')
const replace = require('@rollup/plugin-replace')
const resolve = require('@rollup/plugin-node-resolve')

const isProductionBuild = process.env.NODE_ENV === 'production'

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.min.js',
    format: 'iife',
    sourcemap: !isProductionBuild
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel({
      babelHelpers: 'runtime',
      plugins: [
        ["@babel/transform-runtime", { "regenerator": true }]
      ]
    }),
    resolve(),
    commonjs(),
    postcss({
      extensions: ['.css']
    })
  ]
}
