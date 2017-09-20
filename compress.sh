#!/bin/bash
uglifyjs modules/sigma.min.js \
modules/sigma.canvas.nodes.circle.js \
modules/sigma.canvas.nodes.cell.js \
modules/sigma.plugins.animate.js \
modules/sigma.parsers.json.js \
script.js -o prod.min.js \
--mangle --compress unused
