/**
 * Created by Jean-Baptiste on 2/20/2017.
 */
"use strict";




require('./view/ui/pausebutton');
require ('../css/linguago.css');


  var  languageChoice = require('./view/ui/langageChoice'),
    Labels = require('./datatransform/labels'),
    setLabels = function () {
        var
            scoreLabel_el = document.querySelector('#linguagoApplication .scoreLabel'),
            levelLabel_el = document.querySelector('#linguagoApplication .levelLabel');
        scoreLabel_el.textContent = Labels.getLabel('score');
        levelLabel_el.textContent = Labels.getLabel('level');
    },
    pageLanguage_str = document.querySelector('html').getAttribute('lang');
if (String(pageLanguage_str) === 'undefined') {
    pageLanguage_str = 'en';
}
languageChoice.registerLanguage(pageLanguage_str);

/*
bundling of SVG  - does not work.
var svgContent = require ('../img/svgcontent.txt');
var svg_xml = (new DOMParser().parseFromString(svgContent, "application/xml"));

svg_xml = document.importNode(svg_xml.documentElement,true);

var app_el = document.getElementById('linguagoApplication');
app_el.innerHTML ='';
app_el.appendChild(svg_xml);
*/


Labels.fetchLabels(pageLanguage_str, function () {
    Labels.fetchLanguages(pageLanguage_str, function () {
        var
            Obstacle = require('./view/gameobjects/objects/obstacle'),
            Goodie = require('./view/gameobjects/objects/goodie'),
            BadGuy = require('./view/gameobjects/objects/badguy'),
            PlayerAvatar = require('./view/gameobjects/objects/playeravatar'),
            Config = require('./view/gameobjects/config'),
            LevelOverPopup = require('./view/ui/leveloverpopup'),
            QuestionPopup = require('./view/ui/questionpopup'),
            GameOverPopup = require('./view/ui/gameoverscreen'),
            IntervalManager = require('./game/utils/intervalmanager'),
            ScoreManager = require('./view/counters/scoremanager'),
            Timer = require('./view/counters/timer'),
            LiveManager = require('./view/counters/livemanager'),
            LevelCounter = require('./view/counters/levelcounter'),
            playSound = require('./game/utils/playsound'),
            ObjectlistManager = require('./view/gameobjects/objectlistmanager'),
            LevelsManager = require('./view/levelsmanager'),
            Languages = require ('./datatransform/languages'),
            app_el = Config('app').dom_el,
            playerAvatar_obj,
            level_num = 0,
            newGame = function () {
                ScoreManager.reset();
                LiveManager.reset();
                level_num = 0;
                languageChoice.registerLanguage(pageLanguage_str);
                createLevel();
            },
            togglePauseButton = function (enable_bool) {
                var pauseButton_el = app_el.querySelector('.pauseButton');
                if (enable_bool) {
                    app_el.classList.add('playing');
                    pauseButton_el.setAttribute('tabindex', 0);
                } else {
                    app_el.classList.remove('playing');
                    pauseButton_el.setAttribute('tabindex', -1);
                }
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
                Languages.refresh();
                togglePauseButton(true);
                Timer.start(30 + (30 * (level_num)));
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
                    for (var n = 0; n <= Math.floor(level_num / 4); n++) {
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
     LiveManager.onLivesLost = function () {
            togglePauseButton(false);
            QuestionPopup.remove();
            PauseManager.playing = true;
            IntervalManager.clearAll();
            ObjectlistManager.cleanAll();
            GameOverPopup(newGame);

        };
        Goodie.onCollected = function () {

            togglePauseButton(false);
            ScoreManager.add(Timer.remaining);

            LevelOverPopup(function () {
                    if (level_num%4 === 0) {
                        ObjectlistManager.cleanAll();
                        languageChoice.display(createLevel);
                    } else {
                        createLevel();
                    }
                }
            );
        };
        setLabels();
    });
});

module.exports = {};