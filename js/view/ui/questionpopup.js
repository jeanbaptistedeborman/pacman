/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
"use strict";
var
    Labels = require('../../datatransform/labels'),
    SvgUtils = require('../../game/utils/svgutils'),
    ArrayUtils = require('../../game/utils/arrayutils'),
    TimeoutManager = require('../../game/utils/timeoutmanager'),
    playSound = require('../../game/utils/playsound'),
    Config = require('../gameobjects/config'),
    UserControls = require('../../game/ui/usercontrol'),
    stage_el = Config('app').dom_el,
    gameStage_obj = Config("stage"),
    gameStage_el = gameStage_obj.dom_el,
    gridSize_num = gameStage_obj.gridSize,
    callback_fun,
    popup_el,
    closePopup = function (correct_bool) {
        if (stage_el.contains(popup_el)) {
            stage_el.removeChild(popup_el);
        }

        callback_fun(correct_bool);
        open_bool = false;
    },
    open_bool = false,
    buildAnswers = function (obstacle_obj) {
        var languages_array = ArrayUtils.convertObjectToArray(Labels.getCurrentLanguages()),
            correctLanguage_obj = languages_array.filter(function (language_obj) {
                    return obstacle_obj.language === language_obj.id;
                }
            )[0],
            languageSelection_array;
        languages_array = ArrayUtils.remove(languages_array, correctLanguage_obj);
        languageSelection_array = ArrayUtils.pickRandomItems(languages_array, 4);
        correctLanguage_obj.correct = true;
        languageSelection_array.push(correctLanguage_obj);
        languageSelection_array = ArrayUtils.shuffle(languageSelection_array);
        return languageSelection_array;
    };


UserControls.onDirectionChange = function () {
    if (open_bool) {
        closePopup();
    }
};
module.exports = {
    remove: function () {
        callback_fun = function () {
        };
        closePopup();
    },
    open: function (obstacle_obj, p_callback_fun) {
        var answers_array,
            margin_num = gridSize_num,
            answers_el = document.createElement('ul'),
            obstacleTL_point = SvgUtils.convertCoordinateFromSVGToDOM(
                gameStage_el,
                {
                    x: obstacle_obj.position.x - margin_num,
                    y: obstacle_obj.position.y - margin_num
                }
            ),
            obstacleTR_point = SvgUtils.convertCoordinateFromSVGToDOM(
                gameStage_el,
                {
                    x: obstacle_obj.position.x + obstacle_obj.position.width + margin_num,
                    y: obstacle_obj.position.y - margin_num
                }
            ),
            questionTitle_el = document.createElement('h2'),
            questionTitleText_node = document.createTextNode(Labels.getLabel('what_language')),
            placePopup = function () {
                var size_rect = popup_el.getBoundingClientRect();
                if (obstacle_obj.position.y < gameStage_obj.position.height / 2) {
                    popup_el.style.top = Math.round(obstacleTL_point.y) + 'px';
                    popup_el.classList.add('top');

                } else {
                    popup_el.style.top = Math.round(obstacleTL_point.y - size_rect.height) + 'px';
                    popup_el.classList.add('bottom');
                }
                if (obstacle_obj.position.x < gameStage_obj.position.width / 2) {
                    popup_el.style.left = Math.round(obstacleTR_point.x) + 'px';
                    popup_el.classList.add('wipeFromRight');
                } else {
                    popup_el.style.left = Math.round(obstacleTL_point.x - size_rect.width) + 'px';
                    popup_el.classList.add('wipeFromLeft');
                }
            };

        if (!open_bool) {
            open_bool = true;
            callback_fun = p_callback_fun;
            answers_array = buildAnswers(obstacle_obj);
            playSound('question');
            popup_el = document.createElement('div');
            questionTitle_el.appendChild(questionTitleText_node);
            stage_el.appendChild(popup_el);
            popup_el.appendChild(questionTitle_el);
            popup_el.appendChild(answers_el);
            popup_el.setAttribute('class', 'question_popup');
            questionTitle_el.setAttribute('class', 'question_title');
            answers_el.setAttribute('class', 'answers');
            answers_array.forEach(function (element, index) {
                var
                    answer_el = document.createElement('li'),
                    button_el = document.createElement('button'),
                    text_node = document.createTextNode(element.value);
                TimeoutManager.set(function () {
                    answers_el.appendChild(answer_el);
                }, 300 + 50 * index);
                answer_el.appendChild(button_el);
                button_el.appendChild(text_node);
                button_el.setAttribute('class', 'answer');
                button_el.setAttribute('tabindex', 0);
                button_el.addEventListener('click', function () {
                    closePopup(element.id === obstacle_obj.language);
                });
            });

            placePopup();
        }
    }
};


