/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    score_num = 0,
    updateView = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = "score : " + score_num;
    };
    updateView ();

module.exports = {
    get score() {
        return score_num;
    },
    reset: function () {
        score_num = 0;
        updateView (score_num);
    },
    increment: function () {
        updateView(++score_num);
    }
};

