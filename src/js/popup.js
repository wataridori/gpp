var VERSION_NAME_DEV = 'dev';
var VERSION_NAME_RELEASE = 'final';

$(function() {
    var appDetail = chrome.app.getDetails();
    var version = appDetail.version;
    var appName = appDetail.name;
    if (isDevVersion(appName)) {
        var versionName = VERSION_NAME_DEV;
    } else {
        var versionName = VERSION_NAME_RELEASE;
    }

    $('#gpp-version').html(version + ' ' + versionName);
    $('#option-btn').click(function () {
        chrome.tabs.create({url:chrome.extension.getURL(appDetail.options_page)});
    });

    $('a').click(function (){
        var href = $(this).attr('href');
        if (href) {
            chrome.tabs.create({url: href});
        }
    });
});

function isDevVersion(appName) {
    return appName.indexOf(VERSION_NAME_DEV, appName.length - VERSION_NAME_DEV.length) !== -1;
}