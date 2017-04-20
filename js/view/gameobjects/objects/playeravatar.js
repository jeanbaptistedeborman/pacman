/**
 * Created by Jean-Baptiste on 18/04/2017.
 */

var
    MovingObject = require('../movingobject'),
    SvgUtils = require('../../../game/utils/svgutils'),
    Configs = require('../config');
module.exports = {
    add: function () {
        var
            config = Configs('playerAvatar', true);


        // <use xlink:href="#avatar"  width="95.406" height="95.406" x="-47.703" y="-47.703" /> -->
        config.dom_el = SvgUtils.createElement('use', {
            width: "12",
            height: "12",
            transform:'translate(-1,-1)',
            overflow: "visible"
        }, [
            {
                nameSpace: "http://www.w3.org/1999/xlink",
                name: "href",
                value: "#avatar"
            }
        ]);

        Configs('stage').dom_el.appendChild(config.dom_el);
        playerAvatar_obj = MovingObject.add(config, true);
        playerAvatar_obj.update();
        return playerAvatar_obj;
    }
};
