#!/bin/bash
DIR="$(dirname $0)"
NODE_BIN=`npm bin`
NODE_MODULES=`npm prefix`/node_modules

rm "$DIR/files/*.js*"

if [ ! -f "$NODE_BIN/babel" ]; then
  npm install --no-save @babel/cli @babel/preset-env
fi
"$NODE_BIN/babel" "$DIR/files" --config-file "$DIR/babel.config.js" --source-maps -d "$DIR/files"

if [ ! -d "$NODE_MODULES/magic-string" ]; then
  npm install --no-save magic-string
fi

node "$DIR/build.js"
npx prettier "$DIR/files/*.map" --parser json --write