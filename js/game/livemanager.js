/**
 * Created by Jean-Baptiste on 11/04/2017.
 */

Module.exports = function () {
    var
        LIFES_NUM = 3,
        display_el = document.querySelector('.whq_lives .value'),
        updateDisplay = function (value_str) {
            display_el.innerText = value_str;
        },
        counter = Counter(LIFES_NUM,
            function () {
                enableInputs(false);
                window.setTimeout(endOfGame.userLoses, 800);
            });
    updateDisplay(LIFES_NUM);
    return {
        decrement: function () {
            updateDisplay(counter.decrement());
            animation.applyEffect(display_el, 'fadeIn');
        }
    }
};

