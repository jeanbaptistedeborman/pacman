/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = require('../../datatransform/labels'),
    Config = require('../gameobjects/config'),
    stage_el = Config('game').dom_el,
    SvgUtils = require('../../game/utils/svgutils'),
    Animation = require('../../game/utils/animation'),
    callback_fun,
    continueButton_el,
    removeEnterClick_fun,
    popup_el = document.getElementsByClassName('levelPopup')[0],
    closePopup = function () {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
        continueButton_el.removeEventListener('click', closePopup);
        continueButton_el.removeEventListener('touchstart', closePopup);
        document.body.removeEventListener('keydown',listenKey);
    },
    listenKey = function (evt) {
        if (evt.key === "Enter") {
            closePopup();
        }
    },
    textBlock,
    open_bool = false;
popup_el.removeAttribute('style');
popup_el.parentNode.removeChild(popup_el);


module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;
    if (!open_bool) {
        Animation.fadeIn (popup_el);
        continueButton_el = popup_el.querySelector('.goButton');
        stage_el.appendChild(popup_el);
        if (!textBlock) {
            textBlock = SvgUtils.getMultilineText(popup_el, Labels.getLabel('nice_work'),
                {
                    x: 125,
                    y: 132,
                    'text-anchor': 'middle',
                    width: 80,
                    lineHeight: 9,
                    'font-size': '7px'
                }
            )
        }
        open_bool = true;
        removeEnterClick_fun =  SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
        document.body.addEventListener('keydown',listenKey);
    }
};


