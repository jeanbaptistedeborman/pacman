/**
 * Created by Jean-Baptiste on 13/04/2017.
 */
var labels_json,
    languages_json;

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
    fetchLabels: function (lg_str, callback_fun) {
        loadJSON('data/labels/labels_linguago/labels_linguago_' + lg_str + '.json',
            function (labels_data) {
                labels_json = JSON.parse(labels_data);
                callback_fun(labels_json);
            }
        );
    },
    fetchLanguages: function (lg_str, callback_fun) {
        loadJSON('data/labels/languages/languages_' + lg_str + '.json',
            function (labels_data) {
                languages_json = JSON.parse(labels_data);

                delete languages_json.Id;
                console.log ('languages_json', languages_json);
                callback_fun(labels_json);
            }
        );
    },
    getCurrentLanguages: function () {
        return languages_json;
    },

    getLabel: function (labelId_str) {
        var result_str = labels_json[labelId_str];
        console.log ("result_str : ", result_str);
        if (result_str) {
            return labels_json[labelId_str];
        } else {
            throw (new Error('Lablel "' +
                labelId_str +
                '" was not found'
            ));
        }
    }
};
