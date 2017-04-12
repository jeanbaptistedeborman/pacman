/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    SvgUtils = require('../../game/utils/svgutils'),
    Config = require('../gameobjects/config'),
    UserControls = require('../../game/ui/usercontrol'),
    stage_el = document.body,
    gameStage_obj = Config("stage"),
    gameStage_el = gameStage_obj.dom_el,
    gridSize_num = gameStage_obj.gridSize,
    callback_fun,
    popup_el,
    closePopup = function (correct_bool) {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun(correct_bool);
    },
    open_bool = false;

UserControls.onDirectionChange = function () {
    if (open_bool) {
        closePopup();
    }
};

module.exports = function (obstacle_obj, p_callback_fun) {
    var
        margin_num = gridSize_num / 2,
        answers_array = [
            {
                label: 'Right answer',
                correct: true
            },
            {
                label: 'Wrong answer',
                correct: false
            }],
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
        questionTitleText_node = document.createTextNode('MOCK QUESTION'),
        placePopup = function () {
            var size_rect = popup_el.getBoundingClientRect();
            if (obstacle_obj.position.y < gameStage_obj.position.height / 2) {
                popup_el.style.top = Math.round(obstacleTL_point.y) + 'px';

            } else {
                popup_el.style.top = Math.round(obstacleTL_point.y - size_rect.height) + 'px';
            }
            if (obstacle_obj.position.x < gameStage_obj.position.width / 2) {
                popup_el.style.left = Math.round(obstacleTR_point.x) + 'px';
                popup_el.classList.add('wipeFromRight');
            } else {
                popup_el.style.left = Math.round(obstacleTL_point.x - size_rect.width) + 'px';
                popup_el.classList.add('wipeFromLeft');
            }
        };
    callback_fun = p_callback_fun;
    if (!open_bool) {
        popup_el = document.createElement('div');
        open_bool = true;
        answers_el = document.createElement('ul');
        questionTitle_el.appendChild(questionTitleText_node);
        stage_el.appendChild(popup_el);
        popup_el.appendChild(questionTitle_el);
        popup_el.appendChild(answers_el);
        popup_el.setAttribute('class', 'question_popup');
        questionTitle_el.setAttribute('class', 'question_title');
        answers_el.setAttribute('class', 'answers');
        answers_array.forEach(function (element) {
            var
                answer_el = document.createElement('li'),
                text_node = document.createTextNode(element.label);
            answer_el.appendChild(text_node);
            answer_el.setAttribute('class', 'answer');
            answer_el.addEventListener('click', function () {
                closePopup(element.correct);
            });
            answers_el.appendChild(answer_el);
        });

        placePopup();
    }
};


