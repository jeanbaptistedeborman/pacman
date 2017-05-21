/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

var labelsManager = require('./datatransform/labels');
require('./view/ui/pausebutton');

labelsManager.fetch('en', function () {
    var
        Obstacle = require('./view/gameobjects/objects/obstacle'),
        Goodie = require('./view/gameobjects/objects/goodie'),
        BadGuy = require('./view/gameobjects/objects/badguy'),
        PlayerAvatar = require('./view/gameobjects/objects/playeravatar'),
        LevelOverPopup = require('./view/ui/leveloverpopup'),
        GameOverPopup = require('./view/ui/gameoverpopup'),
        IntervalManager = require('./game/utils/intervalmanager'),
        SvgUtils = require('./game/utils/svgutils'),
        ScoreManager = require('./view/counters/scoremanager'),
        Timer = require('./view/counters/timer'),
        LiveManager = require('./view/counters/livemanager'),
        LevelCounter = require('./view/counters/levelcounter'),
        playSound = require('./game/utils/playsound'),
        ObjectlistManager = require('./view/gameobjects/objectlistmanager'),
        LevelsManager = require('./view/levelsmanager'),
        playerAvatar_obj,
        level_num = 0,
        newGame = function () {
            ScoreManager.reset();
            LiveManager.reset();
            level_num = 0;
            createLevel();
        },
        createLevel = function () {
            var
                level_array = LevelsManager.get(level_num++),
                obstacles_array = level_array.filter(function (element) {
                    return element.id.indexOf('badGuy') === -1;
                }),
                badGuys_array = level_array.filter(function (element) {
                    return element.id.indexOf('badGuy') !== -1;
                });
            Timer.start(60 * (level_num));
            LevelCounter.set(level_num);
            ObjectlistManager.cleanAll();
            obstacles_array.forEach(function (element) {
                Obstacle.add({
                    width: Math.round(element.rect.width),
                    height: Math.round(element.rect.height),
                    x: Math.round(element.rect.x),
                    y: Math.round(element.rect.y)
                });
            });
            playerAvatar_obj = PlayerAvatar.add();
            badGuys_array.forEach(function (element) {
                for (var n = 0; n <= Math.floor(level_num / 3);n++) {
                    BadGuy.add({
                        x: Math.round(element.rect.x),
                        y: Math.round(element.rect.y)
                    });
                }

                playSound('bon_1');
            });
            Goodie.addAll();
        };

    newGame();
    Timer.onTimeElapsed = LiveManager.onLivesLost = function () {
        IntervalManager.clearAll();
        GameOverPopup(newGame);
    };
    Goodie.onCollected = function () {
        if (LevelsManager.remaining > 0) {
            LevelOverPopup(createLevel);
        } else {
            GameOverPopup(newGame);
        }
    };
});
exports = {};