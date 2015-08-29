/**
 * Created by Nitai J. Perez
 * nitai.perez@gmail.com
 * 24/08/2015.
 */

// var bg = chrome.extension.getBackgroundPage();

function host(uri) {
    if (!uri) return localStorage.getItem('_server');
    if (uri.indexOf('http') === 0) return uri;

    var splitRegExp = /\/(\b|$)/g;
    return (_.compact(host().split(splitRegExp).concat(uri.split(splitRegExp)))).join('/');
}

function ajax(uri) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: uri,
            type: "GET",
            dataType: "html",
            error: function (jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            },
            success: function (data) {
                resolve(data);
            }
        });
    });
}

function loader() {
    $('#result').html('Loading.');
}

function sprintQuery() {
    var defaultQuery = "Sprint in openSprints()";
    var lsQuery = localStorage.getItem('_jql');
    console.log(!!lsQuery ? lsQuery : defaultQuery);
    return encodeURI(!!lsQuery ? lsQuery : defaultQuery);
}

function getSprints() {
    console.log("Fetching Sprints");
    return ajax(host('rest/greenhopper/1.0/integration/teamcalendars/sprint/list?jql=' + sprintQuery()))
        .then(JSON.parse)
        .then(function (response) {
            return response.sprints;
        })
        .map(_.partialRight(_.pick, ['name', 'id']));
}


$(document).ready(function () {
    function bindInput(selector, ls_name) {
        $(selector).val(localStorage.getItem(ls_name));
        $(selector).change(function () {
            console.log('update');
            localStorage.setItem(ls_name, $(selector).val().trim());
            getSprints();
        });
    }

    bindInput('#host', '_server');
    bindInput('#jql', '_jql');
});

function getIssuesBySprintID(sprintID) {
    loader();
    return ajax(host('rest/api/2/search?maxResults=500&jql=Sprint%20%3D%20' + sprintID))
        .then(JSON.parse)
        .then(function (response) {
            return response.issues;
        })
        .map(function (issue) {
            return (!issue.fields.timeoriginalestimate) ? false : {
                time: (issue.fields.timeoriginalestimate / 3600).toFixed(1),
                assignee: (!!issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned')
            }
        })
        .then(_.compact)
        .then(_.partialRight(_.groupBy, 'assignee'))
        .then(function (estimates) {
            _.each(estimates, function (issues, assignee) {
                estimates[assignee] = _.sum(issues, 'time') + ' Hours';
            });
            return estimates;
        })
        .then(function (estimates) {

            var res = '';
            _.each(estimates, function (time, assignee) {
                res = res.concat('<tr><td>' + assignee + '</td><td>' + time + '</td></tr>')
            });

            var html = '<table>' + res + '</table>';

            //$('#result').html(JSON.stringify(estimates, null, 2));
            $('#result').html(html);
        })
}

getSprints()
    .map(function (sprint) {
        var sel = (localStorage.getItem('sprintSelected') == sprint.id) ? 'selected' : '';
        return '<option value="' + sprint.id + '" ' + sel + '>' + sprint.name + '</option>'
    }).then(function (html) {
        $('#sprintSelect').html(html);
    }).then(function () {
        $('#sprintSelect').change(function () {
            var selected = $('#sprintSelect').val();
            localStorage.setItem('sprintSelected', selected);
            getIssuesBySprintID(selected);
        });
    }).then(function () {
        getIssuesBySprintID($('#sprintSelect').val());
    }).catch(function () {
        $('input').css("border-color", 'red');
    });