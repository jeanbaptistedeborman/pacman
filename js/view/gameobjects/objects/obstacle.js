/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var
    Config = require('../config'),
    stageConfig = Config('stage'),
    ObjectListManager = require('../objectlistmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    ColorUtils = require('../../../game/utils/colorutils'),
    TimeoutManager = require('../../../game/utils/timeoutmanager'),
    ArrayUtils = require('../../../game/utils/arrayutils'),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    layer_g = SvgUtils.createElement('g'),
    playSound = require('../../../game/utils/playsound'),
    Languages = require('../../../datatransform/languages'),
    COLORS_ARRAY = ['#170c59', '#752995', '#ff5a19', '#006830'],
    items_array = ObjectListManager.createList(ID_STR);

stageConfig.dom_el.appendChild (layer_g);

module.exports = {
    get itemList() {
        return items_array;
    },
    add: function (rect) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el,
            blocks_num,
            language_obj,
            color_hex = ArrayUtils.getRandomCel(COLORS_ARRAY),
            string_array,
            shades_array = [],
            n;

        config.direction = rect.width > rect.height ? 'width' : 'height';
        config.position.x = rect.x * gridSize_num;
        config.position.y = rect.y * gridSize_num;
        config.position.width = rect.width * gridSize_num;
        config.position.height = rect.height * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('g');


        blocks_num = rect[config.direction];

        language_obj = Languages.getRandomLanguageOfLength(blocks_num);
        if (language_obj) {
            config.language = language_obj.id;
            string_array = language_obj.label.split('');
        } else {
            config.blocked = true;
        }
        for (n = 0; n < blocks_num; n++) {
            var baseShade_num = 1;
            if (blocks_num < 5) {
                baseShade_num = 1.5;
            }
            shades_array.push(baseShade_num + (0.15 * n));
        }
        if (Math.random() > .5) {
            shades_array.reverse();
        }
        for (n = 0; n < blocks_num; n++) {
            (function () {
                var brick_el = SvgUtils.createElement('rect', {
                    width: gridSize_num,
                    height: gridSize_num,
                    fill: ColorUtils.multiply(color_hex, shades_array[n]),
                    x: config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                    y: config.position.y + n * gridSize_num * Number(config.direction === 'height')
                });
                if (string_array) {
                    var
                        textHeight_num = 9,
                        text_el = SvgUtils.createElement('text',
                            {
                                width: gridSize_num,
                                height: gridSize_num,
                                'text-anchor':'middle',
                                fill: 'white',
                                "font-family": "Arial narrow",
                                "font-size": "9",
                                x: gridSize_num/2 + config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                                y: textHeight_num-0.7 + config.position.y + n * gridSize_num * Number(config.direction === 'height')
                            }
                        ),
                        text_node = document.createTextNode(string_array.shift().toUpperCase());
                    text_el.appendChild(text_node);

                }
                config.brick_array.push(
                    {
                        brick_el: brick_el,
                        text_el: text_el
                    });
                TimeoutManager.set(function () {
                    dom_el.appendChild(brick_el);
                    if (string_array) {
                        dom_el.appendChild(text_el);
                    }
                }, 1 + 50 * n);
            }());
        }
        config.openDoor = function (openOrLock_bool) {
            if (!config.blocked) {
                if (openOrLock_bool) {
                    ObjectListManager.disableItemFromList(ID_STR, config);
                } else {
                    config.blocked = true;
                }
                config.brick_array.forEach(function (brick_obj, index) {
                    TimeoutManager.set(function () {
                        if (openOrLock_bool) {

                            brick_obj.brick_el.setAttribute('fill', 'rgba(255,255,255,0.2)');
                            brick_obj.text_el.setAttribute('fill', 'rgba(255,255,255,0.2)');

                        } else {
                            playSound('mauvais_2', true);
                            brick_obj.brick_el.setAttribute('fill', '#c5c5c5');
                        }
                    }, 50 + (100 * index));
                });
                if (openOrLock_bool) {
                    playSound('bon_1');
                    TimeoutManager.set(function () {
                        playSound(config.language);
                    }, 100 * (config.brick_array.length - 1));
                }
            }
        };

        ObjectListManager.pushItem(ID_STR, config);
        items_array.push(config);
        layer_g.appendChild(dom_el);
    }
}
;
