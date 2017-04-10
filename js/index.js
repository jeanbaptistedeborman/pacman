/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

var
    levels_array = require('../../data/levels/levels.json');
    Configs = require('./view/gameobjects/config');

Obstacle = require('./view/gameobjects/objects/obstacle'),
    MovingObject = require('./view/gameobjects/movingobject'),
    BadGuy = require('./view/gameobjects/objects/badguy'),
    Goodie = require('./view/gameobjects/objects/goodie'),
    playerAvatar_obj = MovingObject.add(Configs('playerAvatar'), true);

(function createLevel() {
    var
        level_array = levels_array[levels_array.length - 1],
        obstacles_array = level_array.filter(function (element) {
            return element.id !== 'badGuy';
        }),
        badGuys_array = level_array.filter(function (element) {
            return element.id === 'badGuy';
        });

    badGuys_array.forEach(function (element) {

        BadGuy.add({
            x: Math.round(element.rect.x),
            y: Math.round(element.rect.y)
        });

    });

    obstacles_array.forEach(function (element) {

        Obstacle.add({
            width: Math.round(element.rect.width),
            height: Math.round(element.rect.height),
            x: Math.round(element.rect.x),
            y: Math.round(element.rect.y)
        });

    });

}());


Goodie.addAll();




exports = {};