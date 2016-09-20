"use strict";

import template from 'babel-template';
import replaceDict from './replace_dict';
import ignore from './ignore_list';
import functionNames from './function_names';

import _ from 'lodash';

const CHARSET = ("abcdefghijklmnopqrstuvwxyz" +
"ABCDEFGHIJKLMNOPQRSTUVWXYZ$_").split("");

const encrypt = function(str, key) {
    var result = '';
    for (var i=0; i<str.length; i++) {
        result += String.fromCharCode( key ^ str.charCodeAt(i) );

    }
    return result;
};

const decryptFunctionText = `{
        var result = '';
        for (var i=0; i<hash.length; i++) {
            result += String.fromCharCode( key ^ hash.charCodeAt(i) );
        }
        return result;
}`;

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
        return `[${vars.join(',')}].reduce((s,v)=>{s += v;return s;}, '')`;
    }
};

const hop = Object.prototype.hasOwnProperty;

module.exports = ({ types: t, traverse }) => {
    const seen = Symbol("seen");
    const scopeKeyVarName = Symbol("encoding_key");
    const encodingKey = (Math.random() * 100).toString().slice(0,2);

    const decryptFuncName = _.sample(functionNames.decrypt);
    const nameSpace = 'jQuery';

    const decryptFuncMemberExpr = t.memberExpression(
        t.identifier(nameSpace),
        t.identifier(decryptFuncName)
    );

    const decryptFunc = template(decryptFunctionText)();
    const decryptFuncExpr = t.functionExpression(null, [t.identifier('hash'), t.identifier('key')], decryptFunc);

    let decryptorInjected = false;

    return {
        name: "string-splitter",
        visitor: {

            ExpressionStatement(path) {
                if (path.parentPath.isProgram() && !decryptorInjected) {
                    decryptorInjected = true;
                    path.insertBefore(t.AssignmentExpression(
                        '=',
                        decryptFuncMemberExpr,
                        decryptFuncExpr
                    ));
                }
            },

            Expression(path) {

                if (!path.isStringLiteral()) {
                    return;
                }

                const { node, scope } = path;

                if (node[seen] || node.value.length < 3 || ignore.indexOf(node.value) !== -1) {
                    return;
                }

                path.node[seen] = true;

                if (replaceDict[node.value] && Math.random() > 0.5) {
                    const replacement = template(replaceDict[node.value])();
                    path.replaceWith(replacement);
                    return;
                }

                if (Math.random() > 0.5) {
                    let keyVarName;

                    const keyStringLiteral = t.stringLiteral(encodingKey);
                    keyStringLiteral[seen] = true;

                    if (!scope[scopeKeyVarName]) {
                        keyVarName = path.scope.generateUidIdentifier('_ec');
                        scope.push({
                            id: keyVarName,
                            init: keyStringLiteral
                        });
                        scope[scopeKeyVarName] = keyVarName;
                    }

                    const encodedStringLiteral = t.stringLiteral(encrypt(node.value, encodingKey));
                    encodedStringLiteral[seen] = true;

                    const callExpression = t.callExpression(
                        decryptFuncMemberExpr,
                        [encodedStringLiteral, scope[scopeKeyVarName]]
                    );

                    path.replaceWith(callExpression);
                    return;
                }

                if (Math.random() > 0.5) {
                    const getterFunctionName = path.scope.generateUidIdentifier('_sg');
                    const functionContent = t.BlockStatement([
                        t.ReturnStatement(t.stringLiteral(node.value))
                    ]);
                    const f = t.functionExpression(
                        null,
                        [],
                        functionContent
                    );

                    scope.push({
                        id: getterFunctionName,
                        init: f
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
                    const randomIndex1 = Math.floor(Math.random() * (CHARSET.length - 1));
                    const randomIndex2 = Math.floor(Math.random() * (CHARSET.length - 1));
                    return CHARSET[randomIndex1] + CHARSET[randomIndex2];
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

                console.log('varNames', varNames);

                const replacement = template(getConcatenated(varNames))();
                path.replaceWith(replacement);
            },
        },
    };
};
