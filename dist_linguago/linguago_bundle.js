/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */


var app_obj = {
        dom_el: document.getElementById('linguagoApplication')
    },
    game_obj = {
        dom_el: document.getElementById('game_js')
    },
    stage_obj = {
        gridSize: 10,
        position: {
            x: 0,
            y: 0,
            width: 330,
            height: 200
        },
        get linesNum() {
            return Math.ceil(stage_obj.position.height / stage_obj.gridSize);
        },
        get columnsNum() {
            return Math.ceil(stage_obj.position.width / stage_obj.gridSize);
        },
        dom_el: document.getElementById('app_js')
    };
var configs_obj = {
    app: app_obj,
    game:game_obj,
    interface: {
        dom_el: app_obj.dom_el.querySelector('.interface')
    },
    stage: stage_obj,
    playerAvatar: {
        targetPosition: {
            x: undefined,
            y: undefined
        },
        moveFrequency:10,
        position: {
            x: 0,
            y: 0,
            width: 10,
            height: 10
        },
        speed: 2,
        dom_el: undefined
    },
    obstacle: {
        language: undefined,
        brick_array: [],
        blocked: false,
        direction: undefined,
        position: {
            x: undefined,
            y: undefined,
            width: undefined,
            height: undefined
        },
        dom_el: undefined
    },
    goodie: {
        position: {
            x: undefined,
            y: undefined,
            width: 10,
            height: 10
        }
    },
    badGuy: {
        targetPosition: {
            x: 0,
            y: 0
        },
        moveFrequency:20,
        speed: 1,
        position: {
            x: 0,
            y: 0,
            width: 10,
            height: 10
        },
        dom_el: undefined
    }
};


module.exports = function (id_str, clone_bool) {
    var result_obj = configs_obj[id_str];
    if (result_obj) {
        result_obj.type = id_str;
        if (!clone_bool) {
            return result_obj;
        } else {
            return JSON.parse(JSON.stringify(result_obj));
        }
    } else {
        throw (new Error("No config found for id : " + id_str));
    }
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/22/2017.
 */

var
    polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    },
    applyAttributes = function (el, params_obj, namespaceParams_array) {
    if (params_obj) {
            for (var n in params_obj) {
                if (params_obj.hasOwnProperty(n)) {
                    el.setAttribute(n, params_obj[n]);
                }
            }
        }
        if (namespaceParams_array) {
            namespaceParams_array.forEach(function (attr) {
                el.setAttributeNS(attr.nameSpace, attr.name, attr.value);
            });
        }
    },
    createElement = function (svgTagName_str, params_obj, namespaceParams_array) {
        var el = document.createElementNS("http://www.w3.org/2000/svg", svgTagName_str);
        applyAttributes(el, params_obj, namespaceParams_array);
        return el;
    },
    getSliceAttribute = function (centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle) {
        var startAngle = p_startAngle,
            endAngle = p_endAngle,
            externalCurve_obj = getArc(centerX, centerY, radius, startAngle, endAngle),
            internalCurve_obj = getArc(centerX, centerY, holeRadius, endAngle, startAngle, true), intToExtPath_str = " L" + externalCurve_obj.startPoint + " ", extToIntPath_str = "L" + internalCurve_obj.startPoint + " ";
        return internalCurve_obj.path + intToExtPath_str + externalCurve_obj.path + extToIntPath_str;

    },
    getArc = function (x, y, radius, startAngle, endAngle, inverseArc_bool) {
        var start = polarToCartesian(x, y, radius, endAngle),
            end = polarToCartesian(x, y, radius, startAngle),
            arcSweep = (endAngle - startAngle > 180) ? 1 : 0,
            //Number(Boolean(Math.abs(endAngle - startAngle) <= 180)),
            inverseArc = isNaN(inverseArc_bool) ? 0 : Number(inverseArc_bool),
            d_string = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, inverseArc, end.x, end.y].join(" ");
        return {
            path: d_string,
            endPoint: end.x + " " + end.y,
            startPoint: start.x + " " + start.y
        };
    },
    PointConversion = {
        SVGToPoint: function (SVGPoint) {
            return {x: SVGPoint.x, y: SVGPoint.y};
        },
        pointToSVG: function (svg_el, point) {
            var svg_point = svg_el.createSVGPoint();
            svg_point.x = point.x;
            svg_point.y = point.y;
            return svg_point;
        }
    };
module.exports = {

    getSliceAttribute: getSliceAttribute,
    getSlice: function (centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle) {
        var path = createElement("path");
        path.setAttribute("d", getSliceAttribute(centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle));
        return path;
    },
    getMultilineText: function (parentSvg_el, text_str, params) {
        console.log ('params multiline : ', params);
        var
            forceLineBreakChar = params.forceLineBreakChar,
            forceLineBreakBool,
            container_g = createElement('svg',{
                x:params.x,
                y:params.y
            }),

            line_num = 0,
            text_array = text_str.split(' '),
            createTextBlock = function () {
                var line_span = createElement('text', {
                    x: (params['text-anchor'] ===  'middle')?params.width/2:0,
                    'width':params.width,
                    'text-anchor':params['text-anchor'],
                    'font-size': params['font-size'],
                    'fill':params.color,
                    'stroke':params.stroke || null,
                    'font-weight':params['font-weight'] || null,
                    'stroke-width':params['stroke-width'] || null,
                    'dy': (params.lineHeight * line_num) + params.lineHeight
                });

                container_g.appendChild(line_span);
                line_num++;
                return line_span;
            },
            previousLineContent_str = '',
            lineContent_str = '',
            block_el = createTextBlock();
        parentSvg_el.appendChild(container_g);

        text_array.forEach(function (word) {
            lineContent_str += word + ' ';
            block_el.textContent = lineContent_str;
            if (block_el.getComputedTextLength() >  params.width || forceLineBreakBool) {
                block_el.textContent = previousLineContent_str;
                block_el = createTextBlock();
                lineContent_str = word + ' ';
                block_el.textContent = lineContent_str;
            }
            forceLineBreakBool = word.indexOf(forceLineBreakChar) !== -1;
            previousLineContent_str = lineContent_str;
        });
        return container_g;
    },
    simulateEnterClick: function (svg_el, fun) {
        var handleKey = function (evt) {
                if (evt.key === "Enter") {
                    fun();
                }
            },
            listenEnter = function () {
                svg_el.addEventListener('keydown', handleKey);
            },
            stopListen = function () {
                svg_el.addEventListener('keydown', handleKey);
            };
        svg_el.addEventListener('focus', listenEnter);
        svg_el.addEventListener('blur', stopListen);
    },
    /**
     *
     * Source: https://msdn.microsoft.com/en-us/library/hh535760(v=vs.85).aspx
     * @param {Point} point
     * @param dom_svg
     * @returns {SVGPoint}
     */
    convertCoordinateFromDOMToSVG: function (dom_svg, point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, point),
            converted_point = svg_point.matrixTransform(CTM.inverse());
        return PointConversion.SVGToPoint(converted_point);
    },
    convertCoordinateFromSVGToDOM: function (dom_svg, svgCoordinate_point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, svgCoordinate_point),
            converted_point = svg_point.matrixTransform(CTM);
        return PointConversion.SVGToPoint(converted_point);
    },
    applyAttributes: applyAttributes,
    createElement: createElement
};





/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 10/04/2017.
 */
var list_obj = {disabled: []},
    ArrayUtils = __webpack_require__(5),
    getList = function (listId_str) {
        var result_array = list_obj[listId_str];
        if (!listId_str) {
            return list_obj;
        }
        if (result_array) {
            return list_obj[listId_str];
        } else {
            throw (new Error('List "' + listId_str + '" not found'));
        }
    },
    createList = function (id_str, array) {
        if (!array) {
            array = [];
        }
        list_obj[id_str] = array;
        return list_obj[id_str];
    };

module.exports = {
    createList: createList,
    getList: getList,
    cleanAll: function () {
        var
            items_array,
            n;
        for (n in list_obj) {
            if (list_obj.hasOwnProperty(n)) {
                items_array = list_obj[n];

                while (items_array.length > 0) {
                    var
                        item_obj = items_array.pop(),
                        dom_el = item_obj.dom_el;
                    if (dom_el) {
                        if (dom_el.parentNode) {
                            dom_el.parentNode.removeChild(dom_el);
                        }
                    }
                }
            }
        }
    },
    pushItem: function (listId_str, item_obj) {
        getList(listId_str).push(item_obj);
    },
    disableItemFromList: function (listId_str, item_obj) {
        list_obj.disabled.push(item_obj);
        return createList(listId_str, ArrayUtils.remove(getList(listId_str), item_obj));
    }
};



/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 13/04/2017.
 */
var labels_json,
    languages_json;

function loadJSON(url_str, callback_fun) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url_str, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback_fun(xobj.responseText);
        }
    };
    xobj.send(null);
}

module.exports = {
    fetchLabels: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/labels_linguago/labels_linguago_' + lg_str + '.json',
            function (labels_data) {
                labels_json = JSON.parse(labels_data);
                callback_fun(labels_json);
            }
        );
    },
    fetchLanguages: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/languages/languages_' + lg_str + '.json',
            function (labels_data) {
                languages_json = JSON.parse(labels_data);
                if (languages_json.Id) {
                    delete languages_json.Id;
                }
                if (callback_fun) {
                    callback_fun(labels_json);
                }
            }
        );
    },
    getCurrentLanguages: function () {
        return languages_json;
    },
    getLabel: function (labelId_str) {
        var result_str = labels_json[labelId_str];
        if (result_str) {
            return labels_json[labelId_str];
        } else {
            throw (new Error('Lablel "' +
                labelId_str +
                '" was not found'
            ));
        }
    }
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 04/05/2017.
 */

var
    FOLDER_STR = 'dist_linguago/sounds/',
    cache = {},
    loadSound = function (name_str, doNotUseCache_bool) {
        var audio = doNotUseCache_bool ? null : cache[name_str];
        if (!audio) {
            audio = new Audio(FOLDER_STR + name_str + '.mp3');
            if (!cache[name_str]) {
                cache[name_str] = audio;
            }
        }
        return audio;
    },
    preload_array = ["bon_1", "bon_2", "question", "mauvais_1", "mauvais_2"];
preload_array.forEach(function (name_str) {
    loadSound(name_str);
});

