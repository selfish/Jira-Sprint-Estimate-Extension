function format(num) {
    return (num / 3600).toFixed(1).replace('.0', '');
}

function mkTBody(estimates) {

    var TRs = '';

    _.each(estimates, function (data, assignee) {
        console.log(data.assigneeAvatar);
        TRs += ('<tr>' +
        '<td><img src="' + data.assigneeAvatar + '" class="ghx-avatar-img"></img>' + assignee + '</td>' +
        '<td class="ghx-right">' + data.totalIssues + '</td>' +
        '<td class="ghx-right">' + format(data.originalEstimate) + ' Hours' + '</td>' +
        '<td class="ghx-right">' + format(data.remainingEstimate) + ' Hours' + '</td>' +
        '</tr>');
    });

    // Add total row:
    TRs += ('</tbody>' +
    '<tfoot><tr>' +
    '<td><span class="ghx-no-avatar">Total</span></td>' +
    '<td class="ghx-right">' + _.sum(estimates, 'totalIssues') + '</td>' +
    '<td class="ghx-right">' + format(_.sum(estimates, 'originalEstimate')) + ' Hours' + '</td>' +
    '<td class="ghx-right">' + format(_.sum(estimates, 'remainingEstimate')) + ' Hours' + '</td>' +
    '</tr>' +
    '</tfoot>');

    return TRs;
}


function estimateBase(sprintName, trs) {
    return $('<div id="extEstimate" class="jira-dialog box-shadow jira-dialog-open popup-width-medium jira-dialog-content-ready" style="width: 650px; position: absolute; top:50px; left: ' + (screen.width - 650) / 2 + 'px; margin: auto;">' +
        '<div class="jira-dialog-heading">' +
        '<h2 title="Workload by assignee - Client &amp; Store - Sprint 4">Workload by assignee - ' + sprintName + '</h2>' +
        '</div>' +
        '<div class="jira-dialog-content">' +
        '<div class="form-body ghx-assigned-work-table">' +
        '<table class="aui">' +
        '<thead>' +
        '<tr>' +
        '<th>Assignee</th>' +
        '<th class="ghx-right">Issues</th>' +
        '<th class="ghx-right">Original Estimate</th>' +
        '<th class="ghx-right">Remaining Estimate</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        trs +
        '</table>' +
        '</div>' +
        '<div class="buttons-container form-footer">' +
        '<div class="buttons">' +
        '<span class="icon throbber"></span>' +
        '<button class="aui-button aui-button-link cancel" id="aui-dialog-close">Close</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
}


function mkBlanket() {
    var blanket = $('<div id="blanket" class="aui-blanket" tabindex="0"></div>');
    var clock = $('<div id="clock" class="jira-dialog box-shadow jira-dialog-open popup-width-medium jira-dialog-content-ready" style="margin-left: auto; margin-right: auto; left: 0; right: 0; padding: 50px 70px; text-align: center;position: absolute;width: 160px;top: 100px;" >' +
        '<img src="' + chrome.extension.getURL('/img/icon128.png') + '"></img>' +
        '<br><H2 id="working">Working...</H2>' +
        '</div>');
    blanket.click(hideEstimate);
    $('body').append(blanket).append(clock);

    var texts = ['Querying...', 'Loading...', 'Aggregating...', 'Working...'];
    var idx = 0;

    function tick() {
        var clock = $('#working');
        if (clock) {
            clock.html(texts[idx++ % (texts.length)]);
            setTimeout(tick, 1500)
        }
    }

    tick();

}
function mkEstimate(estimate) {
    //mkBlanket();
    estimate.click(hideEstimate);
    $('body').append(estimate);
    $('#clock').remove();
}

function hideEstimate() {
    $('#blanket').remove();
    $('#extEstimate').remove();
    $('#clock').remove();
}

function showEstimate(sprintID, sprintName) {
    mkBlanket();
    ajax(host('rest/api/2/search?maxResults=1000&jql=Sprint%20%3D%20' + sprintID))
        .then(JSON.parse)
        .then(function (response) {
            return response.issues;
        })
        .map(function (issue) {
            return (!issue.fields.timeoriginalestimate) ? false : {
                originalEstimate: issue.fields.timeoriginalestimate,
                remainingEstimate: issue.fields.timeestimate,
                assignee: (!!issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned'),
                assigneeAvatar: (!!issue.fields.assignee
                    ? issue.fields.assignee.avatarUrls['32x32']
                    : chrome.extension.getURL('/img/icon128.png'))
            }
        })
        .then(_.compact)
        .then(_.partialRight(_.groupBy, 'assignee'))
        .then(function (estimates) {
            _.each(estimates, function (issues, assignee) {
                estimates[assignee] = {
                    totalIssues: issues.length,
                    originalEstimate: _.sum(issues, 'originalEstimate'),
                    remainingEstimate: _.sum(issues, 'remainingEstimate'),
                    assigneeAvatar: _.first(issues)['assigneeAvatar']
                };
            });
            return estimates;
        })
        .then(mkTBody)
        .then(_.partial(estimateBase, sprintName))
        .then(mkEstimate);
}