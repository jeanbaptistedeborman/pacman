/**
 * Created by Jean-Baptiste on 13/04/2017.
 * @module
 * @description Manages the loading and distribution of the labels used in the application.
 *
 *
 */
var labels_json,
    languages_json;

function loadJSON(url_str, callback_fun) {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', url_str, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && Number (xobj.status) === 200) {
            callback_fun(xobj.responseText);
        }
    };
    xobj.send(null);
}

module.exports = {
    /**
     * @description Loads the labels in a given language.
     * @param {string} lg_str -  The language code od the labels to get.
     * @param {function} callback_fun - callback_fun - The callback called with the data as argument.
     */
    fetchLabels: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/labels_linguago/labels_linguago_' + lg_str + '.json',
            function (labels_data) {
                labels_json = JSON.parse(labels_data);
                callback_fun(labels_json);
            }
        );
    },
    /**
     * @description Loads the translations of the languages in a given language
     * @param {string} lg_str - The language of the translations
     * @param {function}  callback_fun - The callback called with the data as argument.
     */
    fetchLanguages: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/languages/languages_' + lg_str + '.json',
            function (labels_data) {
                languages_json = JSON.parse(labels_data);
                if (languages_json.Id) {
                    delete languages_json.Id;
                }
                if (callback_fun) {
                    callback_fun(labels_json);
                }
            }
        );
    },
    /**
     *
     * @description - Gets the translations of languages currently used by the game
     * @returns {Object} - The translations in JSON-format
     */
    getCurrentLanguages: function () {
        return languages_json;
    },
    /**
     *
     * @description - Gets the text of a label
     * @param labelId_str - The id identifying the text to fetch.
     * @returns {String} - The translation
     */
    getLabel: function (labelId_str) {
        var result_str = labels_json[labelId_str];
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
