/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    LIFES_NUM = 5,
    lives_num = LIFES_NUM,
    updateView = function (lives_num) {

        var display_text = document.getElementById('lives'),
            livesEl_array = document.getElementsByClassName('liveIcon'),
            n;
        console.log(livesEl_array);
        for (n = 0; n < livesEl_array.length; n++) {
            var el = livesEl_array[n];
            console.log('n : ', livesEl_array[n]);
            if (n < lives_num) {
                el.setAttribute('display', 'inline');
            } else {
                el.setAttribute('display', 'none');
            }
        }
        display_text.textContent = "lives : " + lives_num;
    };
updateView(LIFES_NUM);
module.exports = {
    decrement: function () {
        updateView(--lives_num);
        if (lives_num === 0) {
            onLivesLost_fun();
        }
    },
    increment: function () {
        updateView(++lives_num);
    },
    set onLivesLost(fun) {
        onLivesLost_fun = fun;
    },
    reset: function () {
        lives_num = LIVES_NUM;
        updateView(lives_num);
    }
};


