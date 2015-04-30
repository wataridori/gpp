init();
function init() {
    injectJsFile('gpp.js');
}

function injectJsFile(fileName) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('js/' + fileName);
    (document.documentElement).appendChild(script);
}