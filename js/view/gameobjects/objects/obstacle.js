/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var
    Config = require('../config'),
    ObjectListManager = require('../objectlistmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    TimeoutManager = require('../../../game/utils/timeoutmanager'),
    stageConfig = Config('stage'),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    Languages = require('../../../datatransform/languages'),
    fake_array = String("A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z").split(','),
    items_array = ObjectListManager.createList(ID_STR);

module.exports = {
    get itemList() {
        return items_array;
    },
    add: function (rect) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el,
            length_num,
            language_obj,
            string_array;
        config.direction = rect.width > rect.height ? 'width' : 'height';
        config.position.x = rect.x * gridSize_num;
        config.position.y = rect.y * gridSize_num;
        config.position.width = rect.width * gridSize_num;
        config.position.height = rect.height * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('g');
        length_num = rect[config.direction];

        language_obj = Languages.getRandomLanguageOfLength(length_num);
        if (language_obj) {
            config.language = language_obj.id;
            string_array = language_obj.label.split('');
        }

        for (var n = 0; n < rect[config.direction]; n++) {

            var brick_el = SvgUtils.createElement('rect', {
                width: gridSize_num,
                height: gridSize_num,
                fill: 'red',
                x: config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                y: config.position.y + n * gridSize_num * Number(config.direction === 'height')
            });
            dom_el.appendChild(brick_el);
            if (string_array) {
                var
                    textHeight_num = 9,
                    text_el = SvgUtils.createElement('text',
                        {
                            width: gridSize_num,
                            height: gridSize_num,
                            fill: 'black',
                            "font-family": "Arial narrow",
                            "font-size": "10.5",
                            x: 1 + config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                            y: textHeight_num + config.position.y + n * gridSize_num * Number(config.direction === 'height')
                        }
                    ),
                    text_node = document.createTextNode(string_array.shift());

                text_el.appendChild(text_node);
                dom_el.appendChild(text_el);
            }


            config.brick_array.push(
                {
                    brick_el: brick_el,
                    text_el: text_el
                });
        }
        config.openDoor = function (openOrLock_bool) {
            if (!config.blocked) {
                if (openOrLock_bool) {
                    ObjectListManager.removeItem(ID_STR, config);
                } else {
                    config.blocked = true;
                }
                config.brick_array.forEach(function (brick_obj, index) {
                    TimeoutManager.set(function () {
                        if (openOrLock_bool) {
                            brick_obj.brick_el.setAttribute('fill', 'white');
                        } else {
                            brick_obj.brick_el.setAttribute('fill', 'black');
                        }
                    }, 100 + (100 * index));
                });
            }
        }
        ;

        ObjectListManager.pushItem(ID_STR, config);
        items_array.push(config);
        stageConfig.dom_el.appendChild(dom_el);
    }
}
;
