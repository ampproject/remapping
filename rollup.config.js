/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript';

const pkg = require('./package.json');

const libraryName = 'remapping';

const esm = !!process.env.ESM;

function common(esm) {
  return {
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    input: `src/${libraryName}.ts`,
    output: esm
      ? { file: pkg.module, format: 'es', sourcemap: true }
      : { file: pkg.main, name: libraryName, format: 'umd', sourcemap: true },
    plugins: [
      // Compile TypeScript files
      typescript(esm ? {} : { target: 'ES5' }),

      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      commonjs(),

      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      resolve(),

      // Resolve source maps to the original source
      sourceMaps(),
    ],
    watch: {
      include: 'src/**',
    },
  };
}

export default [common(false), common(true)];
