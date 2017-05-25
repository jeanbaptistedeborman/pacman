/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    LIVES_NUM = 5,
    lives_num = LIVES_NUM,
    display = function (lives_num) {
        var
            livesEl_array = document.getElementsByClassName('liveIcon'),
            n;
        for (n = 0; n < livesEl_array.length; n++) {
            var el = livesEl_array[n];
            if (n < lives_num) {
                el.setAttribute('display', 'inline');
            } else {
                el.setAttribute('display', 'none');
            }
        }
    };
display(LIVES_NUM);
module.exports = {
    decrement: function () {
        display(--lives_num);
        if (lives_num === 0) {
            onLivesLost_fun();
        }
    },
    increment: function () {
        display(++lives_num);
    },
    set onLivesLost(fun) {
        onLivesLost_fun = fun;
    },
    reset: function () {
        lives_num = LIVES_NUM;
        display(lives_num);
    }
};


