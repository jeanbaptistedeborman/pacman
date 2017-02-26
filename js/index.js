/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

var
    Obstacle = require ('./view/obstacle');



for (var n =0; n<40; n++) {
    Obstacle.add ();
}

display = require('./view/display');


display.movePlayerAvatarTo({x: 0, y: 0});


exports = {};