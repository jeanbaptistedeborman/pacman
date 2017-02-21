/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
var
    MovingObject = require ('./movingobject');
    playerAvatar_obj = MovingObject ('playerAvatar');

module.exports = {
    movePlayerAvatarTo : function (point) {
            playerAvatar_obj.pos = point;
    }
}
