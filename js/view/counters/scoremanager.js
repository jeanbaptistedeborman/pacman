/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description This component manages the display of the score of the user
 */

var

    score_num = 0,
    display = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = score_num;
    };
    display (0);

module.exports = {
    /**
     * The score of the player
     * @readonly
     * @type number
     *
     */
    get score() {
        return score_num;
    },
    /**
     * Resets the score to 0
     *
     */
    reset: function () {
        score_num = 0;
        display (score_num);
    },
    /**
     * Add points to the score
      * @param {Number} num - The number of points to add.
     */
    add:function (num) {
       score_num += num;
       display (score_num);
    },
    /**
     * Adds 1 point to the score.
     */
    increment: function () {
        display(++score_num);
    }
};

