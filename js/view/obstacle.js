/**
 * Created by Jean-Baptiste on 25/02/2017.
 */
"use strict";
var Config = require('./config'),
    SvgUtils = require('../game/utils/svgutils'),
    stageConfig = Config('stage'),
    gridSize_num = stageConfig.gridSize,
    obstacles_array = [];
module.exports = {
    get obstacles () {
      return obstacles_array;
    },
    add: function () {
        var
            config = JSON.parse(JSON.stringify(Config('obstacle'))),
            dom_el;
        config.position.x = Math.floor(Math.random() * (stageConfig.position.width / gridSize_num)) * gridSize_num;
        config.position.y = Math.floor(Math.random() * (stageConfig.position.height / gridSize_num)) * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('rect', {
            width: 10,
            height: 10,
            fill: 'red',
            x: config.position.x,
            y: config.position.y
        });
        obstacles_array.push (config);
        stageConfig.dom_el.appendChild(dom_el);
    }
};
