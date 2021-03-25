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

const MagicString = require('magic-string');
const { readFileSync, writeFileSync } = require('fs');

function load(filename) {
  const contents = readFileSync(`${__dirname}/files/${filename}`, 'utf8');
  return new MagicString(contents, { filename });
}
function save(filename, contents) {
  writeFileSync(`${__dirname}/files/${filename}`, contents);
}

const main = load('main.js');

function replaceAll(ms, substring, replacement) {
  let index = -1;
  while ((index = ms.original.indexOf(substring, index + 1)) > -1) {
    ms.overwrite(index, index + substring.length, replacement);
  }
}

replaceAll(main, 'foo', 'bar');
replaceAll(main, '\n/* REMOVE START */', '')
replaceAll(main, '/* REMOVE END */\n', '')
replaceAll(main, '\n/* INSERT START */', '\n"a";\n"b"\n"c"\n"d"\n"e"');
replaceAll(main, '/* INSERT END */\n', '"f";\n"g"\n"i"\n"j"\n');

save('bundle.js', main.toString());
save('bundle.js.map', main.generateMap({
  source: 'main.js',
  hires: false,
  includeContent: true,
}).toString());
