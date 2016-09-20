// run.js
require("babel-register");

var fs = require('fs');
var babel = require('babel-core');

var moriscript = require('./moriscript');
var nameMangler = require('./name_mangler');
var constantFolding = require('./constant_folding');
var minifyReplace = require('./minify_replace');
var stringSplitter = require('./string_splitter');

var windowReplacer = [minifyReplace, {
    "replacements": [{
        identifierName: "window",
        replacement: {
            type: "identifier",
            value: 'window',
        }
    }]
}];

const babiliPlugins = [
    "babel-plugin-minify-simplify",
    "babel-plugin-minify-type-constructors",
    "babel-plugin-transform-member-expression-literals",
    "babel-plugin-transform-merge-sibling-variables",
    "babel-plugin-transform-property-literals"
];

const pluginFilter = () => {
    return true;
};

var fileName = process.argv[2];

fs.readFile(fileName, function(err, data) {
  if(err) throw err;

  var src = data.toString();

  var out = babel.transform(src, {
    plugins: [
        nameMangler,
        constantFolding,
        windowReplacer,
        stringSplitter
    ].concat(babiliPlugins.filter(pluginFilter))
  });

  console.log(out.code);
});
