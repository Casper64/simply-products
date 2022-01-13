import json from '@rollup/plugin-json'; // import json
import resolve from '@rollup/plugin-node-resolve'; // resolve npm modules
import babel from 'rollup-plugin-babel'; // transpile to es5
import multiInput from 'rollup-plugin-multi-input'; // Multi input / output
import commonjs from 'rollup-plugin-commonjs'; // Fix fro runtime helpers
import path from 'path'

export default {
    input: ["src/projects/index.js", "src/default/index.js"],
    output: {
        dir: "js",
        format: "esm",
        chunkFileNames: "module.js",
        sourcemap: 'inline',
        library: 'Globals'
    },
    plugins: [
        resolve(),
        commonjs({
            include: "node_modules/**"
        }),
        babel({
            exclude: "node_modules/**",
            runtimeHelpers: true
        }),
        json(),
        multiInput({
            relative: 'src/',
            transformOutputPath: (output, input) => `${path.parse(output).dir}.js`
        })
    ],
    treeshake: false,
}