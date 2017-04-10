/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var
    fake_array = String("A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z,A,B,C,D,E,F,G,H,I,J,K,L,M,O,P,Q,R,S,T,U,V,W,X,Y,Z").split(','),
    Config = require('../config'),
    ItemList = require('../itemlist'),
    SvgUtils = require('../../../game/utils/svgutils'),
    stageConfig = Config('stage'),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    items_array = ItemList[ID_STR] = [];
module.exports = {
    get itemList() {
        return items_array;
    },
    add: function (rect) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el;

        config.brick_array = [];
        config.position.x = rect.x * gridSize_num;
        config.position.y = rect.y * gridSize_num;
        config.position.width = rect.width * gridSize_num;
        config.position.height = rect.height * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('g');

        var directionProp_str = rect.width > rect.height ? 'width' : 'height';
        for (var n = 0; n < rect[directionProp_str]; n++) {

            var text_el = SvgUtils.createElement('text',
                {
                    width: gridSize_num,
                    height: gridSize_num,
                    fill: 'black',
                    "font-family": "Arial narrow",
                    "font-size": "10.5",
                    "alignment-baseline": "hanging",
                    x: 1 + config.position.x + n * gridSize_num * Number(directionProp_str === 'width'),
                    y: 1 + config.position.y + n * gridSize_num * Number(directionProp_str === 'height')
                }
                ),
                text_node = document.createTextNode(fake_array.shift());

            text_el.appendChild(text_node);

            var brick_el = SvgUtils.createElement('rect', {
                width: gridSize_num,
                height: gridSize_num,
                fill: 'red',
                x: config.position.x + n * gridSize_num * Number(directionProp_str === 'width'),
                y: config.position.y + n * gridSize_num * Number(directionProp_str === 'height')
            });
            dom_el.appendChild(brick_el);
            dom_el.appendChild(text_el);
            config.brick_array.push (
            {
                brick_el:brick_el,
                text_el:text_el
            });
        }
        config.openDoor = function (openOrLock_bool) {
            var openOrLock_bool = Math.random() > .5;
            config.brick_array.forEach(function (brick_obj) {
                if (openOrLock_bool) {
                    brick_obj.brick_el.setAttribute('fill', 'white');
                } else {
                    brick_obj.brick_el.setAttribute('fill', 'black');
                }
            });
        }
        ;


        items_array.push(config);
        stageConfig.dom_el.appendChild(dom_el);
    }
}
;
