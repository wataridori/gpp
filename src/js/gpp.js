var GPP_DATA = 'GPP_DATA_LOCAL_STORAGE';

function GPP() {
    var me = this;
    var regex = /#([0-9]+)/g;
    var issueTitleClasses = ['.js-issue-title', '.js-comment-body', '.commit-desc pre'];
    var issueLinkClasses = ['.issue-title-link', 'p.commit-title a.message', 'td.message a.message'];
    var commitTitleClasses = ['div.full-commit p.commit-title'];
    var projectData = {};
    var currentProject = [];

    me.init = function() {
        if (localStorage[GPP_DATA] !== undefined) {
            var data = JSON.parse(localStorage[GPP_DATA]);
            if (!$.isEmptyObject(data)) {
                projectData = data;
            }
        }

        me.parseTicket();
        $(document).on("pjax:end", function() {
            me.parseTicket();
        })
    };

    me.getCurrentProject = function() {
        var project = $('.js-current-repository').attr('href');
        if (project) {
            currentProject = project.split('/');
            if (!currentProject[0]) {
                currentProject.shift();
            }
        } else {
            currentProject = [];
        }
    };

    me.checkCurrentProject = function() {
        for (var name in projectData) {
            var currentProjectName = currentProject[1] || null;
            if (name.indexOf('/') > 0) {
                currentProjectName = currentProject.join('/');
            }
            if (name === currentProjectName) {
                return name;
            }
        }

        return null;
    };

    me.parseTicket = function () {
        me.getCurrentProject();
        var name = me.checkCurrentProject();
        if (!name) {
            return;
        }

        for (var i in issueTitleClasses) {
            $(issueTitleClasses[i]).each(function() {
                me.parseTicketLink($(this), projectData[name]);
            });
        }

        for (var i in issueLinkClasses) {
            $(issueLinkClasses[i]).each(function() {
                me.parseTicketLink($(this), projectData[name], {is_link: true});
            });
        }

        for (var i in commitTitleClasses) {
            $(commitTitleClasses[i]).each(function() {
                me.parseTicketLink($(this), projectData[name], {is_commit_title: true});
            });
        }
    };

    me.parseTicketLink = function(dom, baseLink, option) {
        if ($.isEmptyObject(option)) {
            option = {};
        }
        var text = dom.html();
        var matches = text.match(regex);

        if (option.is_commit_title) {
            var pullRequest = dom.find('a');
            if (pullRequest.length === 1) {
                var outerHtml = pullRequest[0].outerHTML;
                var temporaryText = Date.now() + 'GPP_PULL_REQUEST';
                text = text.replace(outerHtml, temporaryText);
            }
        }
        if (matches) {
            for (var i in matches) {
                var match = matches[i];
                var link = me.generateTicketLink(match, baseLink);
                text = text.replace(match, link);
            }
            if (option.is_link) {
                var attributesList = ['href', 'class', 'title', 'data-pjax'];
                var attributes = {};
                for (var i in attributesList) {
                    var attributeName = attributesList[i];
                    attributes[attributeName] = dom.attr(attributeName);
                }
                var arr = text.split('</a>');
                for (i in arr) {
                    var pureText = arr[i];
                    var pos = pureText.indexOf('<a href="');
                    if (pos === -1) {
                        pos = pureText.length;
                    }
                    if (pos > 0) {
                        var textOnly = pureText.substr(0, pos);
                        attributes.html = textOnly;
                        var aElement = $('<a>', attributes);
                        var textLink = aElement[0].outerHTML;
                        pureText = pureText.replace(textOnly, textLink);
                        arr[i] = pureText;
                    }
                }
                text = arr.join('</a>');
                dom.replaceWith(text);
            } else {
                if (option.is_commit_title && outerHtml && temporaryText) {
                    text = text.replace(temporaryText, outerHtml);
                }
                dom.html(text);
            }
        }
    };

    me.generateTicketLink = function(ticket, baseLink) {
        var ticketNumber = ticket.replace(/#|\s/g, '');
        var link = baseLink + ticketNumber;
        return '<a href="' + link + '" target="_blank" class="issue-link">' + ticket + '</a>';
    }
}

(function addStyle() {
    $("<style type='text/css'> div.issue-title a.issue-link {font-weight:bold; font-size:15px; color: #4183c4 !important;};</style>").appendTo("head");
})();

var g = new GPP();
g.init();