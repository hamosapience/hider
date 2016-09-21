export default {
    'chrome': '(function(){return navigator.userAgent.toLowerCase().split(/\\/\\d\\d\\./)[0].slice(-6)})()',
    'http': `(function(){return document.location.protocol.slice(0,4)})()`,
    'body': `(function(){document.body.tagName.toLowerCase()})()`
};
