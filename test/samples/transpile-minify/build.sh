#!/bin/bash
DIR=`dirname $0`
NODE_BIN=`npm bin`

rm "$DIR"/files/*.js*

if [ ! -f "$NODE_BIN/babel" ]; then
  npm install --no-save @babel/cli @babel/preset-env
fi
"$NODE_BIN/babel" "$DIR/files" --config-file "./$DIR/babel.config.js" --source-maps -d "$DIR/files"

npx terser "$DIR/files/helloworld.js" -c --source-map "base='$DIR/files',includeSources" --comments all -o "$DIR/files/helloworld.min.js"
npx prettier "$DIR/files/*.map" --parser json --write
