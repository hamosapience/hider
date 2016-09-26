// run.js
require("babel-register");

var fs = require('fs');
var babel = require('babel-core');

var moriscript = require('./moriscript');
var nameMangler = require('./name_mangler');
var constantFolding = require('./constant_folding');
var minifyReplace = require('./minify_replace');
var stringSplitter = require('./string_splitter');
var ladderMix = require('./ladder_mix2');

var replacer = [minifyReplace, {
    "replacements": [{
        stringLiteral: "xAddr",
        replacement: {
            type: "stringLiteral",
            value: 'xAddr2',
        }
    }]
}];

const babiliAlwaysPlugins = [
    "babel-plugin-transform-property-literals"
];

const babiliPlugins = [
    "babel-plugin-minify-simplify",
    "babel-plugin-minify-type-constructors",
    "babel-plugin-transform-member-expression-literals",
    // "babel-plugin-transform-merge-sibling-variables",
];

const pluginFilter = () => {
    if (Math.random() > 0.5) {
        return true;
    }
};

var fileName = process.argv[2];

fs.readFile(fileName, function(err, data) {
    if(err) throw err;

    var src = data.toString();

    src = ladderMix(src);

    var out = babel.transform(src, {
        compact: false,
        minified: false,
        comments: false,
        plugins: [
            replacer,
            constantFolding,
            stringSplitter,
            [nameMangler, {blacklist: {_pgrwcm: true}}],
        ].concat(babiliAlwaysPlugins).concat(babiliPlugins.filter(pluginFilter)),
    });

    console.log(out.code);
});
