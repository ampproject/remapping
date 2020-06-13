/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import resolve from '@rollup/plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from '@rollup/plugin-typescript';

const pkg = require('./package.json');

const libraryName = 'remapping';

const esm = !!process.env.ESM;

function common(esm) {
  return {
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    input: `src/remapping.ts`,
    output: esm
      ? { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true }
      : { format: 'umd', name: 'dedent', dir: 'dist', entryFileNames: '[name].umd.js', sourcemap: true },

    plugins: [
      // Compile TypeScript files
      typescript(esm ? {} : { target: 'ES5' }),

      // Allow node_modules resolution
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
