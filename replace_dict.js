export default {
    'chrome': '(()=>navigator.userAgent.toLowerCase().split(/\\/\\d\\d\\./)[0].slice(-6))()',
    'http': `(()=>document.location.protocol.slice(0,4))()`,
    'body': `(()=>document.body.tagName.toLowerCase())()`
};
