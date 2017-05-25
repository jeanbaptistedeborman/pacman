/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = require('../../datatransform/labels'),
    Config = require('../gameobjects/config'),
    ScoreManager = require('../counters/scoremanager'),
    SvgUtils = require('../../game/utils/svgutils'),
    stage_el = Config('game').dom_el,
    TEXT_MARGIN_NUM = 150,
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
        (function setYourScore() {
            var
                lineHeight_num = 8,
                baseFormat_obj =
                    {
                        x: TEXT_MARGIN_NUM ,
                        y: 160,
                        fill: '#ffffff',
                        'text-anchor': 'left',
                        'font-size': '6px'
                    },
                yourScore_str = Labels.getLabel('you_scored'),
                yourScore_array = yourScore_str.split('XXX'),
                    firstLine_text = SvgUtils.createElement("text", baseFormat_obj),
                secondLine_text = SvgUtils.createElement("text", baseFormat_obj),
                suffix_tspan = SvgUtils.createElement("tspan"),
                score_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                });
            yourScore_block = SvgUtils.createElement('g');
            score_tspan.textContent = ScoreManager.score;
            suffix_tspan.textContent = yourScore_array[1];

            secondLine_text.setAttribute('dy', lineHeight_num);
            firstLine_text.textContent = yourScore_array[0];
            secondLine_text.appendChild(score_tspan);
            secondLine_text.appendChild(suffix_tspan);
            yourScore_block.appendChild(firstLine_text);
            yourScore_block.appendChild(secondLine_text);
            popup_el.appendChild(yourScore_block);
        }());


        if (!playAgain_block) {
            playAgain_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel("play_again"),
                {
                    x: TEXT_MARGIN_NUM + 22,
                    y: 176, color: '#ffffff',
                    'text-anchor': 'left',
                    width: 20,
                    lineHeight: 6,
                    'font-size': '5px'
                })
        }
        if (!yesYouDidiIt_block) {
            yesYouDidiIt_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel('you_did_it'), {
                    x: TEXT_MARGIN_NUM ,
                    y: 111,
                    'forceLineBreakChar': '!',
                    color: 'black',
                    'text-anchor': 'left',
                    width: 80,
                    'font-weight': 'bold',
                    'stroke': 'white',
                    'stroke-width': 0.3,
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


