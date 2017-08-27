/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description -A component displaying the number of levels the user has gone through
 *
 */

"use strict";

var

    display = function (level_num) {
        var
            text_text = document.getElementById('level');
        text_text.textContent = level_num;
    };
module.exports = {
    /**
     *
     * @param {number} num - The level to display
     */
    set: function (num) {
        display(num);
    }
};


