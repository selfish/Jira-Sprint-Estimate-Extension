/**
 * Created by Nitai J. Perez
 * nitai.perez@gmail.com
 * 29/08/2015.
 */

function estimateButton(text, id) {
    var button = $('<button class="aui-button" data-sprint-id="' + id + '">' + (text || 'Estimate') + '</button>');
    button.click(_.partial(showEstimate, id, text));
    return button;
}


$(document).on('DOMNodeInserted', function (e) {
    if ($(e.target).is('.js-sprint-container')) {
        var $sprintContainer = $(e.target);
        var $nameContainer = $($sprintContainer.find('.ghx-name'));
        var sprintName = $nameContainer.children('span').attr('data-fieldvalue');
        var sprintId = $nameContainer.parent().attr('data-sprint-id');
        $nameContainer.before(estimateButton(sprintName, sprintId));
        $nameContainer.remove();
    }
});