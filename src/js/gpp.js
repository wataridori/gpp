var GPP_DATA = 'GPP_DATA_LOCAL_STORAGE';

function GPP() {
    var me = this;
    var regex = /#([0-9]+) /g;
    var issueTitleClasses = ['.issue-title-link', '.js-issue-title'];
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
    };

    me.parseTicketLink = function(dom, baseLink) {
        var text = dom.text();
        var matches = text.match(regex);
        if (matches) {
            for (var i in matches) {
                var match = matches[i];
                var link = me.generateTicketLink(match, baseLink);
                text = text.replace(match, link);
            }
            dom.html(text);
        }
    };

    me.generateTicketLink = function(ticket, baseLink) {
        var ticketNumber = ticket.replace(/#|\s/g, '');
        var link = baseLink + ticketNumber;
        return '<a href="' + link + '" target="_blank">' + ticket + '</a>';
    }
}

var g = new GPP();
g.init();