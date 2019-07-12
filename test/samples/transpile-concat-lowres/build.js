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