
var languages_array = require('../../../data/languages.json'),
    Labels = require('../../datatransform/labels'),
    Config = require('../gameobjects/config'),
    stage_el = Config('game').dom_el,
    SvgUtils = require('../../game/utils/svgutils'),
    XLINK_STR = "http://www.w3.org/1999/xlink",
    dom_el = SvgUtils.createElement('svg'),
    COLS_NUM = 4,
    MARGIN_BUTTONS = {
        top: 107.5,
        left: 21.3
    },
    POSITION = {
        width: 79.756,
        height: 22.71
    },
    callBack_fun,
    usedLanguages_array = [],
    logoContainer_el = SvgUtils.createElement('svg',{
        x:20.63,
        y:40
    }),
    explanationTextBlock_el,
    logo_el = SvgUtils.createElement('use', {
            width: "132.996",
            height: "35.583",
            x: "0",
            y: "-35.583",
            transform: "scale (1,-1)",
            overflow: "visible"
        },
        [
            {
                nameSpace: XLINK_STR,
                name: "href",
                value: "#linguagoLogo"
            }]),
    registerLanguage = function (languageId_str) {
        var button_el = (function () {
            var index_num;
            languages_array.forEach(function (element, index) {
                if (element.id === languageId_str) {
                    index_num = index;
                }
            });
            return dom_el.childNodes[index_num];
        }());
        button_el.setAttribute('aria-disabled', true);
        button_el.setAttribute('tabindex', -1);
        Labels.fetchLanguages(languageId_str);
        usedLanguages_array.push(languageId_str);
    };
dom_el.appendChild(logoContainer_el);
logoContainer_el.appendChild(logo_el);




languages_array.forEach(function (element, index) {
    var button_str = element.label,
        col_num = index % COLS_NUM,
        line_num = Math.floor(index / COLS_NUM),
        button_el = SvgUtils.createElement('svg', {
            x: MARGIN_BUTTONS.left + col_num * POSITION.width,
            y: MARGIN_BUTTONS.top + line_num * POSITION.height
        }),
        button_text = SvgUtils.createElement('text', {
            y: 7,
            x: 12.5,
            fill: 'white',
            'font-size': '5px'
        }),
        bg_el = SvgUtils.createElement('use', {
                width: 50,
                height: 11,
                class: 'background'
            },
            [
                {
                    nameSpace: XLINK_STR,
                    name: "href",
                    value: "#lgButton"
                }
            ]);

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
        if (!explanationTextBlock_el) {
            explanationTextBlock_el =  SvgUtils.getMultilineText(
                dom_el,
       Labels.getLabel("choose_another_language"),
                {
                    width:100,
                    x:179.6,
                    y:48.3,
                    lineHeight:8,
                    'font-size':'7.09px',
                    color:'white'
                }
            );
        }

    },
    registerLanguage: registerLanguage
};