module.exports = function (filename_str, forceNewAudio_bool) {
    var audio = loadSound(filename_str, forceNewAudio_bool);
    audio.play();
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 12/03/2017.
 */
var
    getRandomCel = function (array, remove_bool) {
    var celIndex_num = Math.floor(Math.random() * array.length);
    if (!remove_bool) {
        return array[celIndex_num];
    } else {
        return array.splice(celIndex_num, 1)[0];
    }
},
    clone = function (array) {
    var new_array = [];
    array.forEach(function (element, index) {
        new_array.push(element);
    });
    return new_array;
};

module.exports = {
    clone: clone,
    getRandomCel: getRandomCel,
    remove: function (array, item) {
        result_array = array.filter(function (element) {
            return element !== item;
        });
        return result_array;
    },
    shuffle: function (array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    convertObjectToArray: function (obj) {
        var result_array = [];
        for (var n in obj) {
            result_array.push(
                {
                    "id": n,
                    "value": obj[n]
                }
            )
        }
        return result_array;
    },
    pickRandomItems: function (source_array, items_num) {
        var result_array = [];
        source_array = clone(source_array);
        for (var n = 0; n < items_num; n++) {
            result_array.push(getRandomCel(source_array, true));
        }

        return result_array;
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 06/05/2017.
 */
var
    app_el = __webpack_require__ (0)('app').dom_el,
    noPopup_bool = true,
    evaluatePause =  function (){
        var paused_bool =  noPopup_bool && pauseButton_bool;
        if (pauseButton_bool) {
            app_el.classList.remove ('pauseButtonTriggered');
        } else {
            app_el.classList.add ('pauseButtonTriggered');
        }
        return paused_bool;
    },
    pauseButton_bool = true;
module.exports = {
    set pauseButton (boolean) {
        pauseButton_bool = !boolean;
        evaluatePause();
    },
    set playing   (boolean) {
        if (boolean === undefined) {
            noPopup_bool = !noPopup_bool;
        } else {
            noPopup_bool = boolean;
        }
        evaluatePause();
    },
    get pauseButton ()  {
      return pauseButton_bool;
    },
    get playing () {
        return evaluatePause ();
    }
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var interval_array = [];
module.exports = {
    clearAll: function () {
        interval_array.forEach(function (interval_api) {
            interval_api.clear();
        });
        interval_array = [];
    },
    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initInterval = function () {
                    if (remainingTime > 0) {
                        interval = window.setInterval(fun, remainingTime);
                    }
                },
                interval_api = {
                    clear: function () {
                        window.clearInterval(interval);
                    },
                    pause: function () {
                        var elapsedTime = new Date().getTime() - startdelay_num;
                        remainingTime = remainingTime - elapsedTime;
                        clearinterval(interval);
                    },
                    reStart: function () {
                        startdelay_num = new Date().getTime();
                        initInterval();
                    }
                };
            initInterval();
            interval_array.push(interval_api);
            return interval_api;
        }());
    }
};



/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 */

console.log ("score : ", document.getElementById ('score'));
var

    score_num = 0,
    display = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = score_num;
    };
    display (0);

module.exports = {
    get score() {
        return score_num;
    },
    reset: function () {
        score_num = 0;
        display (score_num);
    },
    add:function (num) {
       score_num += num;
       display (score_num);
    },
    increment: function () {
        display(++score_num);
    }
};



/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var timout_array = [];
module.exports = {
    clearAll: function () {
        timout_array.forEach(function (timeout_api) {
            timeout_api.clear();
        });
        timout_array = [];
    },
    set: function (fun, delay_num) {
        (function () {
            var
                remainingTime = delay_num,
                startdelay_num = new Date().getTime(),
                interval,
                initTimeout = function () {
                    if (remainingTime > 0) {
                        interval = window.setTimeout(fun, remainingTime);
                    }
                },
                timeout_api = {
                    clear: function () {
                        window.clearInterval(interval);
                    },
                    pause: function () {
                        var elapsedTime = new Date().getTime() - startdelay_num;
                        remainingTime = remainingTime - elapsedTime;
                        clearinterval(interval);
                    },
                    reStart: function () {
                        startdelay_num = new Date().getTime();
                        initTimeout();
                    }
                };
            initTimeout();
            timout_array.push(timeout_api);
            return timeout_api;
        }());
    }
};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 05/03/2017.
 */

"use Strict";

var
    Config = __webpack_require__(0),
    ObjectListManager = __webpack_require__(2),
    /**
     *
     * @param itemType_str
     * @param point
     * @returns {*} The object at a given point (if exists)
     */

    isItem = function (itemType_str, point) {
        var
            result_obj,
            items_array = ObjectListManager.getList(itemType_str);

        if (!point) {
            return false;
        }
        result_obj = items_array.filter(function (item_obj) {
            var testPoint = function (ref_point) {
                    return point.x >= ref_point.x &&
                        point.x < ref_point.x + item_obj.position.width &&
                        point.y >= ref_point.y && point.y < ref_point.y + item_obj.position.height;

                },
                result1 = testPoint(item_obj.position);
            if (result1) {
                return result1;
            } else if (item_obj.targetPosition) {
                return testPoint(item_obj.targetPosition);
            }
        })[0];
        return result_obj;
    };
module.exports = {
    isGoodie: function (point) {
        return isItem("goodie", point);
    },
    isAvatar: function (point) {
        return isItem("playerAvatar", point);
    },

    isOccupied: function (point) {
        if (point) {
            var
                isInStage = function (point) {
                    var stage_rect = Config('stage').position,
                        isAboveMin_bool = point.x >= 0 && point.y >= 0,
                        isBelowMin_bool = point.x < stage_rect.width && point.y < stage_rect.height;
                    return isAboveMin_bool && isBelowMin_bool;
                },
                stageTest_bool = isInStage(point),
                obstacleTest_obj = isItem("obstacle", point),
                badGuyTest_obj = isItem("badGuy", point);
            if (!stageTest_bool) {
                return 'out of screen'
            }
            if (obstacleTest_obj) {
                return obstacleTest_obj;
            }
            if (badGuyTest_obj) {
                return badGuyTest_obj;
            }
        }
        return null;
    }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 13/04/2017.
 */


var
    languages_array = __webpack_require__(15),
    ArrayUtils = __webpack_require__(5),
    languages_map = [],
    languagesClone_map,
    refresh = function () {
    console.log ('REFERSH !');
        languagesClone_map = JSON.parse(JSON.stringify(languages_map));
    };
languages_array.forEach(function (element) {
    var
        length_num = element.label.length,
        cel_array = languages_map[length_num];
    if (!cel_array) {
        cel_array = languages_map[length_num] = [];
    }
    cel_array.push(element);
});
refresh();

module.exports = {
    refresh: refresh,
    getRandomLanguageOfLength: function (length_num) {
        var
            possibleLanguages_array = languagesClone_map[length_num];
        if (!possibleLanguages_array) {
            return null;
        }
        if (possibleLanguages_array.length === 0) {
            possibleLanguages_array = languagesClone_map[length_num] = JSON.parse(JSON.stringify(languages_map[length_num]));
        }
        return ArrayUtils.getRandomCel(possibleLanguages_array, true);
    },
    getLanguageById: function (id_str) {
        return languages_array.filter(function (element) {
            return element.id === id_str;
        })[0];
    }
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    LIVES_NUM = 5,
    lives_num = LIVES_NUM,
    display = function (lives_num) {
        var
            livesEl_array = document.getElementsByClassName('liveIcon'),
            n;
        for (n = 0; n < livesEl_array.length; n++) {
            var el = livesEl_array[n];
            if (n < lives_num) {
                el.setAttribute('display', 'inline');
            } else {
                el.setAttribute('display', 'none');
            }
        }
    };
display(LIVES_NUM);
module.exports = {
    decrement: function () {
        display(--lives_num);
        if (lives_num === 0) {
            onLivesLost_fun();
        }
    },
    increment: function () {
        display(++lives_num);
    },
    set onLivesLost(fun) {
        onLivesLost_fun = fun;
    },
    reset: function () {
        lives_num = LIVES_NUM;
        display(lives_num);
    }
};




/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 18/04/2017.
 */

var
    MovingObject = __webpack_require__(18),
    UserControls = __webpack_require__(17),
    QuestionPopup = __webpack_require__(14),
    IntervalManager = __webpack_require__(7),
    ScoreManager = __webpack_require__(8),
    CollisionManager = __webpack_require__(10),
    TimoutManager = __webpack_require__(9),
    SvgUtils = __webpack_require__(1),
    playSound = __webpack_require__(4),
    PauseManager = __webpack_require__(6),
    Configs = __webpack_require__(0),
    gridSize_num = Configs('stage').gridSize,
    started_bool = false,
    XLINK_STR = "http://www.w3.org/1999/xlink",
    defaultParams_obj = {
        attr: {
            width: "12",
            height: "12",
            transform: 'translate(-1,-1)',
            overflow: "visible"
        },
        attrNS: [
            {
                "nameSpace": XLINK_STR,
                "name": "href",
                value: "#avatar"
            }
        ]
    },
    lostParams_obj = {
        attr: {
            width: "30",
            height: "30",
            transform: 'translate(-10,-10)'
        },
        attrNS: [
            {
                nameSpace: XLINK_STR,
                name: "href",
                value: "#avatarLost"
            }
        ]
    },
    avatar;
module.exports = {
    isStarted: function () {
        return started_bool;
    },
    add: function () {
        var
            config = Configs('playerAvatar', true),
            restoreDefaultLook = function () {
                SvgUtils.applyAttributes(config.dom_el, defaultParams_obj.attr, defaultParams_obj.attrNS);
            };
        started_bool = false;
        config.dom_el = SvgUtils.createElement('use', defaultParams_obj.attr, defaultParams_obj.attrNS);
        Configs('stage').dom_el.appendChild(config.dom_el);
        config.changeFrame = function (frameId_str, duration_num) {
            SvgUtils.applyAttributes(config.dom_el, null, [
                {
                    nameSpace: XLINK_STR,
                    name: "href",
                    value: frameId_str
                }
            ]);
            if (duration_num) {
                TimoutManager.set(function () {
                    restoreDefaultLook();
                }, duration_num);
            }
        };
        config.setDirection = function (findPos) {
            var
                forbidden_obj,
                direction_obj,
                temptativePosition_point;

            if (PauseManager.pauseButton) {
                temptativeDirection_obj = UserControls.getDirection(config.position);


                if (temptativeDirection_obj) {
                    temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                }

                var goodie = CollisionManager.isGoodie(temptativePosition_point);
                if (goodie) {
                    ScoreManager.increment();
                    var remaining_num = goodie.remove();
                    if (remaining_num === 0) {
                        IntervalManager.clearAll();
                    }
                }
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (temptativeDirection_obj && !forbidden_obj) {
                    started_bool = true;
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    if (
                        forbidden_obj &&
                        forbidden_obj.type === 'obstacle' && !forbidden_obj.blocked) {
                        PauseManager.playing = false;
                        config.changeFrame('#avatarQuestion');
                        QuestionPopup.open (forbidden_obj,
                            function (answer_bool) {
                                if (answer_bool !== undefined) {
                                    if (answer_bool) {
                                        config.restoreDefaultLook();
                                    } else {
                                        config.changeFrame('#avatarSad', 2000);
                                    }
                                    forbidden_obj.openDoor(answer_bool);
                                } else {
                                    config.changeFrame('#avatar');
                                }
                                PauseManager.playing = true;
                            }
                        );
                    } else if (forbidden_obj && forbidden_obj.blocked) {
                        playSound('mauvais_2');
                    }
                    direction_obj = null;
                }
                return (direction_obj);
            }
        };
        config.restoreDefaultLook = restoreDefaultLook;
        config.avatarLost = function () {
            started_bool = false;
            playSound('mauvais_1');
            SvgUtils.applyAttributes(config.dom_el, lostParams_obj.attr, lostParams_obj.attrNS);
        };
        playerAvatar_obj = MovingObject.add(config, true);
        playerAvatar_obj.update();
        return playerAvatar_obj;
    }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 */

var
    Labels = __webpack_require__(3),
    SvgUtils = __webpack_require__(1),
    ArrayUtils = __webpack_require__(5),
    TimeoutManager = __webpack_require__(9),
    playSound = __webpack_require__(4),
    Config = __webpack_require__(0),
    UserControls = __webpack_require__(17),
    stage_el = Config('app').dom_el,
    gameStage_obj = Config("stage"),
    gameStage_el = gameStage_obj.dom_el,
        gridSize_num = gameStage_obj.gridSize,
    callback_fun,
    popup_el,
    closePopup = function (correct_bool) {
        if (document.body.contains(popup_el)) {
            document.body.removeChild(popup_el);
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
            obstacle_rect = obstacle_obj.dom_el.getBoundingClientRect(),


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
                    y: obstacle_obj.position.y + margin_num
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
                    popup_el.style.top = Math.round(50 + obstacleTL_point.y - size_rect.height) + 'px';
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
            document.body.appendChild(popup_el);
            popup_el.setAttribute('tabindex', 0);
            popup_el.focus ();
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
                }, 300 + 30 * index);

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




/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = [
	{
		"id": "bg",
		"label": "български"
	},
	{
		"id": "cs",
		"label": "čeština"
	},
	{
		"id": "da",
		"label": "dansk"
	},
	{
		"id": "de",
		"label": "Deutsch"
	},
	{
		"id": "et",
		"label": "eesti"
	},
	{
		"id": "el",
		"label": "ελληνικά"
	},
	{
		"id": "en",
		"label": "English"
	},
	{
		"id": "es",
		"label": "español"
	},
	{
		"id": "fr",
		"label": "français"
	},
	{
		"id": "ga",
		"label": "Gaeilge"
	},
	{
		"id": "it",
		"label": "italiano"
	},
	{
		"id": "lv",
		"label": "latviešu"
	},
	{
		"id": "lt",
		"label": "lietuvių"
	},
	{
		"id": "hu",
		"label": "magyar"
	},
	{
		"id": "hr",
		"label": "hrvatski"
	},
	{
		"id": "mt",
		"label": "Malti"
	},
	{
		"id": "nl",
		"label": "Nederlands"
	},
	{
		"id": "pl",
		"label": "polski"
	},
	{
		"id": "pt",
		"label": "português"
	},
	{
		"id": "ro",
		"label": "română"
	},
	{
		"id": "sk",
		"label": "slovenčina"
	},
	{
		"id": "sl",
		"label": "slovenščina"
	},
	{
		"id": "fi",
		"label": "suomi"
	},
	{
		"id": "sv",
		"label": "svenska"
	}
];

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
module.exports = function (from_point, to_point, longestPath_bool) {
    var diffs_obj = {
        x: to_point.x - from_point.x,
        y: to_point.y - from_point.y
    };
    var xIsShorter_bool = Math.abs(diffs_obj.x) > Math.abs(diffs_obj.y);
    if (longestPath_bool) {
        xIsShorter_bool = !xIsShorter_bool;
    }

    if (xIsShorter_bool) {
        return {
            x: diffs_obj.x / Math.abs(diffs_obj.x),
            y: 0
        }
    } else {
        return {
            y: diffs_obj.y / Math.abs(diffs_obj.y),
            x: 0
        }
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/22/2017.
 */

/**
 * An object containing a direection on x and y axis.
 * @typeDef {Object} Direction
 * @property {number} x  n integer ranging from -1 to 1 expressing the direction on the x-axis (-1 = left, 1= right, 0=no move)
 * @property {number} y An integer ranging from -1 to 1 expressing the direction on the y-axis (-1 = up, 1= down, 0=no move)
 */


var MouseControl = __webpack_require__(32),
    KeyControls = __webpack_require__(31),
    SvgUtils = __webpack_require__(1),
    directionFromTo = __webpack_require__(16),
    Config = __webpack_require__(0),
    stage_el = Config("stage").dom_el,
    previousDirection_obj = {x: 0, y: 0},
    onDirectionChange_fun,
    addChangeInfo = function (newDirection_obj) {
        newDirection_obj.directionChange =
            previousDirection_obj &&
            (newDirection_obj.x !== 0 || newDirection_obj.y !== 0) &&
            (previousDirection_obj.x !== newDirection_obj.x ||
            previousDirection_obj.y !== newDirection_obj.y);
        if (newDirection_obj.directionChange && onDirectionChange_fun) {
            onDirectionChange_fun(newDirection_obj);
        }
        previousDirection_obj = newDirection_obj;
    };

module.exports = {
    set onDirectionChange(fun) {
        onDirectionChange_fun = fun;
    },
    /**
     * @module
     * @description - Aggregates inputs from keyboard, mouse and touch in order to give a consistent representation of user inputs.
     * @param {Point} objectPosition_point - The position of the moving object in order to compare the mouse position with the objects position.
     * @returns {Direction} - An object containing the direction to follow.
     *
     */

    getDirection: function (objectPosition_point) {
        var
            direction_obj;
        if (KeyControls.pressedKey) {
            direction_obj = {x: 0, y: 0};
            switch (KeyControls.pressedKey) {
                case "Right":
                case "ArrowRight":
                    direction_obj.x = 1;
                    break;
                case "Left":
                case "ArrowLeft":
                    direction_obj.x = -1;
                    break;
                case "Up":
                case "ArrowUp":
                    direction_obj.y = -1;
                    break;
                case "Down":
                case "ArrowDown":
                    direction_obj.y = 1;
                    break;
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }
        if (objectPosition_point && stage_el && MouseControl.position) {

            var
                mouseSVG_point = SvgUtils.convertCoordinateFromDOMToSVG(stage_el, MouseControl.position),
                gridSize_num = Config('stage').gridSize;
            if (mouseSVG_point.x >= objectPosition_point.x
             && mouseSVG_point.y >= objectPosition_point.y
             && mouseSVG_point.x < objectPosition_point.x + gridSize_num
             && mouseSVG_point.y < objectPosition_point.y + gridSize_num) {
                direction_obj = {x: 0, y: 0};
            } else {
                direction_obj = directionFromTo ({x: objectPosition_point.x + gridSize_num / 2,
                                       y: objectPosition_point.y + gridSize_num / 2}, mouseSVG_point);
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }

    }

}
;



/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */

var
    Config = __webpack_require__(0),
    IntervalManager = __webpack_require__(7),
    PauseManager = __webpack_require__(6),
    ObjectListManager = __webpack_require__(2),
    gridSize_num = Config('stage').gridSize,
    movingObjectsCounter_num = 0;


module.exports = {
    add: function (config) {
        var
            position_rect = config.position,
            updatePos = function (point) {
                for (var n in point) {
                    if (point.hasOwnProperty(n)) {
                        position_rect[n] = point[n];
                    }
                }
                if (config.dom_el) {
                    config.dom_el.setAttribute("x", position_rect.x);
                    config.dom_el.setAttribute("y", position_rect.y);
                }
            },
            findPos = function (direction_obj, step_num) {
                var
                    setAxisPosition = function (propName_str) {
                        if (isNaN(direction_obj[propName_str])) {
                            direction_obj[propName_str] = 0;
                        }
                        return position_rect[propName_str] + (direction_obj[propName_str] * step_num);
                    };
                return {
                    x: setAxisPosition('x'),
                    y: setAxisPosition('y')
                };
            },
            incrementPos = function (direction_obj) {
                if (direction_obj) {
                    var newPos_point = findPos(direction_obj, config.speed * Boolean(PauseManager.playing));
                    updatePos(newPos_point);
                }
            },
            MoveManager = (function () {
                var
                    direction_obj,
                    setDirection = function () {
                        /*
                         @todo:avoid passing findPos as an argument
                         */
                        direction_obj = config.setDirection(findPos);
                    };
                return function () {
                    IntervalManager.set(function () {
                        var getNewDirection_bool = config.position.x % gridSize_num === 0 && config.position.y % gridSize_num === 0;
                        if (!direction_obj || getNewDirection_bool) {
                            setDirection();
                            incrementPos(direction_obj);
                        }
                            incrementPos(direction_obj);
                    }, 20);
                }
            }()),
            api = {
                /*@ todo :  harmonise : every call to config should go through config.*/
                get dom_el() {
                    return config.dom_el;
                },
                get config() {
                    return config;
                },
                get position() {
                    return config.position;
                },
                get targetPosition() {
                    return config.targetPosition;
                },
                set position(point) {
                    updatePos(point);
                },
                set moveDirection(point) {
                    moveTo(point);
                },
                update: function () {
                    updatePos(config.position);
                }
            };

        if (config.type === "playerAvatar") {
            ObjectListManager.createList('playerAvatar');
            ObjectListManager.pushItem('playerAvatar', api);
        }
        movingObjectsCounter_num++;
        window.setTimeout(MoveManager, movingObjectsCounter_num * 3);
        return api;
    }
};



/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 */


var
    display = function (level_num) {
        var
            text_text = document.getElementById('level');
        text_text.textContent = level_num;
    };
module.exports = {
    set: function (num) {
        display(num);
    }
};




/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 */


var
    IntervalManager = __webpack_require__(7),
    PauseManager = __webpack_require__(6),
    SvgUtils = __webpack_require__(1),
    startTime_num,
    time_num = 0,
    text_el = document.getElementById('time'),
    interval,
    onTimeElapsed_fun,
    clockPos = {
        x: 24.112,
        y: 17.695,
        holeRadius: 0,
        radius: 6.2515
    },
    container_el = document.getElementById('game_js'),
    clock_el = SvgUtils.getSlice(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, 0),
countDown = function () {
    if (PauseManager.pauseButton) {

        if (time_num === 0) {
            display(time_num);
            if (onTimeElapsed_fun) {
                onTimeElapsed_fun();
            }
        } else {
            display(--time_num);
        }
    }
},
    display = function (remainTime_num) {
        var angle_num = 360 - (360 * (remainTime_num / startTime_num));
        if (remainTime_num) {
        clock_el.setAttribute('d', SvgUtils.getSliceAttribute(clockPos.x, clockPos.y, clockPos.radius, clockPos.holeRadius, 0, angle_num));
        }
        text_el.textContent = remainTime_num;
    };

clock_el.setAttribute('fill', '#b0b0b0');
container_el.appendChild(clock_el);

module.exports = {
    start: function (p_startTime_num) {
        if (interval) {
            interval.clear();
        }
        display(startTime_num);
        startTime_num = time_num = p_startTime_num;
        interval = IntervalManager.set(countDown, 1000);
    },
    get remaining() {
        return time_num;
    },
    set onTimeElapsed(fun) {
        onTimeElapsed_fun = fun;
    }
};




/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 26/02/2017.
 */
var Configs = __webpack_require__(0),
    ObjectListManager = __webpack_require__(2),
    SvgUtils = __webpack_require__(1),
    MovingObject = __webpack_require__(18),
    directionFromTo = __webpack_require__(16),
    PlayerAvatar = __webpack_require__(13);
LivesManager = __webpack_require__(12),
    PauseManager = __webpack_require__(6),
    CollisionManager = __webpack_require__(10),
    ID_STR = 'badGuy',
    gridSize_num = Configs('stage').gridSize,
    items_array = ObjectListManager.createList(ID_STR);

module.exports = {
    itemList: items_array,
    add: function (point) {
        var vibrate = (function () {
                var STEP = 0.2,
                    direction = {
                        x: Math.random() > .5 ? -1 : 1,
                        y: Math.random() > .5 ? -1 : 1
                    },
                    move = {
                        x: -2,
                        y: -2,
                    };
                return function (vibration_num) {
                    if (vibration_num) {
                        move.x = -2 + vibration_num;
                        move.y = -2 + vibration_num;
                    } else {
                        move.x += STEP * direction.x,
                            move.y += STEP * direction.y;
                        if (Math.abs(move.y + 2) > STEP * 5) {
                            direction.y *= -1;
                        }
                        if (Math.abs(move.x + 2) > STEP * 10) {
                            direction.x *= -1;
                        }
                    }
                    config.dom_el.setAttribute('transform', 'translate(' + move.x + ',' + move.y + ')');
                }
            }()),
            origin_point = point,
            config = JSON.parse(JSON.stringify(Configs(ID_STR))),
            applyOriginPoint = function () {
                config.position.x = origin_point.x * stageConfig.gridSize;
                config.position.y = origin_point.y * stageConfig.gridSize;
                if (config.dom_el) {
                    config.dom_el.setAttribute('x', config.position.x);
                    config.dom_el.setAttribute('y', config.position.y);
                }
            },
            stageConfig = Configs('stage');
        applyOriginPoint();
        config.dom_el = SvgUtils.createElement('use', {
            width: "14",
            height: "14",
            transform: 'translate(-2,-2)',
            overflow: "visible",
            x: config.position.x,
            y: config.position.y
        }, [
            {
                nameSpace: "http://www.w3.org/1999/xlink",
                name: "href",
                value: "#badguy"
            }
        ]);
        config.setDirection = function (findPos) {
            var
                playerAvatar_api = ObjectListManager.getList('playerAvatar')[0],
                forbidden_obj,
                temptativePosition_point,
                isMySelf = function () {
                    return forbidden_obj.config === config;
                };
            temptativeDirection_obj = directionFromTo(config.position, playerAvatar_api.position);


            temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
            if (PauseManager.playing && CollisionManager.isAvatar(temptativePosition_point)) {
                playerAvatar_api = CollisionManager.isAvatar(temptativePosition_point);
                PauseManager.playing = false;
                playerAvatar_api.config.avatarLost();
                config.show(false);
                window.setTimeout(function () {
                    var badGuys_array = ObjectListManager.getList('badGuy');
                    playerAvatar_api.position = {x: 0, y: 0};
                    config.show(true);
                    badGuys_array.forEach(function (badGuy_mo) {
                        badGuy_mo.config.reset();
                    });
                    playerAvatar_api.config.restoreDefaultLook();
                    LivesManager.decrement();
                    PauseManager.playing = true;
                }, 2000);
            }

            forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
            if (forbidden_obj && isMySelf(forbidden_obj)) {
                forbidden_obj = null;
            }
            if (temptativeDirection_obj && !forbidden_obj) {
                direction_obj = temptativeDirection_obj;
                config.targetPosition = temptativePosition_point;
            } else {
                temptativeDirection_obj = directionFromTo(config.position, playerAvatar_api.position, true);
                temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (temptativeDirection_obj && !forbidden_obj) {
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    direction_obj = null;
                }
            }
            if (!direction_obj || !PlayerAvatar.isStarted()) {
                vibrate();
            } else {
                vibrate(0);
            }
            if (PlayerAvatar.isStarted()) {
                return direction_obj;
            }
        };

        config.reset = function () {
            applyOriginPoint();
        };
        config.show = function (visible_bool) {
            if (!visible_bool) {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display': 'none'
                });
            } else {
                SvgUtils.applyAttributes(config.dom_el, {
                    'display': 'inline'
                });
            }
        };
        stageConfig.dom_el.appendChild(config.dom_el);
        var badGuy_obj = MovingObject.add(config);
        ObjectListManager.pushItem(ID_STR, badGuy_obj);
    },
    resetToOrigins: function () {
        items_array.forEach(function (el) {
            el.reset();
        });
    }
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 25/02/2017.
 */

var
    Config = __webpack_require__(0),
    stageConfig = Config('stage'),
    ObjectListManager = __webpack_require__(2),
    SvgUtils = __webpack_require__(1),
    playSound = __webpack_require__(4),
    CollisionManager = __webpack_require__(10),
    layer_g = SvgUtils.createElement('g'),






    onCollected_fun,
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'goodie',
    parent_el = layer_g,
    items_array = ObjectListManager.createList(ID_STR),
    add = function (point) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el;
        config.position = point;
        config.position.width = gridSize_num;
        config.position.height = gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('use', {
                width: 10,
                height: 10,
                x: config.position.x,
                y: config.position.y
            },
            [
                {
                    nameSpace: "http://www.w3.org/1999/xlink",
                    name: "href",
                    value: "#goodie"
                }]);

        config.remove = function () {
            parent_el.removeChild(dom_el);
            items_array = ObjectListManager.disableItemFromList(ID_STR, config);
            if (items_array.length === 0 && onCollected_fun) {
                onCollected_fun();
            }
            playSound('bon_2');
            return items_array.length;
        };
        items_array.push(config);
        parent_el.appendChild(dom_el);
    };

stageConfig.dom_el.appendChild (layer_g);

module.exports = {
    set onCollected(fun) {
        onCollected_fun = fun;

    },
    get itemList() {
        return items_array;
    },
    addAll: function () {
        var line_num,
            column_num,
            lineTotal_num = stageConfig.linesNum,
            colTotal_num = stageConfig.columnsNum;
        for (column_num = 0; column_num < colTotal_num; column_num++) {
            for (line_num = 0; line_num < lineTotal_num; line_num++) {
                if (line_num % 6 === 0 && column_num % 6 === 0) {
                    var position_point = {
                        x: column_num * gridSize_num,
                        y: line_num * gridSize_num
                    };
                    if (!CollisionManager.isOccupied(position_point)) {
                        add(position_point);
                    }
                }

            }
        }
    }
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 25/02/2017.
 */

var
    Config = __webpack_require__(0),
    stageConfig = Config('stage'),
    ObjectListManager = __webpack_require__(2),
    SvgUtils = __webpack_require__(1),
    ColorUtils = __webpack_require__(33),
    TimeoutManager = __webpack_require__(9),
    ArrayUtils = __webpack_require__(5),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    layer_g = SvgUtils.createElement('g'),
    playSound = __webpack_require__(4),
    Languages = __webpack_require__(11),
    COLORS_ARRAY = ['#170c59', '#752995', '#ff5a19', '#006830'],
    items_array = ObjectListManager.createList(ID_STR);

stageConfig.dom_el.appendChild (layer_g);

module.exports = {
    get itemList() {
        return items_array;
    },
    add: function (rect) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            dom_el,
            blocks_num,
            language_obj,
            color_hex = ArrayUtils.getRandomCel(COLORS_ARRAY),
            string_array,
            shades_array = [],
            n;

        config.direction = rect.width > rect.height ? 'width' : 'height';
        config.position.x = rect.x * gridSize_num;
        config.position.y = rect.y * gridSize_num;
        config.position.width = rect.width * gridSize_num;
        config.position.height = rect.height * gridSize_num;
        dom_el = config.dom_el = SvgUtils.createElement('g');


        blocks_num = rect[config.direction];

        language_obj = Languages.getRandomLanguageOfLength(blocks_num);
        if (language_obj) {
            config.language = language_obj.id;
            string_array = language_obj.label.split('');
        } else {
            config.blocked = true;
        }
        for (n = 0; n < blocks_num; n++) {
            var baseShade_num = 1;
            if (blocks_num < 5) {
                baseShade_num = 1.5;
            }
            shades_array.push(baseShade_num + (0.15 * n));
        }
        if (Math.random() > .5) {
            shades_array.reverse();
        }
        for (n = 0; n < blocks_num; n++) {
            (function () {
                var brick_el = SvgUtils.createElement('rect', {
                    width: gridSize_num,
                    height: gridSize_num,
                    fill: ColorUtils.multiply(color_hex, shades_array[n]),
                    x: config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                    y: config.position.y + n * gridSize_num * Number(config.direction === 'height')
                });
                if (string_array) {
                    var
                        textHeight_num = 9,
                        text_el = SvgUtils.createElement('text',
                            {
                                width: gridSize_num,
                                height: gridSize_num,
                                'text-anchor':'middle',
                                fill: 'white',
                                "font-family": "Arial narrow",
                                "font-size": "9",
                                x: gridSize_num/2 + config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                                y: textHeight_num-0.7 + config.position.y + n * gridSize_num * Number(config.direction === 'height')
                            }
                        ),
                        text_node = document.createTextNode(string_array.shift().toUpperCase());
                    text_el.appendChild(text_node);

                }
                config.brick_array.push(
                    {
                        brick_el: brick_el,
                        text_el: text_el
                    });
                TimeoutManager.set(function () {
                    dom_el.appendChild(brick_el);
                    if (string_array) {
                        dom_el.appendChild(text_el);
                    }
                }, 1 + 50 * n);
            }());
        }
        config.openDoor = function (openOrLock_bool) {
            if (!config.blocked) {
                if (openOrLock_bool) {
                    ObjectListManager.disableItemFromList(ID_STR, config);
                } else {
                    config.blocked = true;
                }
                config.brick_array.forEach(function (brick_obj, index) {
                    TimeoutManager.set(function () {
                        if (openOrLock_bool) {
                            brick_obj.brick_el.setAttribute('fill', 'rgba(255,255,255,0.2)');
                            brick_obj.text_el.setAttribute('fill', 'rgba(255,255,255,0.2)');
                        } else {
                            playSound('mauvais_2', true);
                            brick_obj.brick_el.setAttribute('fill', '#c5c5c5');
                        }
                    }, 50 + (100 * index));
                });
                if (openOrLock_bool) {
                    playSound('bon_1');
                    TimeoutManager.set(function () {
                        playSound(config.language);
                    }, 100 * (config.brick_array.length - 1));
                }
            }
        };

        ObjectListManager.pushItem(ID_STR, config);
        items_array.push(config);
        layer_g.appendChild(dom_el);
    }
}
;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 14/05/2017.
 */
var
    levels_array = __webpack_require__(30),
    ArrayUtils = __webpack_require__(5),
    randomLevels_array,
    setRandomArray = function () {
        randomLevels_array = levels_array.slice(2);
    },

    getRandomCel = function () {
        if (randomLevels_array.length === 0) {
            setRandomArray();
        }
        return ArrayUtils.getRandomCel(randomLevels_array, true);
    };
setRandomArray();

module.exports = {
    get remaining() {
        return randomLevels_array.length;
    },
    get: function (level_num) {
        if (level_num < 2) {
            return levels_array [level_num];
        } else {
            return getRandomCel();
        }
    }
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = __webpack_require__(3),
    Config = __webpack_require__(0),
    ScoreManager = __webpack_require__(8),
    SvgUtils = __webpack_require__(1),
    stage_el = Config('game').dom_el,
    TEXT_MARGIN_NUM = 150,
    callback_fun,
    yesYouDidiIt_block,
    yourScore_block,
    playAgain_block,
    popup_el = document.querySelector('.endScreen'),
    closePopup = function () {
        continueButton_el.removeEventListener('click', closePopup);
        continueButton_el.removeEventListener('touchstart', closePopup);
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
    },
    open_bool = false;

popup_el.removeAttribute('style');
popup_el.parentNode.removeChild(popup_el);

module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;

    if (!open_bool) {
        if (yourScore_block) {
            popup_el.removeChild(yourScore_block);
        }

        stage_el.appendChild(popup_el);
        (function setYourScore() {
            var
                lineHeight_num = 8,
                baseFormat_obj =
                    {
                        x: TEXT_MARGIN_NUM ,
                        y: 160,
                        fill: '#ffffff',
                        'text-anchor': 'left',
                        'font-size': '6px'
                    },
                yourScore_str = Labels.getLabel('you_scored'),
                yourScore_array = yourScore_str.split('XXX'),
                    firstLine_text = SvgUtils.createElement("text", baseFormat_obj),
                secondLine_text = SvgUtils.createElement("text", baseFormat_obj),
                suffix_tspan = SvgUtils.createElement("tspan"),
                score_tspan = SvgUtils.createElement("tspan", {
                    'font-size': '8px',
                    'fill': '#f3d332'
                });
            yourScore_block = SvgUtils.createElement('g');
            score_tspan.textContent = ScoreManager.score;
            suffix_tspan.textContent = yourScore_array[1];

            secondLine_text.setAttribute('dy', lineHeight_num);
            firstLine_text.textContent = yourScore_array[0];
            secondLine_text.appendChild(score_tspan);
            secondLine_text.appendChild(suffix_tspan);
            yourScore_block.appendChild(firstLine_text);
            yourScore_block.appendChild(secondLine_text);
            popup_el.appendChild(yourScore_block);
        }());


        if (!playAgain_block) {
            playAgain_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel("play_again"),
                {
                    x: TEXT_MARGIN_NUM + 24,
                    y: 176, color: '#ffffff',
                    'text-anchor': 'left',
                    width: 20,
                    lineHeight: 6,
                    'font-size': '5px'
                })
        }
        if (!yesYouDidiIt_block) {
            yesYouDidiIt_block = SvgUtils.getMultilineText(popup_el, Labels.getLabel('you_did_it'), {
                    x: TEXT_MARGIN_NUM ,
                    y: 111,
                    'forceLineBreakChar': '!',
                    color: 'black',
                    'text-anchor': 'left',
                    width: 80,
                    'font-weight': 'bold',
                    'stroke': 'white',
                    'stroke-width': 0.3,
                    lineHeight: 12,
                    'font-size': '12px'
                }
            )
        }

        continueButton_el = popup_el.querySelector('.playAgain');
        open_bool = true;

        SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
    }
}
;




/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {


var languages_array = __webpack_require__(15),
    Labels = __webpack_require__(3),
    Config = __webpack_require__(0),
    stage_el = Config('game').dom_el,
    SvgUtils = __webpack_require__(1),
    XLINK_STR = "http://www.w3.org/1999/xlink",
    dom_el = SvgUtils.createElement('svg'),
    COLS_NUM = 4,
    MARGIN_BUTTONS = {
        top: 107.5,
        left: 21.3
    },
    POSITION = {
        width: 79.756,
        height: 22.71
    },
    callBack_fun,
    usedLanguages_array = [],
    logoContainer_el = SvgUtils.createElement('svg',{
        x:20.63,
        y:40
    }),
    explanationTextBlock_el,
    logo_el = SvgUtils.createElement('use', {
            width: "132.996",
            height: "35.583",
            x: "0",
            y: "-35.583",
            transform: "scale (1,-1)",
            overflow: "visible"
        },
        [
            {
                nameSpace: XLINK_STR,
                name: "href",
                value: "#linguagoLogo"
            }]),
    registerLanguage = function (languageId_str) {
        var button_el = (function () {
            var index_num;
            languages_array.forEach(function (element, index) {
                if (element.id === languageId_str) {
                    index_num = index;
                }
            });
            return dom_el.childNodes[index_num];
        }());
        button_el.setAttribute('aria-disabled', true);
        button_el.setAttribute('tabindex', -1);
        Labels.fetchLanguages(languageId_str);
        usedLanguages_array.push(languageId_str);
    };
dom_el.appendChild(logoContainer_el);
logoContainer_el.appendChild(logo_el);




languages_array.forEach(function (element, index) {
    var button_str = element.label,
        col_num = index % COLS_NUM,
        line_num = Math.floor(index / COLS_NUM),
        button_el = SvgUtils.createElement('svg', {
            x: MARGIN_BUTTONS.left + col_num * POSITION.width,
            y: MARGIN_BUTTONS.top + line_num * POSITION.height
        }),
        button_text = SvgUtils.createElement('text', {
            y: 7,
            x: 12.5,
            fill: 'white',
            'font-size': '5px'
        }),
        bg_el = SvgUtils.createElement('use', {
                width: 50,
                height: 11,
                class: 'background'
            },
            [
                {
                    nameSpace: XLINK_STR,
                    name: "href",
                    value: "#lgButton"
                }
            ]);

    button_text.textContent = button_str;
    button_el.setAttribute('class', 'button');
    button_el.appendChild(bg_el);
    button_el.appendChild(button_text);
    button_el.addEventListener('click', function () {
        registerLanguage(element.id);
        callBack_fun();
        dom_el.parentNode.removeChild(dom_el);
    });
    dom_el.setAttribute('class', 'languageChoice_popup');
    dom_el.appendChild(button_el);
});

module.exports = {
    display: function (p_callBack_fun) {
        callBack_fun = p_callBack_fun;
        stage_el.appendChild(dom_el);
        if (!explanationTextBlock_el) {
            explanationTextBlock_el =  SvgUtils.getMultilineText(
                dom_el,
       Labels.getLabel("choose_another_language"),
                {
                    width:100,
                    x:179.6,
                    y:48.3,
                    lineHeight:8,
                    'font-size':'7.09px',
                    color:'white'
                }
            );
        }

    },
    registerLanguage: registerLanguage
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    Labels = __webpack_require__(3),
    Config = __webpack_require__(0),
    stage_el = Config('game').dom_el,
    SvgUtils = __webpack_require__(1),
    callback_fun,


    popup_el = document.getElementsByClassName('levelPopup')[0],
    closePopup = function () {
        open_bool = false;
        stage_el.removeChild(popup_el);
        callback_fun();
        continueButton_el.removeEventListener('click', closePopup);
        continueButton_el.removeEventListener('touchstart', closePopup);
        document.body.removeEventListener('keydown',listenKey);
    },
    listenKey = function (evt) {
        if (evt.key === "Enter") {
            closePopup();
        }
    },
    textBlock,
    open_bool = false;
popup_el.removeAttribute('style');
popup_el.parentNode.removeChild(popup_el);


module.exports = function (p_callback_fun) {
    callback_fun = p_callback_fun;


    if (!open_bool) {
        var
            continueButton_el = popup_el.querySelector('.goButton');
        stage_el.appendChild(popup_el);
        if (!textBlock) {
            textBlock = SvgUtils.getMultilineText(popup_el, Labels.getLabel('nice_work'),
                {
                    x: 125,
                    y: 132,
                    'text-anchor': 'middle',
                    width: 80,
                    lineHeight: 9,
                    'font-size': '7px'
                }
            )
        }
        open_bool = true;
        SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
        document.body.addEventListener('keydown',listenKey);
    }
};




/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 06/05/2017.
 */

var
    paused_bool = false,
    Config = __webpack_require__(0),
    PauseManager = __webpack_require__(6),
    SvgUtils = __webpack_require__(1),
    pauseButton = Config('interface').dom_el.querySelector('.pauseButton'),
    togglePause = function (evt) {
            paused_bool = !paused_bool;
            PauseManager.pauseButton = paused_bool;
            pauseButton.setAttribute('aria-selected', paused_bool);
            evt.stopPropagation();
    };
pauseButton.addEventListener('mousedown', togglePause);
pauseButton.addEventListener('touchstart', togglePause);
SvgUtils.simulateEnterClick(pauseButton, togglePause);
module.exports = {};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {};
options.transform = transform;
// add the styles to the DOM
var update = __webpack_require__(37)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./linguago.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./linguago.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = [
	[
		{
			"id": "boite_8_",
			"rect": {
				"x": "6.95",
				"y": "16.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.123",
				"height": "0.874"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "3.1",
				"y": "4.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.191",
				"height": "0.875"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "11",
				"y": "2.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "10.011",
				"height": "0.875"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "28.95",
				"y": "8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1.001",
				"height": "9.006"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "2",
				"y": "7",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1.001",
				"height": "11.025"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "21.45",
				"y": "3.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.19",
				"height": "0.874"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "7",
				"y": "8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.123",
				"height": "0.874"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "14.2",
				"y": "9.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1.003",
				"height": "7.022"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "5.85",
				"y": "9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "0.999",
				"height": "6.994"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "19.9",
				"y": "14.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.04",
				"height": "1.187"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "18.9",
				"y": "9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.935"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "19.9",
				"y": "8.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.048",
				"height": "0.999"
			}
		},
		{
			"id": "boite",
			"rect": {
				"x": "24.95",
				"y": "8.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "0.998",
				"height": "4.946"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "30",
				"y": "18",
				"width": "1",
				"height": "1"
			}
		}
	],
	[
		{
			"id": "Layer_18",
			"rect": {
				"x": "30.95",
				"y": "2.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "11.05"
			}
		},
		{
			"id": "Layer_17",
			"rect": {
				"x": "22.1",
				"y": "10.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "Layer_16",
			"rect": {
				"x": "20.95",
				"y": "2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "Layer_15",
			"rect": {
				"x": "21.85",
				"y": "18.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "10",
				"height": "0.851"
			}
		},
		{
			"id": "Layer_14",
			"rect": {
				"x": "12.1",
				"y": "6.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7",
				"height": "1"
			}
		},
		{
			"id": "Layer_13",
			"rect": {
				"x": "11.9",
				"y": "2.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "Layer_12",
			"rect": {
				"x": "1.85",
				"y": "2.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "Layer_11",
			"rect": {
				"x": "0.95",
				"y": "6.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "Layer_10",
			"rect": {
				"x": "11.85",
				"y": "13.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.851"
			}
		},
		{
			"id": "Layer_9",
			"rect": {
				"x": "10.9",
				"y": "7.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "Layer_8",
			"rect": {
				"x": "19.05",
				"y": "7.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "Layer_7",
			"rect": {
				"x": "2.95",
				"y": "9.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "Layer_6",
			"rect": {
				"x": "1.05",
				"y": "17.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "Layer_5",
			"rect": {
				"x": "12.95",
				"y": "17.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.199"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "27",
				"y": "15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1.05",
				"height": "1"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "21.05",
				"y": "12.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "22.25",
				"y": "11.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "10.65",
				"height": "1.2"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "24.25",
				"y": "13.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.7",
				"height": "1.2"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "23.2",
				"y": "14.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "24.2",
				"y": "17.45",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.899",
				"height": "1"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "29.95",
				"y": "14.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "21.05",
				"y": "1.8",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "22.05",
				"y": "9",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "9.7",
				"height": "1.2"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "25",
				"y": "3",
				"width": "5.7",
				"height": "1.2"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "23.95",
				"y": "3.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "24.95",
				"y": "7.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.899",
				"height": "1"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "30.9",
				"y": "4.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "22.25",
				"y": "0.8",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "9.7",
				"height": "1.2"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "9.1",
				"y": "12.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "2",
				"y": "11",
				"-fill": "#FF0000",
				"width": "6.8",
				"height": "1.2"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "4",
				"y": "13",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "3.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "3.1",
				"y": "14.25",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "3.8"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "4.25",
				"y": "18.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.65",
				"height": "1"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "7",
				"y": "14.3",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.8"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "1.15",
				"y": "1.8",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_20_",
			"rect": {
				"x": "-0.35",
				"y": "9.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "10.2",
				"height": "1.2"
			}
		},
		{
			"id": "boite_21_",
			"rect": {
				"x": "4.1",
				"y": "2.9",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.7",
				"height": "1.2"
			}
		},
		{
			"id": "boite_22_",
			"rect": {
				"x": "3.05",
				"y": "4",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_23_",
			"rect": {
				"x": "4.05",
				"y": "7.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.9",
				"height": "1"
			}
		},
		{
			"id": "boite_24_",
			"rect": {
				"x": "9.8",
				"y": "3.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_25_",
			"rect": {
				"x": "2.35",
				"y": "0.8",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "16.55",
				"height": "1.2"
			}
		},
		{
			"id": "boite_26_",
			"rect": {
				"x": "1.1",
				"y": "12.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_27_",
			"rect": {
				"x": "19.05",
				"y": "12.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "8.05"
			}
		},
		{
			"id": "boite_28_",
			"rect": {
				"x": "12.05",
				"y": "10.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "6.8",
				"height": "1.2"
			}
		},
		{
			"id": "boite_29_",
			"rect": {
				"x": "14.5",
				"y": "13.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.55",
				"height": "1.2"
			}
		},
		{
			"id": "boite_30_",
			"rect": {
				"x": "13.45",
				"y": "14.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_31_",
			"rect": {
				"x": "14.45",
				"y": "17.45",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.649",
				"height": "1"
			}
		},
		{
			"id": "boite_32_",
			"rect": {
				"x": "17.15",
				"y": "14.3",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "3.3"
			}
		},
		{
			"id": "boite_33_",
			"rect": {
				"x": "11.25",
				"y": "12.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_34_",
			"rect": {
				"x": "19.1",
				"y": "0.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "10.1"
			}
		},
		{
			"id": "boite_35_",
			"rect": {
				"x": "17.15",
				"y": "3.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_36_",
			"rect": {
				"x": "13.95",
				"y": "3.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "3",
				"y": "12",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "23",
				"y": "3",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "22",
				"y": "12",
				"width": "1",
				"height": "1"
			}
		}
	],
	[
		{
			"rect": {
				"x": "26.85",
				"y": "17.05",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"width": "1.05",
				"height": "1.05"
			},
			"id": "badGuy"
		},
		{
			"rect": {
				"x": "4.1",
				"y": "17.05",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"width": "1.05",
				"height": "1.05"
			},
			"id": "badGuy"
		},
		{
			"rect": {
				"x": "13",
				"y": "8.85",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "0.996",
				"height": "3.23"
			},
			"id": "boite"
		},
		{
			"rect": {
				"x": "13.95",
				"y": "7.9",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1.991",
				"height": "1.17"
			},
			"id": "boite_7_"
		},
		{
			"rect": {
				"x": "15.85",
				"y": "8.85",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "0.996",
				"height": "2.173"
			},
			"id": "boite_8_"
		},
		{
			"rect": {
				"x": "14.2",
				"y": "11.95",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "5",
				"height": "1"
			},
			"id": "boite_10_"
		},
		{
			"rect": {
				"x": "26.85",
				"y": "2",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"width": "1.05",
				"height": "1.05"
			},
			"id": "badGuy_2_"
		},
		{
			"rect": {
				"x": "19",
				"y": "7.05",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "0.995",
				"height": "4.845"
			},
			"id": "boite_6_"
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "8.75",
				"y": "17.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "14.5",
				"height": "0.851"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "21.25",
				"y": "5.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "12",
				"y": "4.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "9.45",
				"height": "0.85"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "11.1",
				"y": "6.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "12",
				"y": "14.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "9.45",
				"height": "0.85"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "10",
				"y": "2.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "13.05",
				"height": "0.85"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "8.95",
				"y": "2.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "13.149"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "23",
				"y": "4.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "13.15"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "7",
				"y": "2.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "17.15"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "8.15",
				"y": "19",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "15.85",
				"height": "1.1"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "25.05",
				"y": "1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "17.15"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "9.15",
				"y": "0.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "15.85",
				"height": "0.85"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "14.35",
				"y": "6",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.1",
				"height": "1.2"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "13",
				"y": "7.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "4.85"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "29.1",
				"y": "14",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"width": "0.9",
				"height": "1"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "19.1",
				"y": "8.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "4.7"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "14.2",
				"y": "12.85",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.1",
				"height": "1.2"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "2",
				"y": "13.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"width": "0.9",
				"height": "1"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "12.15",
				"y": "3.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "5",
				"y": "11.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "9.9",
				"y": "11.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.3",
				"height": "0.851"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "22.05",
				"y": "10.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.95",
				"height": "0.85"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "5",
				"y": "17",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "4.9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "12",
				"y": "14.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "17.95",
				"y": "8.25",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.149",
				"height": "0.85"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "12",
				"y": "13.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "0.85"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "12",
				"y": "16",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "12",
				"y": "11.85",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.851"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "11.05",
				"y": "6",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "1.9"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "11.05",
				"y": "5.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "11.05",
				"y": "4.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "19.05",
				"y": "4.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "19.05",
				"y": "5.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "19.05",
				"y": "6.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "24.9",
				"y": "10.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.3",
				"height": "0.85"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "26.25",
				"y": "17",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "25.05",
				"y": "17.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.851"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "22.2",
				"y": "17.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.899",
				"height": "0.851"
			}
		},
		{
			"id": "boite_20_",
			"rect": {
				"x": "10",
				"y": "17",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "2.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_21_",
			"rect": {
				"x": "12",
				"y": "12.9",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_22_",
			"rect": {
				"x": "11.9",
				"y": "8.25",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "3.3",
				"height": "0.85"
			}
		},
		{
			"id": "boite_23_",
			"rect": {
				"x": "14.9",
				"y": "8.25",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "3.3",
				"height": "0.85"
			}
		},
		{
			"id": "boite_24_",
			"rect": {
				"x": "20.85",
				"y": "15.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "boite_25_",
			"rect": {
				"x": "20.95",
				"y": "14.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.25",
				"height": "0.85"
			}
		},
		{
			"id": "boite_26_",
			"rect": {
				"x": "20.9",
				"y": "16.25",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.149",
				"height": "0.85"
			}
		},
		{
			"id": "boite_27_",
			"rect": {
				"x": "20.85",
				"y": "12.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.851"
			}
		},
		{
			"id": "boite_28_",
			"rect": {
				"x": "20.9",
				"y": "13.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.149",
				"height": "0.85"
			}
		},
		{
			"id": "boite_29_",
			"rect": {
				"x": "20.9",
				"y": "11.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.149",
				"height": "0.851"
			}
		},
		{
			"id": "boite_30_",
			"rect": {
				"x": "19.05",
				"y": "7.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1.15",
				"height": "0.85"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "29.95",
				"y": "17.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"width": "0.899",
				"height": "0.899"
			}
		},
		{
			"id": "boite_31_",
			"rect": {
				"x": "27.1",
				"y": "11.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "boite_32_",
			"rect": {
				"x": "3.9",
				"y": "12",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "3",
				"y": "18.25",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"width": "0.9",
				"height": "0.9"
			}
		}
	],
	[
		{
			"rect": {
				"x": "4.4",
				"y": "11.85",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "7.1",
				"height": "0.851"
			},
			"id": "boite"
		},
		{
			"rect": {
				"x": "20.85",
				"y": "12.8",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "8.2",
				"height": "0.851"
			},
			"id": "boite_1_"
		},
		{
			"rect": {
				"x": "4.15",
				"y": "3",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			},
			"id": "boite_2_"
		},
		{
			"rect": {
				"x": "4.2",
				"y": "16.05",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "24.649",
				"height": "0.851"
			},
			"id": "boite_3_"
		},
		{
			"rect": {
				"x": "20",
				"y": "5.75",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "7"
			},
			"id": "boite_4_"
		},
		{
			"rect": {
				"x": "3.2",
				"y": "4",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "7.95"
			},
			"id": "boite_5_"
		},
		{
			"rect": {
				"x": "29.05",
				"y": "3.8",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "9"
			},
			"id": "boite_6_"
		},
		{
			"rect": {
				"x": "13.2",
				"y": "3.9",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "10"
			},
			"id": "boite_7_"
		},
		{
			"rect": {
				"x": "17.95",
				"y": "3.75",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "11.05"
			},
			"id": "boite_8_"
		},
		{
			"rect": {
				"x": "18.9",
				"y": "2.9",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "10",
				"height": "0.85"
			},
			"id": "boite_9_"
		},
		{
			"rect": {
				"x": "12.25",
				"y": "17.85",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "9",
				"height": "0.851"
			},
			"id": "boite_10_"
		},
		{
			"rect": {
				"x": "20.05",
				"y": "17",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "7.101",
				"height": "0.85"
			},
			"id": "boite_11_"
		},
		{
			"rect": {
				"x": "1.1",
				"y": "1.05",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			},
			"id": "boite_12_"
		},
		{
			"rect": {
				"x": "23.65",
				"y": "1.1",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "8.199",
				"height": "0.85"
			},
			"id": "boite_13_"
		},
		{
			"rect": {
				"x": "24",
				"y": "8",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"width": "0.9",
				"height": "0.9"
			},
			"id": "badGuy"
		},
		{
			"rect": {
				"x": "11.45",
				"y": "5.9",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			},
			"id": "boite_14_"
		},
		{
			"rect": {
				"x": "5.45",
				"y": "5.95",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			},
			"id": "boite_15_"
		},
		{
			"rect": {
				"x": "27.1",
				"y": "6",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			},
			"id": "boite_16_"
		},
		{
			"rect": {
				"x": "6.4",
				"y": "4.65",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			},
			"id": "boite_17_"
		},
		{
			"rect": {
				"x": "7.35",
				"y": "16.8",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "6",
				"height": "1.15"
			},
			"id": "boite_18_"
		},
		{
			"rect": {
				"x": "21.15",
				"y": "4.6",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			},
			"id": "boite_19_"
		},
		{
			"rect": {
				"x": "8",
				"y": "8.1",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"width": "0.9",
				"height": "0.9"
			},
			"id": "badGuy_1_"
		},
		{
			"rect": {
				"x": "14.4",
				"y": "18.65",
				"_fill-rule": "evenodd",
				"_clip-rule": "evenodd",
				"_fill": "#FF0000",
				"width": "5.05",
				"height": "1.199"
			},
			"id": "boite_20_"
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "23.9",
				"y": "9.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "2",
				"y": "18.35",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "9",
				"height": "0.851"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "1.15",
				"y": "1.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "0.9",
				"y": "10.7",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7.95"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "31",
				"y": "2.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "14.05",
				"y": "1.1",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "2.1",
				"y": "1.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "13.95",
				"y": "18.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "7.1",
				"height": "0.851"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "21.05",
				"y": "9.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "23.95",
				"y": "1.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "13",
				"y": "1.85",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "2.1",
				"y": "10.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "10",
				"height": "0.85"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "30.85",
				"y": "10.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "7.95"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "27.15",
				"y": "5.05",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"width": "0.949",
				"height": "0.95"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "25.95",
				"y": "17.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "14.1",
				"y": "8.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "10.9",
				"y": "2.15",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "23",
				"y": "2.2",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "5.6",
				"y": "14.35",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"width": "0.95",
				"height": "0.95"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "13.15",
				"y": "12.95",
				"-fill-rule": "evenodd",
				"-clip-rule": "evenodd",
				"-fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "4.85",
				"y": "10.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "21.3",
				"y": "11.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "20.15",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"y": "1",
				"x": 2,
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "24.8",
				"y": "1.25",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "13.5",
				"y": "17.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.851"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "24.45",
				"y": "7.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.85",
				"height": "0.85"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "11.9",
				"y": "4.25",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "5.9",
				"y": "4.3",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "27.1",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "6.85",
				"y": "3",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "19.05",
				"y": "15.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.199"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "9.05",
				"y": "7.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.85",
				"height": "0.85"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "9.45",
				"y": "15.75",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "26.75",
				"y": "13.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.9",
				"height": "1.149"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "26.75",
				"y": "14.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.9",
				"height": "1.149"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "1.5",
				"y": "12",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.9",
				"height": "1.15"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "1.5",
				"y": "13.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.9",
				"height": "1.149"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "1.5",
				"y": "14.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.9",
				"height": "1.149"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "21.15",
				"y": "2.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "23.75",
				"y": "17",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "4.9",
				"y": "17.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "10.15",
				"y": "3.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "20.05",
				"y": "1.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "8.05",
				"y": "14.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "3.9",
				"y": "11.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "10",
				"height": "0.85"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "17.85",
				"y": "15.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "11",
				"height": "0.851"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "7.95",
				"y": "2.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "18.9",
				"y": "2.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7.95"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "31.25",
				"y": "4.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "10"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "21.2",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "20.05",
				"y": "1.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "21.9",
				"y": "2.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "17.25",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "10"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "0.9",
				"y": "11.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "28.95",
				"y": "5",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "7.05",
				"y": "18.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "2.85",
				"y": "12.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "19.05",
				"y": "17.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "9.05",
				"y": "0.8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "25.15",
				"y": "7.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.899",
				"height": "0.9"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "1",
				"y": "6.8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "6.15",
				"y": "0.7",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "boite_20_",
			"rect": {
				"x": "5.95",
				"y": "13",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_21_",
			"rect": {
				"x": "10.05",
				"y": "4.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_22_",
			"rect": {
				"x": "1.9",
				"y": "8.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_23_",
			"rect": {
				"x": "15.05",
				"y": "6.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_24_",
			"rect": {
				"x": "22",
				"y": "11.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_25_",
			"rect": {
				"x": "30",
				"y": "14.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.949"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "24",
				"y": "19.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.9",
				"height": "0.9"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "10.15",
				"y": "3.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "6.2",
				"y": "13.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.85"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "3.95",
				"y": "18",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "3.9",
				"y": "11.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "10",
				"height": "0.85"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "7.95",
				"y": "2.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "30.95",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "10"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "21.2",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "21.9",
				"y": "2.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "19.05",
				"y": "0.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "10"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "0.95",
				"y": "10.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "28.95",
				"y": "5",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "14.95",
				"y": "6.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "19.15",
				"y": "14.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "15.9",
				"y": "16.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "10",
				"height": "0.851"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "16.9",
				"y": "5.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "9.05",
				"y": "0.8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "24.55",
				"y": "8.6",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.95",
				"height": "0.95"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "1",
				"y": "6.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "6",
				"y": "1.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "2.9",
				"y": "12.25",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "9.95",
				"y": "4.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_20_",
			"rect": {
				"x": "23.2",
				"y": "5.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.8",
				"height": "1.2"
			}
		},
		{
			"id": "boite_21_",
			"rect": {
				"x": "0.05",
				"y": "3",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_22_",
			"rect": {
				"x": "1.9",
				"y": "8.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_23_",
			"rect": {
				"x": "27.05",
				"y": "6.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_24_",
			"rect": {
				"x": "21.15",
				"y": "11.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.199"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "21.85",
				"y": "18",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.95",
				"height": "0.95"
			}
		},
		{
			"id": "boite_25_",
			"rect": {
				"x": "28.15",
				"y": "15.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.95"
			}
		},
		{
			"id": "boite_27_",
			"rect": {
				"x": "14.15",
				"y": "14",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "badGuy_2_",
			"rect": {
				"x": "9.75",
				"y": "15.3",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "0.95",
				"height": "0.95"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "14.95",
				"y": "2.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "5.9",
				"y": "9.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "22.9",
				"y": "5.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.899",
				"height": "0.85"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "4.95",
				"y": "7.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "7.85",
				"y": "11.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.2",
				"height": "0.851"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "23.05",
				"y": "1.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "0.75",
				"y": "1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "14.3",
				"height": "1"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "0.05",
				"y": "11.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.1",
				"height": "0.851"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "15.1",
				"y": "8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "22.25",
				"y": "3.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "23.95",
				"y": "9.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "14.1",
				"y": "4.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "21.75",
				"y": "11.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.95",
				"height": "0.851"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "0.05",
				"y": "13.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "8.1",
				"height": "0.85"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "8.9",
				"y": "14.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6.1",
				"height": "0.851"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "16",
				"y": "13.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.9",
				"height": "0.851"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "7.95",
				"y": "16",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.899",
				"height": "0.85"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "0.15",
				"y": "18",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9.95",
				"height": "0.85"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "15.15",
				"y": "0.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "15.15",
				"y": "5.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "7.8",
				"height": "1.2"
			}
		},
		{
			"id": "boite_20_",
			"rect": {
				"x": "0.95",
				"y": "2.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "11",
				"height": "1.2"
			}
		},
		{
			"id": "boite_21_",
			"rect": {
				"y": "7.85",
				"x": 0,
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "5.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_22_",
			"rect": {
				"x": "0.1",
				"y": "5",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "13.35",
				"height": "1"
			}
		},
		{
			"id": "boite_23_",
			"rect": {
				"x": "16.05",
				"y": "9.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "15",
				"y": "16",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "30",
				"y": "4.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "boite_24_",
			"rect": {
				"x": "25.05",
				"y": "6.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6.8",
				"height": "1.2"
			}
		},
		{
			"id": "boite_25_",
			"rect": {
				"x": "27.15",
				"y": "13.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6",
				"height": "1.2"
			}
		},
		{
			"id": "boite_26_",
			"rect": {
				"x": "0.95",
				"y": "14.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "6.95",
				"height": "1.2"
			}
		},
		{
			"id": "boite_27_",
			"rect": {
				"x": "19",
				"y": "15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "14.05",
				"height": "1.2"
			}
		},
		{
			"id": "boite_28_",
			"rect": {
				"x": "17.85",
				"y": "17.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "12.7",
				"height": "0.9"
			}
		}
	],
	[
		{
			"id": "boite",
			"rect": {
				"x": "10.85",
				"y": "2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_1_",
			"rect": {
				"x": "30.05",
				"y": "0.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7.95"
			}
		},
		{
			"id": "boite_2_",
			"rect": {
				"x": "14.95",
				"y": "1.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "11.05"
			}
		},
		{
			"id": "boite_3_",
			"rect": {
				"x": "19.05",
				"y": "12.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_4_",
			"rect": {
				"x": "18.95",
				"y": "0.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "9"
			}
		},
		{
			"id": "boite_5_",
			"rect": {
				"x": "1.9",
				"y": "10.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "9",
				"height": "0.85"
			}
		},
		{
			"id": "boite_6_",
			"rect": {
				"x": "21.05",
				"y": "10.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "10",
				"height": "0.85"
			}
		},
		{
			"id": "boite_7_",
			"rect": {
				"x": "10.85",
				"y": "12.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "7"
			}
		},
		{
			"id": "boite_8_",
			"rect": {
				"x": "2.85",
				"y": "3.75",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.05"
			}
		},
		{
			"id": "boite_9_",
			"rect": {
				"x": "15.1",
				"y": "13.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "badGuy",
			"rect": {
				"x": "4.55",
				"y": "4.15",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "boite_10_",
			"rect": {
				"x": "4.8",
				"y": "5.5",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "1.3"
			}
		},
		{
			"id": "boite_11_",
			"rect": {
				"x": "3.8",
				"y": "2.8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "2",
				"height": "1.15"
			}
		},
		{
			"id": "boite_12_",
			"rect": {
				"x": "5.7",
				"y": "3.75",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "2.15"
			}
		},
		{
			"id": "boite_13_",
			"rect": {
				"x": "4.05",
				"y": "7.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.7",
				"height": "1.15"
			}
		},
		{
			"id": "boite_14_",
			"rect": {
				"x": "29.05",
				"y": "14",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.05"
			}
		},
		{
			"id": "badGuy_1_",
			"rect": {
				"x": "27.75",
				"y": "14.35",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "boite_15_",
			"rect": {
				"x": "26.9",
				"y": "15.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "1.1"
			}
		},
		{
			"id": "boite_16_",
			"rect": {
				"x": "26.95",
				"y": "13",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "2.1",
				"height": "1.15"
			}
		},
		{
			"id": "boite_17_",
			"rect": {
				"x": "25.95",
				"y": "14.05",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "2.15"
			}
		},
		{
			"id": "boite_18_",
			"rect": {
				"x": "25.1",
				"y": "18.1",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.851",
				"height": "1.15"
			}
		},
		{
			"id": "boite_19_",
			"rect": {
				"x": "7.65",
				"y": "2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "5.95"
			}
		},
		{
			"id": "boite_20_",
			"rect": {
				"x": "22.05",
				"y": "4.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "2.9"
			}
		},
		{
			"id": "badGuy_2_",
			"rect": {
				"x": "23.5",
				"y": "5.55",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "boite_21_",
			"rect": {
				"x": "25.05",
				"y": "5.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "1.65"
			}
		},
		{
			"id": "boite_22_",
			"rect": {
				"x": "23",
				"y": "4",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "2.2",
				"height": "1.3"
			}
		},
		{
			"id": "boite_23_",
			"rect": {
				"x": "23.35",
				"y": "7.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "3.7",
				"height": "1.15"
			}
		},
		{
			"id": "boite_24_",
			"rect": {
				"x": "27.05",
				"y": "3",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.85"
			}
		},
		{
			"id": "boite_25_",
			"rect": {
				"x": "7.05",
				"y": "14.8",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "3.05"
			}
		},
		{
			"id": "badGuy_3_",
			"rect": {
				"x": "5.45",
				"y": "15.7",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"width": "1",
				"height": "1"
			}
		},
		{
			"id": "boite_26_",
			"rect": {
				"x": "3.85",
				"y": "14.95",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "1.3"
			}
		},
		{
			"id": "boite_27_",
			"rect": {
				"x": "4.7",
				"y": "13.9",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "2.2",
				"height": "1.3"
			}
		},
		{
			"id": "boite_28_",
			"rect": {
				"x": "3.05",
				"y": "17.85",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "4.05",
				"height": "1.15"
			}
		},
		{
			"id": "boite_29_",
			"rect": {
				"x": "2",
				"y": "13.2",
				"fill-rule": "evenodd",
				"clip-rule": "evenodd",
				"fill": "#FF0000",
				"width": "1",
				"height": "4.75"
			}
		}
	]
];

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */

var pressedKey_str,
    lastPressedKey_str;

document.addEventListener('keydown', function (evt) {
    lastPressedKey_str = pressedKey_str = evt.key;
});
document.addEventListener ('keyup', function (evt) {
    if (pressedKey_str === evt.key) {
        pressedKey_str = null;
    }
});
module.exports = {
    get pressedKey() {
        return pressedKey_str;
    },
    get lastPressedKey() {
        return lastPressedKey_str;
    }
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */


var preventDefaults = function (evt) {
    evt.preventDefault();
};

var
    position_point = null,
    app_el = document.getElementById('game_js'),
    setCoordinates = function (evt) {
        var isMouse_bool = !evt.changedTouches;
        if (isMouse_bool) {
            position_point = {x: evt.clientX, y: evt.clientY};
        } else {
            var touch = evt.changedTouches[0];
            position_point = {x: touch.clientX, y: touch.clientY};
        }
    },
    stopListening = function (evt) {
        evt.preventDefault();
        app_el.removeEventListener("mousemove", mouseMove);
        app_el.removeEventListener("touchMove", mouseMove);
        position_point = null;
    },
    mouseMove = function (evt) {
        evt.preventDefault();
        setCoordinates(evt);
    },
    mouseDown = function (evt) {
        evt.preventDefault();
        app_el.addEventListener("mousemove", mouseMove);
        setCoordinates(evt);
    };
app_el.addEventListener("mouseleave", stopListening);
app_el.addEventListener("touchmove", mouseMove);
app_el.addEventListener("mousedown", mouseDown);
app_el.addEventListener("touchstart", mouseDown);
app_el.addEventListener("mouseup", stopListening);
app_el.addEventListener("touchend", stopListening);

module.exports = {
    get position() {
       return position_point;
    }
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 29/04/2017.
 */


module.exports = {
    multiply: function (hex, percent_dec) {
        var
            hexToRgb = function (hex) {
                var res = hex.match(/[a-f0-9]{2}/gi);
                return res && res.length === 3
                    ? res.map(function (v) {
                        return parseInt(v, 16)
                    })
                    : null;
            },
            rgbToRGBA = function (rgb_array) {
                return ('rgb(' + rgb_array.join(',') + ')');
            },
            rgb_array = hexToRgb(hex),
            result_array = [];
        rgb_array.forEach(function (element, index) {
            result_array.push(Math.round(Number(element) * percent_dec));
        });
        return rgbToRGBA(result_array);
    }
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/20/2017.
 */





__webpack_require__(28);
__webpack_require__ (29);


  var  languageChoice = __webpack_require__(26),
    Labels = __webpack_require__(3),
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
            Obstacle = __webpack_require__(23),
            Goodie = __webpack_require__(22),
            BadGuy = __webpack_require__(21),
            PlayerAvatar = __webpack_require__(13),
            Config = __webpack_require__(0),
            LevelOverPopup = __webpack_require__(27),
            QuestionPopup = __webpack_require__(14),
            GameOverPopup = __webpack_require__(25),
            IntervalManager = __webpack_require__(7),
            ScoreManager = __webpack_require__(8),
            Timer = __webpack_require__(20),
            LiveManager = __webpack_require__(12),
            LevelCounter = __webpack_require__(19),
            playSound = __webpack_require__(4),
            ObjectlistManager = __webpack_require__(2),
            LevelsManager = __webpack_require__(24),
            Languages = __webpack_require__ (11),
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

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(36)(undefined);
// imports


// module
exports.push([module.i, "@keyframes fade {\r\n    0% {\r\n        opacity: 0;\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes wipeFromRight_kf {\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate(-15px, 0);\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        transform: translate(0, 0);\r\n    }\r\n}\r\n\r\n@keyframes wipeFromLeft_kf  {\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate(15px, 0);\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        transform: translate(0, 0);\r\n    }\r\n}\r\n\r\n.wipeFromRight {\r\n    animation: wipeFromRight_kf .5s;\r\n}\r\n\r\n.wipeFromLeft {\r\n    animation: wipeFromLeft_kf .5s;\r\n}\r\n\r\nhtml, body {\r\n    position: fixed;\r\n    height: 100%;\r\n    width: 100%\r\n}\r\n\r\nbody {\r\n    margin: 0;\r\n    touch-action: none;\r\n    height: 99%;\r\n    background-color: #0071c0;\r\n\r\n}\r\n\r\n#linguagoApplication .languageChoice_popup .button[aria-disabled=true] {\r\n    pointer-events: none;\r\n    opacity: .8;\r\n}\r\n\r\n\r\n#linguagoApplication .pauseButton {\r\n    pointer-events: none;\r\n}\r\n#linguagoApplication.playing .pauseButton {\r\n    pointer-events:auto;\r\n}\r\n\r\n\r\n\r\n\r\n#linguagoApplication {\r\n    height: 100%;\r\n    width: 100%;\r\n    font-family: \"Lucida Grande\", \"Lucida Sans Unicode\", \"Lucida Sans\", Geneva, Verdana, sans-serif;\r\n}\r\n\r\n#linguagoApplication *:focus {\r\n    outline: none;\r\n}\r\n\r\n#linguagoApplication .button {\r\n    cursor: pointer;\r\n    display: block;\r\n}\r\n\r\n#linguagoApplication .button:focus .background {\r\n    stroke:white;\r\n    stroke-width: .5px;\r\n}\r\n\r\n#linguagoApplication .button:hover .background,\r\n#linguagoApplication .button:focus .background {\r\n    opacity: .9;\r\n}\r\n\r\n#linguagoApplication .button[aria-selected='true'] .background {\r\n    opacity: .2;\r\n}\r\n\r\n.question_popup ul {\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.question_popup ul li {\r\nmargin:0;\r\n}\r\n\r\n#linguagoApplication svg {\r\n    user-select: none;\r\n    background: #0071c0;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n#linguagoApplication #background {\r\n    fill: #0071c0;\r\n}\r\n\r\n.question_popup {\r\n    font-family: \"Lucida Grande\", \"Lucida Sans Unicode\", \"Lucida Sans\", Geneva, Verdana, sans-serif;\r\n    width:170px;\r\n    position: absolute;\r\n    min-height:80px;\r\n    background-color: #ffffff;\r\n    padding: 0;\r\n}\r\n\r\n.pauseButtonTriggered .question_popup  .answer  {\r\n    pointer-events: none;\r\n}\r\n\r\n\r\n.question_popup .question_title, .question_popup .answer {\r\n    font-size: 1em;\r\n    padding: 0 20px;\r\n    color: #0071bc;\r\n    display: block;\r\n}\r\n\r\n\r\n.question_popup .question_title {\r\n    margin-top: 20px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.question_popup {\r\n    border-radius: 30px;\r\n    padding-bottom: 30px;\r\n    border:1px solid #ffffff;\r\n    line-height: 15px;\r\n    font-size: 15px;\r\n}\r\n\r\n.question_popup:before {\r\n    content: ' ';\r\n\r\n    position: absolute;\r\n    display: block;\r\n    height: 50px;\r\n    width: 27px;\r\n    z-index: 1;\r\n    top: 40%;\r\n    background-size: 100%;\r\n    background-image: url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2016.0.3%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-//W3C//DTD%20SVG%201.1//EN%22%20%22http%3A//www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd%22%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20width%3D%2257.992px%22%20height%3D%22103.504px%22%20viewBox%3D%220%200%2057.992%20103.504%22%20enable-background%3D%22new%200%200%2057.992%20103.504%22%0A%09%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M57.166%2C0C51.855%2C22.842%2C32.707%2C44.544%2C1.79%2C25.105c0%2C32.864%2C46.357%2C36.039%2C55.375%2C74.989V0z%22/%3E%0A%3C/svg%3E%0A);\r\n}\r\n\r\n.question_popup:focus {\r\n    outline:none;\r\n}\r\n\r\n.question_popup.top:before {\r\n    top: 15px;\r\n}\r\n\r\n.question_popup .answers {\r\n    position:relative;\r\n    z-index: 10;\r\n}\r\n\r\n.question_popup.bottom:before {\r\n    top:auto;\r\n    bottom: 20px;\r\n}\r\n\r\n.question_popup.wipeFromRight:before {\r\n    left: -23px;\r\n}\r\n\r\n.question_popup.wipeFromLeft:before {\r\n\r\n    transform: scaleX(-1);\r\n    right: -26px;\r\n}\r\n\r\n.question_popup .answer {\r\n    cursor: pointer;\r\n    background: white;\r\n    border: 1px solid lightGrey;\r\n    border-left:none;\r\n    border-right:none;\r\n    margin:-1px 0 0 0;\r\n    text-align: left;\r\n    width: 100%;\r\n    animation: fade 1s;\r\n    transition: background .2s;\r\n}\r\n\r\n.question_popup .answer:hover, .question_popup .answer:focus {\r\n    color: white;\r\n    background: #0071bc;\r\n}\r\n\r\n#linguagoApplication .gameover_popup {\r\n    min-width: 200px;\r\n    top: 100px;\r\n    left: 100px;\r\n}\r\n\r\n\r\n.answer:focus,\r\n.answer:hover {\r\n    background-color: #0071bc;\r\n}\r\n\r\n#linguagoApplication .live_icon {\r\n    fill: 'red'\r\n}", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(38);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto);

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);

	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 38 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);