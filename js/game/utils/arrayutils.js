/**
 * Created by Jean-Baptiste on 12/03/2017.
 */
var
    getRandomCel = function (array, remove_bool) {
    var celIndex_num = Math.floor(Math.random() * array.length);
    if (!remove_bool) {
        return array[celIndex_num];
    } else {
        return array.splice(celIndex_num, 1)[0];
    }
},
    clone = function (array) {
    var new_array = [];
    array.forEach(function (element, index) {
        new_array.push(element);
    });
    return new_array;
};

module.exports = {
    clone: clone,
    getRandomCel: getRandomCel,
    remove: function (array, item) {
        result_array = array.filter(function (element) {
            return element !== item;
        });
        return result_array;
    },
    shuffle: function (array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    convertObjectToArray: function (obj) {
        var result_array = [];
        for (var n in obj) {
            result_array.push(
                {
                    "id": n,
                    "value": obj[n]
                }
            )
        }
        return result_array;
    },
    pickRandomItems: function (source_array, items_num) {
        var result_array = [];
        source_array = clone(source_array);
        for (var n = 0; n < items_num; n++) {
            result_array.push(getRandomCel(source_array, true));
        }

        return result_array;
    }
};