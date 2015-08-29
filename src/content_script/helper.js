/**
 * Created by Nitai J. Perez
 * nitai.perez@ironsrc.com
 * on 29/08/2015
 */


function host(uri) {
    var path = ($($('head > meta[name="ajs-context-path"]')[0]).attr('content') || '');
    if (!uri) return (location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + path);
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