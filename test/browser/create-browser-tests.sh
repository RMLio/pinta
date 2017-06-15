#!/usr/bin/env bash

./node_modules/browserify/bin/cmd.js ./test/node/search.js -o ./test/browser/search.js
./node_modules/browserify/bin/cmd.js ./test/node/searchpaths.js -o ./test/browser/searchpaths.js