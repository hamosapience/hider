//original
function test(a, b, c) {
    /*%BEGIN_MIX%*/
        /*%BEGIN_BLOCK%*/
            var t = "superstr";
            var e = t.split(a);
        /*%END_BLOCK%*/
        if (c)
        /*%BEGIN_BLOCK%*/
            asdf
            /*%BEGIN_MIX%*/
                asdf1
                asdf2
            /*%END_MIX%*/
            /*%BEGIN_BLOCK%*/
                return e.length / b;
                return e.length * b;
            /*%END_BLOCK%*/
            foo
        /*%END_BLOCK%*/
    /*%END_MIX%*/
}
