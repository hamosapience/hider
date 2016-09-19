// run.js
require("babel-register");

var fs = require('fs');
var babel = require('babel-core');

var moriscript = require('./moriscript');
var nameMangler = require('./name_mangler');
var constantFolding = require('./constant_folding');
var minifyReplace = require('./minify_replace');

var windowReplacer = [minifyReplace, {
    "replacements": [{
        identifierName: "window",
        replacement: {
            type: "identifier",
            value: 'window',
        }
    }]
}];

var fileName = process.argv[2];

fs.readFile(fileName, function(err, data) {
  if(err) throw err;

  var src = data.toString();

  var out = babel.transform(src, {
    plugins: [
        nameMangler,
        constantFolding,
        windowReplacer
    ]
  });

  console.log(out.code);
});
