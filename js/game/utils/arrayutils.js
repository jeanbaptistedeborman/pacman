/**
 * Created by Jean-Baptiste on 12/03/2017.
 * @module
 * @description A bunch of utility functions used to modify arrays.
 *
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
    /**
     * Creates a flat copy of an array
     * @method
     * @param {array} array -The source array.
     * @return {array} -The copy
     */

    clone: clone,

    /**
     * Removes an element from an array
     * @method
     * @param {array} array -The source array.
     * @param {*} item The object to find and remove
     * @return {array} - A copy of the array without the elememnt given as attribute.
     */

    remove: function (array, item) {
        result_array = array.filter(function (element) {
            return element !== item;
        });
        return result_array;
    },

    /**
     * Randomly sets the order of the cells of an array
     * @param {array} array -The source array.
     * @return {array} - The shuffled array
     */

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

    /**
     * Converts the properties of an object into an array of value pairs with format {id:propertyName, value:propertyValue}.
     * @param {Object} obj -The source Object.
     * @return {Array<Object>} - The resulting array.
     */

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

    /**
     * Gets a random cel of an array
     * @method
     * @param {array} array -The source array.
     * @param {Boolean} remove_bool -Wether or not the selected cel should be removed from the source array.
     * @return {*} -The content of the cel.
     */

    getRandomCel: getRandomCel,

    /**
     *  Picks random items into an array.
     * @param source_array - The source array
     * @param items_num - The number of random items to get from the array
     * @returns {Array} The resulting selection
     */
    pickRandomItems: function (source_array, items_num) {
        var result_array = [];
        source_array = clone(source_array);
        for (var n = 0; n < items_num; n++) {
            result_array.push(getRandomCel(source_array, true));
        }
        return result_array;
    }
};