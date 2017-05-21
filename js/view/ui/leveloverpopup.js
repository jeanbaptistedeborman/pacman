/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = require('../../datatransform/labels'),
    Config = require ('../gameobjects/config'),
    stage_el = Config('game').dom_el,
    SvgUtils = require ('../../game/utils/svgutils'),
    callback_fun,



    popup_el = document.getElementsByClassName('levelPopup')[0],
        closePopup = function () {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
    },
    textBlock,
    open_bool = false;
    popup_el.parentNode.removeChild(popup_el);


module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;


    if (!open_bool) {
        var
        continueButton_el = popup_el.getElementsByClassName('goButton')[0];
        stage_el.appendChild(popup_el);
        if (!textBlock) {
            textBlock = SvgUtils.getMultilineText(popup_el, Labels.getLabel('nextlevel'),
                {   x:125,
                    y:132,
                    'text-anchor':'middle',
                    width:80,
                    lineHeight: 9,
                    'font-size': '7px'
                }
            )
        }

        SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        open_bool = true;

        continueButton_el.addEventListener('click', closePopup);
    }
};


