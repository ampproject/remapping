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

import typescript from '@rollup/plugin-typescript';

function configure(esm) {
  return {
    input: 'src/remapping.ts',
    output: esm
      ? { format: 'es', dir: 'dist', entryFileNames: '[name].mjs', sourcemap: true }
      : {
          format: 'umd',
          name: 'remapping',
          dir: 'dist',
          entryFileNames: '[name].umd.js',
          sourcemap: true,
          globals: {
            '@jridgewell/resolve-uri': 'resolveURI',
            'sourcemap-codec': 'sourcemapCodec',
          },
        },
    plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
    watch: {
      include: 'src/**',
    },
  };
}

export default [configure(false), configure(true)];
