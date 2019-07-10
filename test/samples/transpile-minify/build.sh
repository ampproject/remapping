#!/bin/bash          
DIR=`dirname $0`
NODE_MODULES=`npm prefix`/node_modules

if [ ! -f "$NODE_MODULES/.bin/babel" ]; then
  npm install --no-save @babel/cli @babel/preset-env
fi
"$NODE_MODULES/.bin/babel" "$DIR/helloworld.mjs" --presets "$NODE_MODULES/@babel/preset-env" --source-maps -o "$DIR/helloworld.js"
npx terser "$DIR/helloworld.js" -c --source-map "base='$DIR',includeSources" -o "$DIR/helloworld.min.js"
npx prettier "$DIR/*.map" --parser json --write