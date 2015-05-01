var CHROME_SYNC_KEY = 'GPP_CHROME_SYNC_KEY';
var GPP_DATA = 'GPP_DATA_LOCAL_STORAGE';

init();
function init() {
    chrome.storage.sync.get(CHROME_SYNC_KEY, function(info) {
        if (!$.isEmptyObject(info)) {
            info = info[CHROME_SYNC_KEY];
            localStorage[GPP_DATA] = JSON.stringify(info);
        }
        injectJsFile('gpp.js');
    });
}

function injectJsFile(fileName) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL('js/' + fileName);
    (document.documentElement).appendChild(script);
}