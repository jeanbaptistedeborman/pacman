/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
var Configs = require('./config'),
    SvgUtils = require('../game/utils/svgutils'),
    MovingObject = require('./movingobject'),
    badGuys_array = [];

module.exports = {
    add: function () {
        var
            config = JSON.parse(JSON.stringify(Configs('badGuy'))),
            stageConfig = Configs('stage');

        config.position.x = 200 + Math.floor(Math.random() * 100 / stageConfig.gridSize) * stageConfig.gridSize;
        config.position.y = 200 + Math.floor(Math.random() * 100 / stageConfig.gridSize) * stageConfig.gridSize;
        config.dom_el = SvgUtils.createElement('rect',
            {
                x: config.position.x,
                y: config.position.y,
                width:10,
                height:10,
                fill:'black'

            });
        stageConfig.dom_el.appendChild(config.dom_el);
        var badGuy_obj = MovingObject.add(config);
        badGuys_array.push (badGuy_obj);

    }
};
