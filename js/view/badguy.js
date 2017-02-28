/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
var Configs = require('./config'),
    SvgUtils = require('../game/utils/svgutils'),
    MovingObject = require('./movingobject'),
    ID_STR = 'badGuy',
    ItemList = require('./itemlist'),
    items_array = ItemList[ID_STR] = [];

module.exports = {
    itemList: items_array,
    add: function () {
        var
            config = JSON.parse(JSON.stringify(Configs(ID_STR))),
            stageConfig = Configs('stage');

        config.position.x = 200 + Math.floor(Math.random() * 100 / stageConfig.gridSize) * stageConfig.gridSize;
        config.position.y = 200 + Math.floor(Math.random() * 100 / stageConfig.gridSize) * stageConfig.gridSize;
        config.dom_el = SvgUtils.createElement('rect',
            {
                x: config.position.x,
                y: config.position.y,
                width: 10,
                height: 10,
                fill: 'black'

            });
        stageConfig.dom_el.appendChild(config.dom_el);
        var badGuy_obj = MovingObject.add(config);

        items_array.push(badGuy_obj);
    }
};
