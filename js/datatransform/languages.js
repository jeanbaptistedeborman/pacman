/**
 * Created by Jean-Baptiste on 13/04/2017.
 */


var
    languages_array = require('../../data/languages.json'),
    ArrayUtils = require('../game/utils/arrayutils'),
    languages_map = [],
    languagesClone_map;
    languages_array.forEach(function (element) {
    var
        length_num = element.label.length,
        cel_array = languages_map[length_num];
    if (!cel_array) {
        cel_array = languages_map[length_num] = [];
    }
    cel_array.push(element);
});
languagesClone_map = JSON.parse(JSON.stringify(languages_map));
module.exports = {
    getRandomLanguageOfLength: function (length_num) {
        var
            possibleLanguages_array = languagesClone_map[length_num];
        if (!possibleLanguages_array) {
            return null;
        }
        if (possibleLanguages_array.length === 0) {
            possibleLanguages_array = languagesClone_map[length_num] = JSON.parse (JSON.stringify(languages_map[length_num]));
        }
        return ArrayUtils.getRandomCel(possibleLanguages_array, true);
    },
    getLanguageById: function (id_str) {
        return languages_array.filter(function (element) {
            return element.id === id_str;
        })[0];
    }
};
