/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
Module.exports = function () {
    var
        display_el = document.querySelector('.whq_score .value'),
        updateDisplay = function (score_num) {
            display_el.innerText = score_num + ' / ' + totalQuestions_num;
        },
        score_num = 0;
    updateDisplay(score_num);
    return {
        get score() {
            return score_num;
        },
        increment: function () {
            score_num += 1;
            updateDisplay(score_num);
            animation.applyEffect(display_el, 'fadeIn');
            window.setTimeout(function () {
                if (score_num === totalQuestions_num) {
                    endOfGame.userWins();
                } else {
                    initQuestion();
                }
            }, 500);
        }
    }
};