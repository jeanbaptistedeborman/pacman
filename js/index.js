/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

var
    Configs = require('./view/config'),
    Obstacle = require('./view/obstacle'),
    MovingObject = require('./view/movingobject'),
    BadGuy = require('./view/badguy'),
    Goodie = require('./view/goodie'),
    playerAvatar_obj = MovingObject.add(Configs('playerAvatar'), true);

for (var n = 0; n < 50; n++) {
    Obstacle.add();
}
for (var n = 0; n < 5; n++) {
    BadGuy.add();
}
Goodie.addAll ();

exports = {};