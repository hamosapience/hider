module.exports = function(babel) {
    var t = babel.types;

    function moriMethod(name) {
        return t.memberExpression(
            t.identifier('mori'),
            t.identifier(name)
        );
    }


    return {
        visitor: {
            ArrayExpression: function(path) {
                path.replaceWith(
                    t.callExpression(
                        moriMethod('vector'),
                        path.node.elements
                    )
                );
            },
            ObjectExpression: function(path) {
                var props = [];

                path.node.properties.forEach(function(prop) {
                    props.push(
                        t.stringLiteral(prop.key.name),
                        prop.value
                    );
                });

                path.replaceWith(
                    t.callExpression(
                        moriMethod('hashMap'),
                        props
                    )
                );
            }
        }
    };
};