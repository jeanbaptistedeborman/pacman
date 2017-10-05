/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description Displays the screen ate the end of the game.
 * @param {function} p_callback_fun -The function called when the user closes the screen
 *
 */
var
    Labels = require('../../datatransform/labels'),
    Config = require('../gameobjects/config'),
    ScoreManager = require('../counters/scoremanager'),
    SvgUtils = require('../../game/utils/svgutils'),
    Animation = require('../../game/utils/animation'),
    stage_el = Config('game').dom_el,
    TEXT_MARGIN_NUM = 150,
    callback_fun,
    yesYouDidiIt_block,
    yourScore_block,
    yourRank_block,
    playAgain_block,
    saveScore_block,
    popup_el = document.querySelector('.endScreen'),
    closePopup = function () {
        continueButton_el.removeEventListener('click', closePopup);
        continueButton_el.removeEventListener('touchstart', closePopup);
        saveButton_el.removeEventListener('click', sendScore);
        saveButton_el.removeEventListener('touchstart', sendScore);
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
    },
    sendScore = function () {
        ScoreManager.promptScore(ScoreManager.score, function(){
            closePopup();
        }, function() {
            closePopup();
        }, function() {
            //callback cancel. Do nothing...
        })
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
        if (yourRank_block) {
            popup_el.removeChild(yourRank_block);
        }
        Animation.fadeIn (popup_el);
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

            var baseFormat_rank =
                    {
                        x: TEXT_MARGIN_NUM ,
                        y: 176,
                        fill: '#ffffff',
                        'text-anchor': 'left',
                        'font-size': '6px'
                    },
                yourRank_str = Labels.getLabel('your_rank'),
                yourRank_array = yourRank_str.split('XXX'),
                thirdLine_text = SvgUtils.createElement("text", baseFormat_rank),
                suffix_rank_tspan = SvgUtils.createElement("tspan"),
                middlefix_rank_tspan = SvgUtils.createElement("tspan"),
                prefix_rank_tspan = SvgUtils.createElement("tspan"),
                rank_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                }),
                overall_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                });

            yourScore_block = SvgUtils.createElement('g');
            score_tspan.textContent = ScoreManager.score;
            suffix_tspan.textContent = yourScore_array[1];


            ScoreManager.getRank(ScoreManager.score, function(ret, tot){
                yourRank_block = SvgUtils.createElement('g');
                rank_tspan.textContent = ret;
                overall_tspan.textContent = tot;
                prefix_rank_tspan.textContent = yourRank_array[0];
                middlefix_rank_tspan.textContent = yourRank_array[1];
                suffix_rank_tspan.textContent = yourRank_array[2];
                thirdLine_text.setAttribute('dy', lineHeight_num);
                thirdLine_text.appendChild(prefix_rank_tspan);
                thirdLine_text.appendChild(rank_tspan);
                thirdLine_text.appendChild(middlefix_rank_tspan);
                thirdLine_text.appendChild(overall_tspan);
                thirdLine_text.appendChild(suffix_rank_tspan);
                yourRank_block.appendChild(thirdLine_text);
                popup_el.appendChild(yourRank_block);
            },
            function(){
                console.error("Error retrieving your rank");
            });

            secondLine_text.setAttribute('dy', lineHeight_num);
            firstLine_text.textContent = yourScore_array[0];
            secondLine_text.appendChild(score_tspan);
            secondLine_text.appendChild(suffix_tspan);
            yourScore_block.appendChild(firstLine_text);
            yourScore_block.appendChild(secondLine_text);
            popup_el.appendChild(yourScore_block);

    

        }());

        if (!saveScore_block) {
            saveScore_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel("save_score"),
                {
                    x: TEXT_MARGIN_NUM + 24,
                    y: 216 , color: '#ffffff',
                    'text-anchor': 'left',
                    width: 20,
                    lineHeight: 6,
                    'font-size': '5px'
                })
        }
        if (!playAgain_block) {
            playAgain_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel("play_again"),
                {
                    x: TEXT_MARGIN_NUM + 24,
                    y: 196, color: '#ffffff',
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
                    'font-weight': '800',
                    'stroke': 'white',
                    'stroke-width': 0.001,
                    lineHeight: 12,
                    'font-size': '12px'
                }
            )
        }
        continueButton_el = popup_el.querySelector('.playAgain');
        saveButton_el = popup_el.querySelector('.sendScore');
        open_bool = true;
        SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        SvgUtils.simulateEnterClick(saveButton_el, sendScore);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
        saveButton_el.addEventListener('click', sendScore);
        saveButton_el.addEventListener('touchstart', sendScore);
    }
}
;


