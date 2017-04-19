/**
 * Created by Jean-Baptiste on 18/04/2017.
 */

var
    MovingObject = require('../movingobject'),
    SvgUtils = require('../../../game/utils/svgutils'),
    Configs = require('../config');
module.exports = {
    add:function () {
        var
            config = Configs('playerAvatar', true);

        config.dom_el = SvgUtils.createElement('rect', {
            width:10,
            height:10,
            fill:'orange'
        });

        Configs('stage').dom_el.appendChild(config.dom_el);
        playerAvatar_obj = MovingObject.add(config, true);
        playerAvatar_obj.update ();
        return playerAvatar_obj;
    }
};
