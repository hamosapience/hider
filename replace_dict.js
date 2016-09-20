module.export = {
    'chrome': `
        (function() { return navigator.appVersion.toLowerCase().split(/\/\d\d\./)[0].slice(-6);})();
    `,

};
