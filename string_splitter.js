"use strict";

import template from 'babel-template';
import generate from "babel-generator";

const CHARSET = ("abcdefghijklmnopqrstuvwxyz" +
"ABCDEFGHIJKLMNOPQRSTUVWXYZ$_").split("");


const splitString = (s) => {
    const len = s.length;

    if (len < 4 || len > 300) {
        return [s];
    }

    const chunks = [];
    let i = 0;

    while (i < len) {
        const step = Math.floor(Math.random() * (4 - 1)) + 1;
        chunks.push(s.slice(i, i + step));
        i += step;
    }

    return chunks;
};

const hop = Object.prototype.hasOwnProperty;

module.exports = ({ types: t, traverse }) => {
    const seen = Symbol("seen");

    return {
        name: "string-splitter",
        visitor: {

            Expression(path) {

                if (path.isStringLiteral()) {
                    const { node, scope } = path;

                    if (node[seen]) {
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

                    const declarationTemplate = template(`
                        var NAME = VALUE;
                    `);

                    const code = stringChunks.map((chunk, i) => {
                        return declarationTemplate({
                            NAME: t.identifier(varNames[i]),
                            VALUE: t.stringLiteral(chunk)
                        });
                    });

                    const newNode = code[0];
                    newNode[seen] = true;
                    path.replaceWith(newNode);
                }
                //
                // const res = path.evaluate();
                // if (res.confident) {
                //     const node = t.valueToNode(res.value);
                //     node[seen] = true;
                //     path.replaceWith(node);
                // }
            },
        },
    };
};
