var CHROME_SYNC_KEY = 'GPP_CHROME_SYNC_KEY';

function GppOption() {
    var me = this;
    var projectData = {};

    chrome.storage.sync.get(CHROME_SYNC_KEY, function(info) {
        if (!$.isEmptyObject(info)) {
            projectData = info[CHROME_SYNC_KEY];
            me.fillTableData();
        }
    });

    me.init = function() {
        $('#project-name').focus();

        $('#save-btn').click(function(e) {
            e.preventDefault();
            me.handleOnSave();
        });
        $('input[type=text]').on('keydown', function(e) {
            if (e.which == 13) {
                e.preventDefault();
                me.handleOnSave();
            }
        });

        $('body').on('click', '.btn-data-remove', function() {
            var name = $(this).data('name');
            delete projectData[name];
            me.sync(me.fillTableData);
        });
    };

    me.sync = function(callback) {
        var sync = {};
        sync[CHROME_SYNC_KEY] = projectData;
        chrome.storage.sync.set(sync, function() {
            if (typeof callback !== 'undefined') {
                callback();
            }
        });
    };

    me.handleOnSave = function() {
        var projectNameDom = $('#project-name');
        var projectLinkDom = $('#project-link');
        var name = projectNameDom.val().trim();
        var link = projectLinkDom.val().trim();
        if (name && link) {
            if (!me.validateUrl(link)) {
                return void $('#modal').openModal();
            }
            if (link.substr(-1, 1) !== '/' ) {
                link += '/';
            }
            projectData[name] = link;
            me.sync(me.fillTableData);
            projectNameDom.val('').focus();
            projectLinkDom.val('');
        }
    };

    me.fillTableData = function() {
        var tableText = '';
        var tableBody = $('#table-data').find('tbody');
        tableBody.html('');
        for (var name in projectData) {
            tableText += '<tr id="row-' + name + '">';
            tableText += '<td class="">' + name + '</td>';
            tableText += '<td class=""><a href="' + projectData[name] + '" target="_blank">' + projectData[name] + "</a></td>";
            tableText += "<td class='text-center'><button class='btn waves-effect waves-light red btn-data-remove' data-name='" + name
            + "' id='btn-" + name + "'> Remove </button></td>";
            tableText += "</tr>";
        }
        tableBody.append(tableText);
    };

    me.validateUrl = function(url) {
        var regexp = /(https|http):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(url);
    };
}

$(function (){
    var gppOption = new GppOption();
    gppOption.init();
});

