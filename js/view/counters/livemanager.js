/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description This component keeps track and displays the reamining lives of the player.
 *
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
    /**
     * Removes 1 life and updates the display. Calls onLivesLost callback when 0 is reached.
     *
     */
    decrement: function () {
        display(--lives_num);
        if (lives_num === 0) {
            onLivesLost_fun();
        }
    },
    /**
     * Adds 1 life and updates the display.
     */
    increment: function () {
        if (lives_num < LIVES_NUM) {
        display(++lives_num);
        }
    },
    /**
     * @type function
     * @description Sets the callback called when the counter reaches 0. (write-only).
     */
    set onLivesLost(fun) {
        onLivesLost_fun = fun;
    },
    /**
     * @type Number
     * @readonly
     * @description The maximum available lives.
     */
    get maxLives () {
      return LIVES_NUM;
    },
    /**
     * @type Number
     * @readonly
     * @description The number of remaining lives.
     */
    get lives (){
      return lives_num;
    },
    /**
     * Resets lives to the maximum value. Updates the display.
     */
    reset: function () {
        lives_num = LIVES_NUM;
        display(lives_num);
    }
};


