/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = require('../../datatransform/labels'),
    stage_el = document.body,
    callback_fun,
    popup_el,
    closePopup = function () {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
    },
    open_bool = false;

module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;
    if (!open_bool) {
        var
            button_textNode = document.createTextNode('Play again'),
            title_textNode = document.createTextNode("Game over"),
            title_el = document.createElement('h2');
        continueButton_el = document.createElement('button');
        title_el.appendChild(title_textNode);
        popup_el = document.createElement('div');
        open_bool = true;
        stage_el.appendChild(popup_el);
        continueButton_el.appendChild(button_textNode);
        popup_el.appendChild(title_el);
        popup_el.appendChild(continueButton_el);
        continueButton_el.addEventListener('click', closePopup);
        popup_el.setAttribute('class', 'gameover_popup');
    }
};


