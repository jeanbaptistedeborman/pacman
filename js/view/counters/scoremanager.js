/**
 * Created by Jean-Baptiste on 11/04/2017.
 */

var

    score_num = 0,
    display = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = score_num;
    };
    display (0);

module.exports = {
    get score() {
        return score_num;
    },
    reset: function () {
        score_num = 0;
        display (score_num);
    },
    add:function (num) {
       score_num += num;
       display (score_num);
    },
    increment: function () {
        display(++score_num);
    }
};

