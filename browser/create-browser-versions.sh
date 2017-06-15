#!/usr/bin/env bash

# author: Pieter Heyvaert (pheyvaer.heyvaert@ugent.be)
# Ghent University - imec - IDLab

./node_modules/browserify/bin/cmd.js index.js -o ./browser/pinta.js --standalone pinta
./node_modules/babel-cli/bin/babel.js ./browser/pinta.js -o ./browser/pinta.min.js