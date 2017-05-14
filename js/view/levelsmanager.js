/**
 * Created by Jean-Baptiste on 14/05/2017.
 */
var
    levels_array = require('../../data/levels/levels.json'),
    ArrayUtils = require('../game/utils/arrayutils'),
    randomLevels_array,
    setRandomArray = function () {
        randomLevels_array = levels_array.slice(2);
    },

    getRandomCel = function () {
        if (randomLevels_array.length === 0) {
            setRandomArray();
        }
        return ArrayUtils.getRandomCel(randomLevels_array, true);
    };
setRandomArray();

module.exports = {
    get remaining() {
        return randomLevels_array.length;
    },
    get: function (level_num) {
        if (level_num < 2) {
            return levels_array [level_num];
        } else {
            return getRandomCel();
        }
    }
};
