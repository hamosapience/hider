//original
function test(a, b, c) {
    var t = "superstr";
    var e = t.split(a);
    if (c)
        return e.length / b;
    else
        return e.length * b;
}

//generated
function test(a, b, c) {
    var s = "s", r = "r";
    var t = s + "upe" + r;
    t += s + "t" + r;
    var l = t.split(a).length;
    return c ? (l / b) : (l * b);
}
