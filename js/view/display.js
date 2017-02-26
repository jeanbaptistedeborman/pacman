/**
 * Created by Jean-Baptiste on 2/21/2017.
 */

/**
 * remove : place the app direct in index.js instead
 *
 * */
var
    MovingObject = require ('./movingobject');
    playerAvatar_obj = MovingObject ('playerAvatar', true);

module.exports = {
    movePlayerAvatarTo : function (point) {
            playerAvatar_obj.pos = point;
    }
};
