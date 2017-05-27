/**
 * Created by Jean-Baptiste on 27/05/2017.
 */
var languages_array = require('../../../data/languages.json'),
    Labels = require('../../datatransform/labels'),
    Config = require('../gameobjects/config'),
    stage_el = Config('game').dom_el,
    SvgUtils = require('../../game/utils/svgutils'),
    dom_el = SvgUtils.createElement('svg'),
    COLS_NUM = 4,
    POSITION = {
        width: 100,
        height: 30
    },
    callBack_fun,
    usedLanguages_array = [],
    registerLanguage = function (languageId_str) {
        var button_el = (function () {
            var index_num;
            languages_array.forEach (function (element, index) {
                if (element.id === languageId_str) {
                    index_num = index;
                }
            });
            return dom_el.children[index_num];
        }());
        button_el.setAttribute('aria-disabled', true);
        button_el.setAttribute('tabindex', -1);
        Labels.fetchLanguages(languageId_str);
        usedLanguages_array.push(languageId_str);
    };

languages_array.forEach(function (element, index) {
    var button_str = element.label,
        col_num = index % COLS_NUM,
        line_num = Math.floor(index / COLS_NUM),
        button_el = SvgUtils.createElement('svg', {
            x: col_num * POSITION.width,
            y: line_num * POSITION.height
        }),
        button_text = SvgUtils.createElement('text', {
            y: 10,
            'font-size': '6px'
        }),
        bg_el = SvgUtils.createElement('rect', {
            fill:'yellow',
            width:POSITION.width,
            height:POSITION.height,
            'font-size': '6px'
        });

    button_text.textContent = button_str;
    button_el.setAttribute('class', 'button');
    button_el.appendChild(bg_el);
    button_el.appendChild(button_text);
    button_el.addEventListener('click', function () {
        registerLanguage(element.id);
        callBack_fun();
        dom_el.parentNode.removeChild(dom_el);
    });
    dom_el.setAttribute('class', 'languageChoice_popup');
    dom_el.appendChild(button_el);
});

module.exports = {
    display: function (p_callBack_fun) {
        callBack_fun = p_callBack_fun;
        stage_el.appendChild(dom_el);
    },
    registerLanguage: registerLanguage
};
