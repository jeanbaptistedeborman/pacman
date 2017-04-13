/**
 * Created by Jean-Baptiste on 13/04/2017.
 */


var
    languages_array = require('../../data/languages.json'),
    ArrayUtils = require('../game/utils/arrayutils'),
    languages_map = [];
console.log (languages_map);

languages_array.forEach(function (element) {
    var
        length_num = element.label.length,
        cel_array = languages_map[length_num];
    if (!cel_array) {
        cel_array = languages_map[length_num] = [];
    }
    cel_array.push(element);
});
module.exports = {
    getRandomLanguageOfLength: function (length_num) {
        var
            possibleLanguages_array = languages_map[length_num];
        if (!possibleLanguages_array) {
            return null;
        }
        return ArrayUtils.getRandomCel(possibleLanguages_array);
    },
    getLanguageById: function (id_str) {
        return languages_array.filter(function (element) {
            return element.id === id_str;
        })[0];
    }
};
