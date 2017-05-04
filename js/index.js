/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

var labelsManager = require('./datatransform/labels');

labelsManager.fetch('en', function () {
    var
        levels_array = require('../../data/levels/levels.json'),
        Configs = require('./view/gameobjects/config'),
        Obstacle = require('./view/gameobjects/objects/obstacle'),
        BadGuy = require('./view/gameobjects/objects/badguy'),
        PlayerAvatar = require('./view/gameobjects/objects/playeravatar'),
        Goodie = require('./view/gameobjects/objects/goodie'),
        LevelOverPopup = require('./view/ui/leveloverpopup'),
        GameOverPopup = require('./view/ui/gameoverpopup'),
        IntervalManager = require ('./game/utils/intervalmanager'),
        ScoreManager = require ('./view/counters/scoremanager'),
        Timer = require ('./view/counters/timer'),
        LiveManager = require ('./view/counters/livemanager'),
        LevelCounter = require ('./view/counters/levelcounter'),
        ObjectlistManager = require('./view/gameobjects/objectlistmanager'),
        playerAvatar_obj,
        level_num = 0,
        newGame = function () {
            ScoreManager.reset ();
            LiveManager.reset();

            level_num = 0;

            createLevel();
        },
        createLevel = function () {
            var
                level_array = levels_array[level_num++],
                obstacles_array = level_array.filter(function (element) {
                    return element.id !== 'badGuy';
                }),
                badGuys_array = level_array.filter(function (element) {
                    return element.id === 'badGuy';
                });

            Timer.start (60*(level_num));

            LevelCounter.set (level_num);
            ObjectlistManager.cleanAll();
            playerAvatar_obj = PlayerAvatar.add();
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
            Goodie.addAll();
        };
    newGame();
    Timer.onTimeElapsed =  LiveManager.onLivesLost = function () {
        IntervalManager.clearAll();
        GameOverPopup(newGame);
    };
    Goodie.onCollected = function () {
        if (level_num < levels_array.length) {
            LevelOverPopup(createLevel);
        } else {
            GameOverPopup(newGame);
        }
    }
});
exports = {};