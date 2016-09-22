"use strict";
var _ = require('lodash');

function shuffle_array(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports = function(src) {
    const raw_lines = src.split('\n').filter(line => line);

    let lines = [];
    let blocks = [];
    let blockLevel = -1;

    for (let i = 0; i < raw_lines.length; i++) {
        let line = raw_lines[i].trim();

        if (line === '/*%BEGIN_BLOCK%*/') {
            blockLevel += 1;
            blocks[blockLevel] = [];
        } else if (line === '/*%END_BLOCK%*/') {
            if (blockLevel === 0) {
                lines.push(blocks[blockLevel]);
            } else {
                blocks[blockLevel - 1].push(blocks[blockLevel]);
            }
            blocks[blockLevel] = [];
            blockLevel -= 1;
        } else if (blockLevel === -1) {
            lines.push(line);
        } else {
            blocks[blockLevel].push(line);
        }
    }

    function shuffle(array) {
        let out = [];
        let mix = [];

        let mixing = false;

        for (let i = 0; i < array.length; i++) {
            let line = array[i];

            if (line === '/*%BEGIN_MIX%*/') {
                mixing = true;
            } else if (line === '/*%END_MIX%*/') {
                mixing = false;
                out = out.concat(shuffle_array(mix));
                mix = [];
            } else if (mixing) {
                mix.push(line);
            } else {
                out.push(line);
            }
        }

        return out;
    }

    function traverse(item) {
        if (!Array.isArray(item)) {
            return item;
        } else {
            return shuffle(item).map(traverse);
        }
    }

    return _.flattenDeep(traverse(lines)).join('\n');
}
