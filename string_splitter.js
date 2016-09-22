"use strict";

import template from 'babel-template';
import replaceDict from './replace_dict';
import ignore from './ignore_list';
import functionNames from './function_names';

import _ from 'lodash';

const CHARSET = ("abcdefghijklmnopqrstuvwxyz" +
"ABCDEFGHIJKLMNOPQRSTUVWXYZ$_").split("");

const getRandomChar = () => {
    const randomIndex = Math.floor(Math.random() * (CHARSET.length - 1));
    return CHARSET[randomIndex];
};

const encrypt = function(str, key) {
    var result = '';
    for (var i=0; i<str.length; i++) {
        var r = str.charCodeAt(i);
        var k = key;
        var x = (!k & r) | (k & !r);
        result += String.fromCharCode( k ^ r );

    }
    return result;
};

const splitString = (s) => {
    const len = s.length;

    if (len < 4 || len > 300) {
        return [s];
    }

    const chunks = [];
    let i = 0;

    while (i < len) {
        const step = Math.floor(Math.random() * (4 - 1)) + 2;
        chunks.push(s.slice(i, i + step));
        i += step;
    }

    return chunks;
};

const getConcatenated = (vars) => {
    const choose = Math.random() * 3;

    if (choose < 1) {
        return vars.slice(1).reduce((str, varName) => {
            str += `+${varName}`;
            return str;
        }, vars[0]);
    } else if (choose < 2) {
        return `[${vars.join(',')}].join('')`;
    } else {
        return `[${vars.join(',')}].reduce(function(s,v){s += v;return s;}, '')`;
    }
};

const hop = Object.prototype.hasOwnProperty;

module.exports = ({ types: t, traverse }) => {
    const seen = Symbol("seen");
    const keyInjected = Symbol("injected");
    const encodingKey = (Math.random() * 100).toString().slice(0,2);

    const decryptFuncName = _.sample(functionNames.decrypt);
    const nameSpace = 'jQuery';

    const decryptFuncMemberExpr = t.memberExpression(
        t.identifier(nameSpace),
        t.identifier(decryptFuncName)
    );

    return {
        name: "string-splitter",
        visitor: {

            FunctionExpression(path) {
                const { node, scope } = path;

                if (scope.hasBinding('_pgrwcm') && !scope[keyInjected]) {
                    scope.push({
                        id: t.identifier('$K'),
                        init: t.stringLiteral(encodingKey)
                    });
                    scope[keyInjected] = true;
                }
            },

            StringLiteral(path) {

                if (!path.isStringLiteral()) {
                    return;
                }

                const { node, scope } = path;

                if (node[seen] || node.value.length < 3 || ignore.indexOf(node.value) !== -1) {
                    return;
                }

                path.node[seen] = true;

                if (replaceDict[node.value] && Math.random() > 0.3) {
                    const replacement = template(replaceDict[node.value])();
                    path.replaceWith(replacement);
                    return;
                }

                if (Math.random() > 0.5 && !scope.hasBinding('_pgrwcm')) {
                    const keyStringLiteral = t.stringLiteral(encodingKey);
                    keyStringLiteral[seen] = true;

                    const encodedStringLiteral = t.stringLiteral(encrypt(node.value, encodingKey));
                    encodedStringLiteral[seen] = true;

                    const callExpression = t.callExpression(
                        decryptFuncMemberExpr,
                        [encodedStringLiteral]
                    );

                    path.replaceWith(callExpression);
                    return;
                }

                if (Math.random() > 0.5) {
                    const getterFunctionName = path.scope.generateUidIdentifier('_sg');

                    const randomVarName = getRandomChar() + getRandomChar() + getRandomChar();
                    const tmpl = template(`(function() {var VARNAME=STRING; return VARNAME;})`);
                    const renderedTmpl = tmpl({
                        VARNAME: t.identifier(randomVarName),
                        STRING: t.stringLiteral(node.value)
                    });

                    scope.push({
                        id: getterFunctionName,
                        init: renderedTmpl.expression
                    });

                    path.replaceWith(t.callExpression(
                        getterFunctionName,
                        []
                    ));
                    return;
                }

                const stringChunks = splitString(node.value);
                const bindings = scope.getAllBindings();
                const used = new Set();

                const getNext = () => {
                    return getRandomChar() + getRandomChar();
                };

                const varNames = stringChunks.map(() => {
                    let next;
                    do {
                        next = getNext();
                    } while (
                        hop.call(bindings, next)
                        || scope.hasGlobal(next)
                        || scope.hasReference(next)
                        || used.has(next)
                    );

                    used.add(next);
                    return next;
                });

                stringChunks.forEach((chunk, i) => {
                    const stringLiteral = t.stringLiteral(chunk);
                    stringLiteral[seen] = true;

                    scope.push({
                        id: t.identifier(varNames[i]),
                        init: stringLiteral
                    });
                });

                const replacement = template(getConcatenated(varNames))();
                path.replaceWith(replacement);
            },
        },
    };
};
