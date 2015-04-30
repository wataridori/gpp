function GPP() {
    var gpp = this;
    var regex = /#([0-9]+) /g;
    var issueTitleClasses = ['.issue-title-link', '.js-issue-title'];
    var redmineLink = 'http://dev.framgia.com/redmine/issues/';

    gpp.init = function() {
        gpp.checkTitle();
        $(document).on("pjax:end", function() {
            gpp.checkTitle();
        })
    };

    gpp.checkTitle = function () {
        for (var i in issueTitleClasses) {
            $(issueTitleClasses[i]).each(function() {
                gpp.parseTicketLink($(this));
            });
        }
    };

    gpp.parseTicketLink = function(dom) {
        var text = dom.text();
        var matches = text.match(regex);
        if (matches) {
            for (var i in matches) {
                var match = matches[i];
                var link = gpp.generateTicketLink(match);
                text = text.replace(match, link);
            }
            dom.html(text);
        }
    };

    gpp.generateTicketLink = function(ticket) {
        var ticketNumber = ticket.replace(/#|\s/g, '');
        var link = redmineLink + ticketNumber;
        return '<a href="' + link + '" target="_blank">' + ticket + '</a>';
    }
}

var g = new GPP();
g.init();