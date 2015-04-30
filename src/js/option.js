function GppOption() {
    var me = this;
    var projectData = [];

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
            me.fillTableData();
        });
    };

    me.handleOnSave = function() {
        var projectNameDom = $('#project-name');
        var projectLinkDom = $('#project-link');
        var name = projectNameDom.val();
        var link = projectLinkDom.val();
        if (name && link) {
            projectData[name] = link;
            me.fillTableData();
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
    }
}

$(function (){
    var gppOption = new GppOption();
    gppOption.init();
});

