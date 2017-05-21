/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = require('../../datatransform/labels'),
    Config = require('../gameobjects/config'),
    ScoreManager = require('../counters/scoremanager'),

    SvgUtils = require('../../game/utils/svgutils'),
    stage_el = Config('game').dom_el,
    callback_fun,
    yesYouDidiIt_block,
    yourScore_block,
    playAgain_block,
    popup_el = document.getElementsByClassName('endScreen')[0],
    closePopup = function () {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
    },
    open_bool = false;

popup_el.removeAttribute('style');
popup_el.parentNode.removeChild(popup_el);

module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;

    if (!open_bool) {
        if (yourScore_block) {
            popup_el.removeChild(yourScore_block);
        }
        stage_el.appendChild(popup_el);
        yourScore_block = SvgUtils.getMultilineText(popup_el, 'Missing Your score is:' + ScoreManager.score + " Missing text",
            {
                x: 150,
                y: 144,
                color: '#ffffff',
                'text-anchor': 'left',
                width: 50,
                lineHeight: 6,
                'font-size': '6px'
            });

        if (!playAgain_block) {
            playAgain_block = SvgUtils.getMultilineText(popup_el, "missing text", {
                    x: 174,
                    y: 176, color: '#ffffff',
                    'text-anchor': 'left',
                    width: 20,
                    lineHeight: 6,
                    'font-size': '5px'
                }
            )
        }
        if (!yesYouDidiIt_block) {
            yesYouDidiIt_block = SvgUtils.getMultilineText(popup_el, "missing text missing text", {
                    x: 150,
                    y: 111,
                    color: 'black',
                    'text-anchor': 'left',
                    width: 80,
                    'font-weight':'bold',
                    'stroke':'white',
                     'stroke-width':0.3,
                    lineHeight: 12,
                    'font-size': '12px'
                }
            )
        }

        continueButton_el = popup_el.getElementsByClassName('playAgain')[0];
        open_bool = true;

        SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        continueButton_el.addEventListener('click', closePopup);
    }
}
;


