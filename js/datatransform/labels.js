/**
 * Created by Jean-Baptiste on 13/04/2017.
 */
var labels_json;

function loadJSON(url_str, callback_fun) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url_str, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback_fun(xobj.responseText);
        }
    };
    xobj.send(null);
}

module.exports = {
    fetch: function (lg_str, callback_fun) {
        loadJSON('data/labels/labels_' + lg_str + '.json',
            function (labels_data) {
                labels_json = JSON.parse(labels_data);
                callback_fun(labels_json);
            }
        );
    },
    get data() {
        return labels_json;
    }
};
