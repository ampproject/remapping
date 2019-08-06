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
const parser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const { readFileSync, writeFileSync } = require('fs');

function load(filename) {
  const contents = readFileSync(`${__dirname}/files/${filename}`, 'utf8');
  const s = new MagicString(contents, { filename });
  const ast = parser.parse(contents);
  traverse.cheap(ast, (node) => {
    s.addSourcemapLocation(node.start);
    s.addSourcemapLocation(node.end);
  });
  return s;
}
function save(filename, contents) {
  writeFileSync(`${__dirname}/files/${filename}`, contents);
}

const main = load('main.js');
const placeholder = load('placeholder.js');

const search = '/* PLACEHOLDER */';
const index = main.original.indexOf(search);

const before = main.snip(0, index);
const after = main.snip(index + search.length, main.length());

const bundle = new MagicString.Bundle();
bundle.addSource(before);
bundle.addSource(placeholder);
bundle.addSource(after);

save('bundle.js', bundle.toString());
save('bundle.js.map', bundle.generateMap({ 
  hires: false,
  includeContent: true,
}).toString());