/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

var
    Obstacle = require('./view/obstacle'),
    MovingObject = require('./view/movingobject'),
    playerAvatar_obj = MovingObject('playerAvatar', true);

for (var n = 0; n < 200; n++) {
    Obstacle.add();
}
exports = {};