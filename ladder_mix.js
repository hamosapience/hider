function ladder_mix(codeStr) {
    var codeLines = codeStr.split('\n').filter(function(elem){
        return !!(elem.trim());
    });

    var tabLevel = function(line) {
        return line.length - line.trimLeft().length;
    };

    var shuffleArray = function(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1]; a[i - 1] = a[j]; a[j] = x;
        }
    };
    var lastString;

    var mixStart = function(lineIndex) {
        var blocks = [];
        var line = codeLines[lineIndex];

        var initialIndex = lineIndex + 1;
        var initialLevel = tabLevel(line);

        var block = "";
        while (line.trim() != '/*%END_MIX%*/') {
            lineIndex++; line = codeLines[lineIndex];
            if (line.trim() == '/*%BEGIN_MIX%*/') {
                lineIndex += mixStart(lineIndex) + 1;
                block += '\n' + lastString;
            }
            if (tabLevel(line) != initialLevel) {
                //same block
                block += '\n' + line;
            } else {
                //another block
                blocks.push(block);
                block = line;
            }
        }
        blocks.shift();

        shuffleArray(blocks);
        lastString = blocks.join('\n');
        var resultLines = lastString.split('\n');

        for (var i = 0; i < resultLines.length; i++) {
            codeLines[i + initialIndex] = resultLines[i];
        }

        return resultLines.length;
    };

    var index = 0;
    while (true) {
        while (codeLines[index].trim() != '/*%BEGIN_MIX%*/') {
            index++;
            if (index == codeLines.length)
                return codeLines.join('\n');
        }
        index += mixStart(index);
    }
}

module.exports = ladder_mix;
