/**
 * Created by Jean-Baptiste on 25/02/2017.
 * @module
 * @description The goodies (scores and bonus lives) appearing in the game.
 */
"use strict";
var
    Config = require('../config'),
    stageConfig = Config('stage'),
    ObjectListManager = require('../objectlistmanager'),
    SvgUtils = require('../../../game/utils/svgutils'),
    LiveManager = require('../../counters/livemanager'),
    ScoreManager = require('../../counters/scoremanager'),
    playSound = require('../../../game/utils/playsound'),
    CollisionManager = require('../collisionmanager'),
    layer_g = SvgUtils.createElement('g'),
    onCollected_fun,
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'goodie',
    parent_el = layer_g,
    items_array = ObjectListManager.createList(ID_STR),
    add = function (point) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            bonusLive_bool = Math.random() < (LiveManager.maxLives - LiveManager.lives)/70,
            dom_el;
        config.position = point;
        config.position.width = gridSize_num;
        config.position.height = gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('use', {
                width: 10,
                height: 10,
                x: config.position.x,
                y: config.position.y
            },
            [
                {
                    nameSpace: "http://www.w3.org/1999/xlink",
                    name: "href",
                    value: bonusLive_bool ? "#earth" : "#goodie"
                }]
        );
        config.remove = function () {
            parent_el.removeChild(dom_el);
            items_array = ObjectListManager.disableItemFromList(ID_STR, config);
               playSound('bon_2');
            if (!bonusLive_bool) {
                ScoreManager.increment();

            } else {
                LiveManager.increment();
            }

            if (items_array.length === 0 && onCollected_fun) {
                onCollected_fun();
            }
            return items_array.length;
        };
        items_array.push(config);
        parent_el.appendChild(dom_el);
    };

stageConfig.dom_el.appendChild(layer_g);

module.exports = {
    /**
     * @type Function
     * @writeonly
     * @description Sets the callback called when all goodies are collected
     */
    set onCollected(fun) {
        onCollected_fun = fun;
    },
    /**
     * @type Array
     * @readonly
     * @description The list of goodies on the screen
     */
    get itemList() {
        return items_array;
    },
    /**
     * Add all the goodies on the stage on a grid of 6 by 6, if the square is not occupied by another object (wall, ...).
     */
    addAll: function () {
        var line_num,
            column_num,
            lineTotal_num = stageConfig.linesNum,
            colTotal_num = stageConfig.columnsNum;
        for (column_num = 0; column_num < colTotal_num; column_num++) {
            for (line_num = 0; line_num < lineTotal_num; line_num++) {
                if (line_num % 6 === 0 && column_num % 6 === 0) {
                    var position_point = {
                        x: column_num * gridSize_num,
                        y: line_num * gridSize_num
                    };
                    if (!CollisionManager.isOccupied(position_point)) {
                        add(position_point);
                    }
                }

            }
        }
    }
};
