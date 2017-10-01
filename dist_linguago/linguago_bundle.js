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
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
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
        open:false,
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
 * @module
 * @description A bunch of utility functions to handle SVG's.
 *
 */

/**
 * An object describing a point on x and y axis.
 * @typeDef {Object} Point
 * @property {number} x The position on the x-axis
 * @property {number} y The position on the y-axis
 */

/**
 * A Dom Element object
 */



var

    deltaTransformPoint = function (matrix, point) {

        var dx = point.x * matrix.a + point.y * matrix.c + 0;
        var dy = point.x * matrix.b + point.y * matrix.d + 0;
        return {x: dx, y: dy};
    },
    decomposeMatrix = function (matrix) {

        // @see https://gist.github.com/2052247

        // calculate delta transform point
        var px = deltaTransformPoint(matrix, {x: 0, y: 1});
        var py = deltaTransformPoint(matrix, {x: 1, y: 0});

        // calculate skew
        var skewX = ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
        var skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));

        return {

            translateX: matrix.e,
            translateY: matrix.f,
            scaleX: Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
            scaleY: Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
            skewX: skewX,
            skewY: skewY,
            rotation: skewX // rotation is the same as skew x
        }
    },
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
            internalCurve_obj = getArc(centerX, centerY, holeRadius, endAngle, startAngle, true),
            intToExtPath_str = " L" + externalCurve_obj.startPoint + " ",
            extToIntPath_str = "L" + internalCurve_obj.startPoint + " ";
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
    /**
     * Computes the path of a pie slice.
     * @method
     * @todo centerX and centerY should be structured as a Point-object.
     * @param {number} centerX - The x coordinate of the center of the pie
     * @param {number} centerY - The y coordinate of the center of the pie
     * @param {number} radius - The radius of the slice
     * @param {number}  holeRadius - The radius of the hole (if slice is a doughnut)
     * @param {number}  p_startAngle - The start of the slice in degree.
     * @param {number}  p_endAngle - The end of the slice in degree.
     * @return {string} - the string to use as the "d"-attribute of an SVG path-element
     */
    getSliceAttribute: getSliceAttribute,

    /**
     * Returns an SVG-path element of a pie-slice
     * @todo centerX and centerY should be structured as a Point-object.
     * @param {number} centerX - The x coordinate of the center of the pie
     * @param {number} centerY - The y coordinate of the center of the pie
     * @param {number} radius - The radius of the slice
     * @param {number}  holeRadius - The radius of the hole (if slice is a doughnut)
     * @param {number}  p_startAngle - The start of the slice in degree.
     * @param {number}  p_endAngle - The end of the slice in degree.
     * @return {DOMElement} - An SVG path-element.
     */

    getSlice: function (centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle) {
        var path = createElement("path");
        path.setAttribute("d", getSliceAttribute(centerX, centerY, radius, holeRadius, p_startAngle, p_endAngle));
        return path;
    },
    /**
     * Draws a multiline text block based on a given width.
     * @todo params.x and params.y should be structured as a point-object
     * @todo params.color should be params.fill
     * @todo params that implement svg properties should be structured in a separate "format"-object.
     *
     * @param {DOMElement} parentSvg_el -The SVG-element where to draw the text.
     * @param {string} text_str  - The text
     * @param {Object} params  - Parameters of the text
     * @param {string=} params.forceLineBreakChar - If set, forces linebreak after the given string.
     * @param {number} params.width -Sets the width of the textblok.
     * @params {number} params.lineHeight - Sets the line height of the block
     * @param {string} params.color - The color of the text
     * @param {number} params.x - The x-position
     * @param {number} params.y - The y-position
     * @param {number} params.font-size - Implements the corresponding SVG-property
     * @param {string} params.text-anchor - Implements the corresponding SVG-property
     * @param {string=} params.stroke - Implements the corresponding SVG-property
     * @param {string=} params.stroke-width - Implements the corresponding SVG-property
     * @param {string=} params.font-weight - Implements the corresponding SVG-property
     *
     * @return {DOMElement} The SVG g-container of the textblock.
     *
     */
    getMultilineText: function (parentSvg_el, text_str, params) {
        var
            forceLineBreakChar = params.forceLineBreakChar,
            forceLineBreakBool,
            container_g = createElement('svg', {
                x: params.x,
                y: params.y
            }),

            line_num = 0,
            text_array = text_str.split(' '),
            createTextBlock = function () {
                var line_span = createElement('text', {
                    x: (params['text-anchor'] === 'middle') ? params.width / 2 : 0,
                    'width': params.width,
                    'text-anchor': params['text-anchor'],
                    'font-size': params['font-size'],
                    'fill': params.color,
                    'stroke': params.stroke || null,
                    'font-weight': params['font-weight'] || null,
                    'stroke-width': params['stroke-width'] || null,
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
            if (block_el.getComputedTextLength() > params.width || forceLineBreakBool) {
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
    /**
     * Allows a focused SVG-Element to be actionned by enter-key.
     * @param {DOMElement} svg_el -The svg-element
     * @param {function} fun -The function called when the key is clicked.
     *
     * @return {function} A cleanup function allowing to disable the enter-key. When called, this function removes all listeners.
     */

    simulateEnterClick: function (svg_el, fun) {
        var
            removeEnterClick = function () {
                svg_el.removeEventListener('focus', listenEnter);
                svg_el.removeEventListener('blur', stopListen);
            },
            handleKey = function (evt) {
                if (evt.key === "Enter") {
                    removeEnterClickremoveEnterClick();
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
        return removeEnterClick;

    },
    /**
     * Converts HTML-page coordinates to SVG coordinates.
     * @param {Point} point - The coordinates in the html-page.
     * @param {DOMElement} dom_svg - The svg container
     * @returns {Point} The corresponding coordinates in the SVG-container
     */
    convertCoordinateFromDOMToSVG: function (dom_svg, point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, point),
            converted_point = svg_point.matrixTransform(CTM.inverse());
        return PointConversion.SVGToPoint(converted_point);
    },
    /**
     * Converts SVG coordinates in HTML page coordinates.
     * @param {Point} svgCoordinate_point - The coordinates in the SVG-container
     * @param {DOMElement} dom_svg - The svg-container
     * @returns {Point} The corresponding coordinates in the HTML-page
     */
    convertCoordinateFromSVGToDOM: function (dom_svg, svgCoordinate_point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, svgCoordinate_point),
            converted_point = svg_point.matrixTransform(CTM),
            matrixRead = decomposeMatrix(CTM),
            point = {
                x: matrixRead.translateX + (svgCoordinate_point.x * matrixRead.scaleX),
                y: matrixRead.translateY + (svgCoordinate_point.y * matrixRead.scaleY)
            };
        return point;
    },
    applyAttributes: applyAttributes,
    createElement: createElement
};





/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 06/05/2017.
 * @module
 * @description Manages the pauses in the game (caused by popup displays, pause-button, ...)
 *
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
    /**
     *
     * @description Gets or sets wether the pause-pause-button is on or off.
     * @type {Boolean}
     */
    set pauseButton (boolean) {
        pauseButton_bool = !boolean;
        evaluatePause();
    },
    get pauseButton ()  {
        return pauseButton_bool;
    },
    /**
     * @type {Boolean}
     * @description Gets or sets wether the game is playing or not.
     */

    set playing   (boolean) {
        if (boolean === undefined) {
            noPopup_bool = !noPopup_bool;
        } else {
            noPopup_bool = boolean;
        }
        evaluatePause();
    },
    get playing () {
        return evaluatePause ();
    }

};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 10/04/2017.
 * @module
 * @description Keeps a list of all objects currently displayed in the game, sorted by kind ("badGuy", "Goodie",  "playerAvatar") .
 */
var list_obj = {disabled: []},
    ArrayUtils = __webpack_require__(6),
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
    /**
     * Creates a list for a new kind of objects
     * @method
     * @param {string} id_str - The name of the list
     * @param {array} array=[] -A list of objects to add into the new list
     * @return {array} -The list

     */
    createList: createList,

    /**
     * Gets a list based on the provided id.
     * @method
     *
     * @return {array} The list.
      */
    getList: getList,
    /**
     * Removes all the elements from the list and from the screen.
     *
     */
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
    /**
     * Adds an item to a given list
     * @param {string} listId_str -The name of the list
     * @param {object} item_obj The object to add.
     */
    pushItem: function (listId_str, item_obj) {
        getList(listId_str).push(item_obj);
    },
    /**
     * Removes an object from a list so that it has no impact on the game anymore.
     * @param {string} listId_str - The name of the list
     * @param {object} item_obj The object to disable.
     */
    disableItemFromList: function (listId_str, item_obj) {
        list_obj.disabled.push(item_obj);
        return createList(listId_str, ArrayUtils.remove(getList(listId_str), item_obj));
    }
};



/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 13/04/2017.
 * @module
 * @description Manages the loading and distribution of the labels used in the application.
 *
 *
 */
var labels_json,
    languages_json;

function loadJSON(url_str, callback_fun) {
    var xobj = new XMLHttpRequest();
    xobj.open('GET', url_str, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && Number (xobj.status) === 200) {
            callback_fun(xobj.responseText);
        }
    };
    xobj.send(null);
}

module.exports = {
    /**
     * @description Loads the labels in a given language.
     * @param {string} lg_str -  The language code od the labels to get.
     * @param {function} callback_fun - callback_fun - The callback called with the data as argument.
     */
    fetchLabels: function (lg_str, callback_fun) {
        loadJSON('dist_linguago/labels/labels_linguago/labels_linguago_' + lg_str + '.json',
            function (labels_data) {
                labels_json = JSON.parse(labels_data);
                callback_fun(labels_json);
            }
        );
    },
    /**
     * @description Loads the translations of the languages in a given language
     * @param {string} lg_str - The language of the translations
     * @param {function}  callback_fun - The callback called with the data as argument.
     */
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
    /**
     *
     * @description - Gets the translations of languages currently used by the game
     * @returns {Object} - The translations in JSON-format
     */
    getCurrentLanguages: function () {
        return languages_json;
    },
    /**
     *
     * @description - Gets the text of a label
     * @param labelId_str - The id identifying the text to fetch.
     * @returns {String} - The translation
     */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 04/05/2017.
 * @module
 * @descrition Preloads, loads, caches and plays the sounds used in the application.
 * @param fileName_str {string} - The name of the file, without the folder path and ".mp3" extension
 * @param forceNewAudio_bool {boolean} - Forces the app to load the sound again -even if the sound was already cached (allows sounds overlaps).
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
/* 6 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 12/03/2017.
 * @module
 * @description A bunch of utility functions used to modify arrays.
 *
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
    /**
     * Creates a flat copy of an array
     * @method
     * @param {array} array -The source array.
     * @return {array} -The copy
     */

    clone: clone,

    /**
     * Removes an element from an array
     * @method
     * @param {array} array -The source array.
     * @param {*} item The object to find and remove
     * @return {array} - A copy of the array without the elememnt given as attribute.
     */

    remove: function (array, item) {
        result_array = array.filter(function (element) {
            return element !== item;
        });
        return result_array;
    },

    /**
     * Randomly sets the order of the cells of an array
     * @param {array} array -The source array.
     * @return {array} - The shuffled array
     */

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

    /**
     * Converts the properties of an object into an array of value pairs with format {id:propertyName, value:propertyValue}.
     * @param {Object} obj -The source Object.
     * @return {Array<Object>} - The resulting array.
     */

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

    /**
     * Gets a random cel of an array
     * @method
     * @param {array} array -The source array.
     * @param {Boolean} remove_bool -Wether or not the selected cel should be removed from the source array.
     * @return {*} -The content of the cel.
     */

    getRandomCel: getRandomCel,

    /**
     *  Picks random items into an array.
     * @param source_array - The source array
     * @param items_num - The number of random items to get from the array
     * @returns {Array} The resulting selection
     */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module
 * @description This wrapper keeps a list of all intervals used in tha application in order to clean them.
 *
 *
 */


var interval_array = [];
module.exports = {
    /**
     * Cleans all intervals registred through this module.
     */
    clearAll: function () {
        interval_array.forEach(function (interval_api) {
            interval_api.clear();
        });
        interval_array = [];
    },
    /**
     * Wrapper: sets and registers an interval.
     * @param {function} fun - The interval's callback function.
     * @param {number} delay_num - The interval's delay.
     */
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
 * @module
 * @description This component manages the display of the score of the user
 */

var

    score_num = 0,
    display = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = score_num;
    };
    display (0);

module.exports = {
    /**
     * The score of the player
     * @readonly
     * @type number
     *
     */
    get score() {
        return score_num;
    },
    /**
     * Resets the score to 0
     *
     */
    reset: function () {
        score_num = 0;
        display (score_num);
    },
    /**
     * Add points to the score
      * @param {Number} num - The number of points to add.
     */
    add:function (num) {
       score_num += num;
       display (score_num);
    },
    /**
     * Adds 1 point to the score.
     */
    increment: function () {
        display(++score_num);
    }
};



/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description This component keeps track and displays the reamining lives of the player.
 *
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
    /**
     * Removes 1 life and updates the display. Calls onLivesLost callback when 0 is reached.
     *
     */
    decrement: function () {
        display(--lives_num);
        if (lives_num === 0) {
            onLivesLost_fun();
        }
    },
    /**
     * Adds 1 life and updates the display.
     */
    increment: function () {
        if (lives_num < LIVES_NUM) {
        display(++lives_num);
        }
    },
    /**
     * @type function
     * @description Sets the callback called when the counter reaches 0. (write-only).
     */
    set onLivesLost(fun) {
        onLivesLost_fun = fun;
    },
    /**
     * @type Number
     * @readonly
     * @description The maximum available lives.
     */
    get maxLives () {
      return LIVES_NUM;
    },
    /**
     * @type Number
     * @readonly
     * @description The number of remaining lives.
     */
    get lives (){
      return lives_num;
    },
    /**
     * Resets lives to the maximum value. Updates the display.
     */
    reset: function () {
        lives_num = LIVES_NUM;
        display(lives_num);
    }
};




/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 16/07/2017.
 */


/**
 * @module
 * @description Basic animations and transitions
 *
 */

module.exports =  {
    /**
     * @description Fades an element form 0 to 100 opacity
     * @param {DomElement} dom_el - The element to animate
     */
    fadeIn:function (dom_el){
        var opacity_num = 0.1,
            interval  = window.setInterval (function () {
              opacity_num *= 1.5;
              if (opacity_num >= 100) {
                  opacity_num = 100;
                  window.clearInterval (interval);
              }
                dom_el.setAttribute ('opacity', opacity_num);

        }, 50);
        dom_el.setAttribute ('opacity', opacity_num);
    }
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @module
 * @description This wrapper keeps a list of all timeouts used in tha application in order to clean them.
 *
 *
 */


var timout_array = [];
module.exports = {
    /**
     * Cleans all timeouts registred through this module.
     */
    clearAll: function () {
        timout_array.forEach(function (timeout_api) {
            timeout_api.clear();
        });
        timout_array = [];
    },
    /**
     * Wrapper: sets and registers a timeout.
     * @param {function} fun - The timeout's callback function.
     * @param {number} delay_num - The timeout's delay.
     * @todo replace private var "interval" by "timout"
     * @todo create a single module that handles both intervals and timeouts in order to avoid code duplication.
     */

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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 05/03/2017.
 */

"use Strict";

/**
 * @module
 * @description Tests whether a given point on the grid is already occupied by anotehr object.
 */

var
    Config = __webpack_require__(0),
    ObjectListManager = __webpack_require__(3),
    /**
     * @private
     * @param {string} itemType_str - The type of object to test.
     * @param {Point} point The x and y coordinates
     * @returns {booleans|*} false OR The object at a given point (if exists)
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
    /**
     * Test wether there is a goodie at the given coordinate

     * @param {Point} point The x and y coordinates
     * @returns {booleans|Object} false OR The goodie at the given point (if exists)
     */

    isGoodie: function (point) {
        return isItem("goodie", point);
    },

    /**
     * Test wether the player avatar is at the given coordinates
     * @param {Point} point The x and y coordinates
     * @returns {booleans|Object} false OR The player avatar at the given point (if exists)
     */
    isAvatar: function (point) {
        return isItem("playerAvatar", point);
    },
    /**
     * Test wether any object occupies the coordinates And if the coordinates are out of the stage.
     * @param {Point} point The x and y coordinates
     * @returns {boolean|string|Object} false OR "out of screen" OR  the object already occupying the given point (if exists)
     */

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 13/04/2017.
 */


var
    languages_array = __webpack_require__(16),
    ArrayUtils = __webpack_require__(6),
    languages_map = [],
    languagesClone_map,
    refresh = function () {
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 18/04/2017.
 */

var
    MovingObject = __webpack_require__(19),
    UserControls = __webpack_require__(18),
    QuestionPopup = __webpack_require__(15),
    IntervalManager = __webpack_require__(7),
    ScoreManager = __webpack_require__(8),
    CollisionManager = __webpack_require__(12),
    TimoutManager = __webpack_require__(11),
    SvgUtils = __webpack_require__(1),
    playSound = __webpack_require__(5),
    PauseManager = __webpack_require__(2),
    Configs = __webpack_require__(0),
    gridSize_num = Configs('stage').gridSize,
    started_bool = false,
    playerAvatar_obj,
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
                temptativeDirection_obj,
                temptativePosition_point;

            if (PauseManager.pauseButton) {
                temptativeDirection_obj = UserControls.getDirection(config.position);
                if (temptativeDirection_obj) {
                    temptativePosition_point = findPos(temptativeDirection_obj, gridSize_num);
                }

                var goodie = CollisionManager.isGoodie(temptativePosition_point);
                if (goodie) {
                    var remaining_num = goodie.remove();
                    if (remaining_num === 0) {
                        IntervalManager.clearAll();
                    }
                }
                forbidden_obj = CollisionManager.isOccupied(temptativePosition_point);
                if (forbidden_obj && forbidden_obj.open === true) {
                    forbidden_obj = null;
                }

                if (temptativeDirection_obj && !forbidden_obj) {
                    started_bool = true;
                    direction_obj = temptativeDirection_obj;
                    config.targetPosition = temptativePosition_point;
                } else {
                    if (
                        forbidden_obj &&
                        forbidden_obj.type === 'obstacle' &&
                        !forbidden_obj.blocked) {
                        PauseManager.playing = false;
                        config.changeFrame('#avatarQuestion');
                        QuestionPopup.open(forbidden_obj,
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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 */

var
    Labels = __webpack_require__(4),
    SvgUtils = __webpack_require__(1),
    ArrayUtils = __webpack_require__(6),
    TimeoutManager = __webpack_require__(11),
    playSound = __webpack_require__(5),
    Config = __webpack_require__(0),
    UserControls = __webpack_require__(18),
    gameStage_obj = Config("stage"),
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
        var
            INTERFACE_HEIGHT_NUM = 37,
            answers_array,
            margin_num = gridSize_num,
            answers_el = document.createElement('ul'),
            obstacleTL_point = SvgUtils.convertCoordinateFromSVGToDOM(
                Config('game').dom_el,
                {
                    x: obstacle_obj.position.x - margin_num,
                    y: INTERFACE_HEIGHT_NUM + obstacle_obj.position.y - margin_num
                }
            ),
            obstacleTR_point = SvgUtils.convertCoordinateFromSVGToDOM(
                Config('game').dom_el,
                {
                    x: obstacle_obj.position.x + obstacle_obj.position.width + margin_num,
                    y: INTERFACE_HEIGHT_NUM + obstacle_obj.position.y + margin_num
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
                    popup_el.style.top = Math.round(-15 + obstacleTL_point.y - size_rect.height) + 'px';
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
/* 16 */
/***/ (function(module, exports) {

module.exports = [{"id":"bg","label":"БЪЛГАРСКИ"},{"id":"cs","label":"čeština"},{"id":"da","label":"dansk"},{"id":"de","label":"Deutsch"},{"id":"et","label":"eesti"},{"id":"el","label":"ΕΛΛΗΝΙΚA"},{"id":"en","label":"English"},{"id":"es","label":"español"},{"id":"fr","label":"français"},{"id":"ga","label":"Gaeilge"},{"id":"it","label":"italiano"},{"id":"lv","label":"latviešu"},{"id":"lt","label":"lietuvių"},{"id":"hu","label":"magyar"},{"id":"hr","label":"hrvatski"},{"id":"mt","label":"Malti"},{"id":"nl","label":"Nederlands"},{"id":"pl","label":"polski"},{"id":"pt","label":"português"},{"id":"ro","label":"română"},{"id":"sk","label":"slovenčina"},{"id":"sl","label":"slovenščina"},{"id":"fi","label":"suomi"},{"id":"sv","label":"svenska"}]

/***/ }),
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/22/2017.
 * @module
 * @description Aggregates inputs from keyboard, mouse and touch in order to give a consistent representation of user inputs.
 *
 */


/**
 * An object describing a point on x and y axis.
 * @typeDef {Object} Point
 * @property {number} x The position on the x-axis
 * @property {number} y The position on the y-axis
 */

/**
 * An object describing a direction on x and y axis.
 * @typeDef {Object} Direction
 * @property {number} x  An integer ranging from -1 to 1 expressing the direction on the x-axis (-1 = left, 1= right, 0=no move)
 * @property {number} y An integer ranging from -1 to 1 expressing the direction on the y-axis (-1 = up, 1= down, 0=no move)
 */





var MouseControl = __webpack_require__(36),
    KeyControls = __webpack_require__(35),
    SvgUtils = __webpack_require__(1),
    directionFromTo = __webpack_require__(17),
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
    /**
     * @property onDirectionChange
     * @description - Sets a callback called when the user changes direction.
     * @type {function}
     */

    set onDirectionChange(fun) {
        onDirectionChange_fun = fun;
    },
    /**
     * @description - Gets the direction indepependently of the device used
     * @param {Point} reference_point -The reference point used to get a direction when comparing with the mouse or touch position.
     * @returns {Direction} -An object containing the direction to follow.
     *
     */
    getDirection: function (reference_point) {
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
        if (reference_point && stage_el && MouseControl.position) {

            var
                mouseSVG_point = SvgUtils.convertCoordinateFromDOMToSVG(stage_el, MouseControl.position),
                gridSize_num = Config('stage').gridSize;
            if (mouseSVG_point.x >= reference_point.x
                && mouseSVG_point.y >= reference_point.y
                && mouseSVG_point.x < reference_point.x + gridSize_num
                && mouseSVG_point.y < reference_point.y + gridSize_num) {
                direction_obj = {x: 0, y: 0};
            } else {
                direction_obj = directionFromTo({
                    x: reference_point.x + gridSize_num / 2,
                    y: reference_point.y + gridSize_num / 2
                }, mouseSVG_point);
            }
            addChangeInfo(direction_obj);
            return direction_obj;
        }

    }
};



/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/21/2017.
 */

var
    Config = __webpack_require__(0),
    IntervalManager = __webpack_require__(7),
    PauseManager = __webpack_require__(2),
    ObjectListManager = __webpack_require__(3),
    gridSize_num = Config('stage').gridSize,
    movingObjectsCounter_num = 0;


module.exports = {
    add: function (config) {
        var
            position_rect = config.position,
            move = function () {
                config.dom_el.setAttribute("x", position_rect.x);
                config.dom_el.setAttribute("y", position_rect.y);
            },
            updatePos = function (point) {
                for (var n in point) {
                    if (point.hasOwnProperty(n)) {
                        position_rect[n] = point[n];
                    }
                }
                if (config.dom_el) {
                    window.requestAnimationFrame(move);
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
/* 20 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 11/06/2017.
 */
// Source: https://gist.github.com/k-gun/c2ea7c49edf7b757fe9561ba37cb19ca
(function() {
    // helpers
    var regExp = function(name) {
        return new RegExp('(^| )'+ name +'( |$)');
    };
    var forEach = function(list, fn, scope) {
        for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
        }
    };

    // class list object with basic methods
    function ClassList(element) {
        this.element = element;
    }

    ClassList.prototype = {
        add: function() {
            forEach(arguments, function(name) {
                if (!this.contains(name)) {
                    this.element.className += this.element.className.length > 0 ? ' ' + name : name;
                }
            }, this);
        },
        remove: function() {
            forEach(arguments, function(name) {
                this.element.className =
                    this.element.className.replace(regExp(name), '');
            }, this);
        },
        toggle: function(name) {
            return this.contains(name)
                ? (this.remove(name), false) : (this.add(name), true);
        },
        contains: function(name) {
            return regExp(name).test(this.element.className);
        },
        // bonus..
        replace: function(oldName, newName) {
            this.remove(oldName), this.add(newName);
        }
    };

    // IE8/9, Safari
    if (!('classList' in Element.prototype)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                return new ClassList(this);
            }
        });
    }

    // replace() support for others
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
        DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
})();
module.exports = {};

/***/ }),
/* 21 */
/***/ (function(module, exports) {


(function() {
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(func) {
            func();
        };
}());


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description -A component displaying the number of levels the user has gone through
 *
 */



var

    display = function (level_num) {
        var
            text_text = document.getElementById('level');
        text_text.textContent = level_num;
    };
module.exports = {
    /**
     *
     * @param {number} num - The level to display
     */
    set: function (num) {
        display(num);
    }
};




/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 11/04/2017.
 */


var
    IntervalManager = __webpack_require__(7),
    PauseManager = __webpack_require__(2),
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
        text_el.textContent = remainTime_num!==undefined?remainTime_num:'';
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 26/02/2017.
 */


var Configs = __webpack_require__(0),
    ObjectListManager = __webpack_require__(3),
    SvgUtils = __webpack_require__(1),
    MovingObject = __webpack_require__(19),
    directionFromTo = __webpack_require__(17),
    PlayerAvatar = __webpack_require__(14),
    LivesManager = __webpack_require__(9),
    PauseManager = __webpack_require__(2),
    CollisionManager = __webpack_require__(12),
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
                        y: -2
                    };
                return function (vibration_num) {
                    if (vibration_num) {
                        move.x = -2 + vibration_num;
                        move.y = -2 + vibration_num;
                    } else {
                        move.x += STEP * direction.x;
                        move.y += STEP * direction.y;
                        if (Math.abs(move.y + 2) > STEP * 5) {
                            direction.y *= -1;
                        }
                        if (Math.abs(move.x + 2) > STEP * 10) {
                            direction.x *= -1;
                        }
                    }
                    window.requestAnimationFrame(function () {
                        config.dom_el.setAttribute('transform', 'translate(' + move.x + ',' + move.y + ')');
                    });
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
                direction_obj,
                playerAvatar_api = ObjectListManager.getList('playerAvatar')[0],
                forbidden_obj,
                temptativePosition_point,
                isMySelf = function () {
                    return forbidden_obj.config === config;
                },
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 25/02/2017.
 */

var
    Config = __webpack_require__(0),
    stageConfig = Config('stage'),
    ObjectListManager = __webpack_require__(3),
    SvgUtils = __webpack_require__(1),
    LiveManager = __webpack_require__(9),
    ScoreManager = __webpack_require__(8),
    playSound = __webpack_require__(5),

    CollisionManager = __webpack_require__(12),
    layer_g = SvgUtils.createElement('g'),
    onCollected_fun,
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'goodie',
    parent_el = layer_g,
    items_array = ObjectListManager.createList(ID_STR),
    add = function (point) {
        var
            config = JSON.parse(JSON.stringify(Config(ID_STR))),
            bonusLive_bool = Math.random() < (LiveManager.maxLives - LiveManager.lives)/70,
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
                    value: bonusLive_bool ? "#earth" : "#goodie"
                }]
        );
        config.remove = function () {
            parent_el.removeChild(dom_el);
            items_array = ObjectListManager.disableItemFromList(ID_STR, config);
               playSound('bon_2');
            if (!bonusLive_bool) {
                ScoreManager.increment();

            } else {
                LiveManager.increment();
            }

            if (items_array.length === 0 && onCollected_fun) {
                onCollected_fun();
            }
            console.log ("goodies : " , items_array);
            return items_array.length;
        };
        items_array.push(config);
        parent_el.appendChild(dom_el);
    };

stageConfig.dom_el.appendChild(layer_g);

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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 25/02/2017.
 */

var
    Config = __webpack_require__(0),
    stageConfig = Config('stage'),
    ObjectListManager = __webpack_require__(3),
    SvgUtils = __webpack_require__(1),
    ColorUtils = __webpack_require__(37),
    TimeoutManager = __webpack_require__(11),
    ArrayUtils = __webpack_require__(6),
    gridSize_num = stageConfig.gridSize,
    ID_STR = 'obstacle',
    layer_g = SvgUtils.createElement('g'),
    playSound = __webpack_require__(5),
    Languages = __webpack_require__(13),
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
                                "font-size": "9",
                                x: gridSize_num/2 + config.position.x + n * gridSize_num * Number(config.direction === 'width'),
                                y: 0.5  + textHeight_num-0.7 + config.position.y + n * gridSize_num * Number(config.direction === 'height')
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
                    config.open = true;
                    //ObjectListManager.disableItemFromList(ID_STR, config);
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 14/05/2017.
 * @module
 * @description Stores and distributes the different levels
 */
var
    levels_array = __webpack_require__(34),
    ArrayUtils = __webpack_require__(6),
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
    /**
     * @property remaining
     * @readonly
     * @description {number} The remaining available levels
     */
    get remaining() {
        return randomLevels_array.length;
    },
    /**
     *
     * @description Returns a random level
     * @return {Object} A JSON-description of a level
     */
    get: function (level_num) {
        if (level_num < 2) {
            return levels_array [level_num];
        } else {
            return getRandomCel();
        }
    }
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description Displays the screen ate the end of the game.
 * @param {function} p_callback_fun -The function called when the user closes the screen
 *
 */
var
    Labels = __webpack_require__(4),
    Config = __webpack_require__(0),
    ScoreManager = __webpack_require__(8),
    SvgUtils = __webpack_require__(1),
    Animation = __webpack_require__(10),
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
        Animation.fadeIn (popup_el);
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
                    'font-weight': '800',
                    'stroke': 'white',
                    'stroke-width': 0.001,
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @module
 * @description Manages the display of the language-menu when the user must select another language for the languages displayed in the answers-menu.
 */


var languages_array = __webpack_require__(16),
    Labels = __webpack_require__(4),
    Config = __webpack_require__(0),
    stage_el = Config('game').dom_el,
    Animation = __webpack_require__(10),
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
    var
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

    button_text.textContent = element.label;
    button_el.setAttribute('class', 'button');
    button_el.setAttribute('tabindex', 0);
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
    /**
     * Displays the language menu
     * @param {function} p_callBack_fun - The function called when the user has choosen his language;
     */
    display: function (p_callBack_fun) {
        callBack_fun = p_callBack_fun;
        stage_el.appendChild(dom_el);
        Animation.fadeIn (dom_el);
        dom_el.childNodes[0].focus ();
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
    /**
     * @method
     * @description The function called when the language of the popup changes. This method is called only once from outside this module : when the language is set to the page's language at the start of the application.
     * @todo Check if the first language selection can be integrated in this moduleso this method does not need to be exposed anymore.
     * @param {string} languageId_str - The selected language.
     */
    registerLanguage: registerLanguage
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description Displays the screen the end of each level.
 * @param {function} p_callback_fun -The function called when the user closes the screen
 *
 *
 */
var
    Labels = __webpack_require__(4),
    Config = __webpack_require__(0),
    stage_el = Config('game').dom_el,
    SvgUtils = __webpack_require__(1),
    Animation = __webpack_require__(10),
    callback_fun,
    continueButton_el,
    removeEnterClick_fun,
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
        Animation.fadeIn (popup_el);
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
        removeEnterClick_fun =  SvgUtils.simulateEnterClick(continueButton_el, closePopup);
        continueButton_el.addEventListener('click', closePopup);
        continueButton_el.addEventListener('touchstart', closePopup);
        document.body.addEventListener('keydown',listenKey);
    }
};




/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Jean-Baptiste on 06/05/2017.
 * @module
 * @description This componenent handles the state and display of the pause button. It is managed by PauseManager.
 */

var
    paused_bool = false,
    Config = __webpack_require__(0),
    PauseManager = __webpack_require__(2),
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
/* 32 */
/***/ (function(module, exports) {

module.exports = "  <svg id='game_js' viewBox=\"0 0 336 244\" preserveAspectRatio=\"xMidYMin\" width=\"336\" version=\"1.1\"\r\n         xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" height=\"244\">\r\n        <symbol id=\"linguagoLogo\" viewBox=\"0 -35.583 132.996 35.583\">\r\n            <path fill=\"#FDD302\"\r\n                  d=\"M81.623-10.017c1.916,0.468,2.642,0.572,3.574,0.572c0.932,0,0.005-4.517,0.005-4.517L81.623-10.017z\"/>\r\n            <path fill=\"#253B8C\" d=\"M93.93-2.671l-2.884,0.526c-0.769,0.123-1.446-0.479-0.761-1.89c0.685-1.412,2.171-2.427,2.171-2.427\r\n\t\tl2.911,2.699L93.93-2.671z\"/>\r\n            <path fill=\"#FDD302\"\r\n                  d=\"M92.59-4.653l-0.438,0.365c-0.229,0.191-0.261,0.533-0.069,0.763s0.533,0.261,0.763,0.07l0.438-0.365\"/>\r\n            <path fill=\"#D6B406\" d=\"M92.351-3.952c0.124,0.148,0.393,0.128,0.601-0.045c0.141-0.118,0.218-0.276,0.214-0.412\r\n\t\tc0.132,0.175,0.052,0.47-0.187,0.668c-0.242,0.202-0.557,0.226-0.701,0.052c-0.104-0.125-0.09-0.316,0.016-0.49\r\n\t\tC92.281-4.093,92.3-4.014,92.351-3.952\"/>\r\n            <path fill=\"#FDD302\"\r\n                  d=\"M97.047-8.467l0.438-0.365c0.229-0.191,0.571-0.16,0.763,0.07S98.408-8.191,98.179-8L97.74-7.634\"/>\r\n            <path fill=\"#D6B406\" d=\"M97.779-8.576c0.123,0.148,0.055,0.409-0.153,0.583c-0.142,0.118-0.311,0.165-0.444,0.136\r\n\t\tc0.148,0.162,0.454,0.136,0.691-0.062c0.243-0.202,0.323-0.507,0.179-0.68c-0.104-0.125-0.295-0.147-0.484-0.075\r\n\t\tC97.652-8.669,97.729-8.637,97.779-8.576\"/>\r\n            <path fill=\"#FDD302\" d=\"M92.24-18.146l7.162,13.708c0.894,1.697-1.904,4.025-3.441,2.864l-9.54-7.273\r\n\t\tc-2.825-2.235-0.003-9.437-0.003-9.437\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M94.295-7.248c-0.42-0.641-1.265-0.784-1.887-0.318c-0.623,0.465-0.787,1.362-0.367,2.003\r\n\t\ts1.266,0.784,1.888,0.318S94.715-6.606,94.295-7.248\"/>\r\n            <path fill=\"#22274F\" d=\"M93.349-4.672c0,0,0.033,0.013,0.095,0.031c0.062,0.019,0.15,0.039,0.263,0.047\r\n\t\tc0.111,0.008,0.246,0.005,0.386-0.031c0.14-0.033,0.284-0.102,0.41-0.193c0.062-0.042,0.127-0.099,0.182-0.151\r\n\t\tc0.057-0.054,0.105-0.114,0.145-0.177c0.078-0.128,0.115-0.263,0.129-0.378c0.015-0.116,0.009-0.212-0.004-0.279\r\n\t\tc-0.012-0.066-0.025-0.103-0.025-0.103l-0.028-0.002c0,0-0.019,0.035-0.046,0.092c-0.027,0.055-0.065,0.134-0.111,0.228\r\n\t\tc-0.046,0.091-0.101,0.189-0.163,0.291c-0.03,0.052-0.061,0.105-0.096,0.158c-0.036,0.056-0.073,0.099-0.122,0.147\r\n\t\tc-0.189,0.183-0.449,0.278-0.656,0.299c-0.104,0.013-0.191,0.007-0.252,0.003c-0.063-0.004-0.098-0.01-0.098-0.01L93.349-4.672z\"/>\r\n            <path fill=\"#22274F\" d=\"M96.867-7.728c0,0,0,0.037-0.008,0.098c-0.007,0.061-0.018,0.148-0.049,0.247\r\n\t\tc-0.058,0.2-0.199,0.438-0.413,0.591c-0.056,0.039-0.106,0.068-0.167,0.094c-0.059,0.025-0.116,0.046-0.172,0.065\r\n\t\tc-0.111,0.043-0.219,0.079-0.316,0.108c-0.102,0.028-0.186,0.051-0.244,0.067c-0.063,0.016-0.1,0.028-0.1,0.028l-0.003,0.028\r\n\t\tc0,0,0.034,0.02,0.097,0.044c0.063,0.024,0.156,0.048,0.273,0.055c0.115,0.007,0.256-0.005,0.396-0.058\r\n\t\tc0.069-0.027,0.138-0.065,0.2-0.111c0.063-0.043,0.129-0.098,0.182-0.151c0.113-0.107,0.207-0.236,0.265-0.368\r\n\t\tc0.062-0.13,0.089-0.262,0.101-0.373c0.012-0.111,0.009-0.203,0.001-0.268c-0.007-0.063-0.013-0.099-0.013-0.099L96.867-7.728z\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M94.125-7.105c-0.555-0.529-0.542-1.386,0.029-1.914c0.57-0.527,1.482-0.526,2.036,0.003\r\n\t\tc0.555,0.529,0.542,1.386-0.029,1.914C95.59-6.575,94.679-6.576,94.125-7.105\"/>\r\n            <path fill=\"#22274F\" d=\"M93.964-6.924c-0.243-0.292-0.677-0.332-0.97-0.089c-0.292,0.243-0.332,0.677-0.089,0.97\r\n\t\ts0.678,0.332,0.97,0.088C94.168-6.197,94.207-6.631,93.964-6.924\"/>\r\n            <path fill=\"#22274F\" d=\"M95.591-8.278c-0.243-0.292-0.677-0.332-0.97-0.089c-0.292,0.244-0.332,0.678-0.088,0.97\r\n\t\tc0.242,0.292,0.677,0.332,0.969,0.089C95.795-7.552,95.834-7.986,95.591-8.278\"/>\r\n            <path fill=\"#FFFFFF\"\r\n                  d=\"M93.838-10.761c-3.259-0.714-3.18,2.557-3.18,2.557C91.082-8.77,92.852-10.449,93.838-10.761\"/>\r\n            <path fill=\"#EA7D00\" d=\"M94.484-11.011l-0.582-0.09l-0.301-0.046c-0.111-0.01-0.225-0.023-0.336-0.029\r\n\t\tc-0.111,0-0.22-0.01-0.332-0.001c-0.111,0.005-0.223,0.012-0.334,0.031c-0.111,0.012-0.223,0.043-0.333,0.067\r\n\t\tc-0.109,0.036-0.22,0.067-0.324,0.117c-0.106,0.043-0.208,0.103-0.306,0.162l-0.144,0.098l-0.134,0.11\r\n\t\tc-0.084,0.078-0.164,0.16-0.236,0.248c-0.072,0.088-0.138,0.18-0.195,0.275c-0.117,0.191-0.206,0.394-0.273,0.6\r\n\t\tc-0.068,0.206-0.115,0.416-0.146,0.626c-0.014,0.105-0.025,0.211-0.033,0.317c-0.006,0.108-0.01,0.209-0.005,0.326l0.021,0.575\r\n\t\tl0.32-0.466c0.088-0.129,0.197-0.261,0.307-0.388c0.109-0.128,0.223-0.253,0.34-0.377c0.232-0.247,0.475-0.488,0.725-0.719\r\n\t\tc0.25-0.231,0.508-0.455,0.78-0.661c0.272-0.203,0.556-0.4,0.876-0.524L94.484-11.011z M93.268-10.518\r\n\t\tc-0.122,0.065-0.242,0.132-0.359,0.204c-0.293,0.182-0.574,0.384-0.849,0.594c-0.274,0.21-0.541,0.431-0.801,0.661\r\n\t\tc-0.13,0.115-0.258,0.232-0.384,0.354c-0.125,0.123-0.248,0.245-0.367,0.389l0.34,0.109c0.003-0.085,0.012-0.186,0.023-0.279\r\n\t\tc0.014-0.095,0.029-0.189,0.049-0.283c0.039-0.187,0.094-0.369,0.164-0.542c0.069-0.173,0.156-0.337,0.26-0.484\r\n\t\tc0.051-0.074,0.107-0.143,0.168-0.208c0.061-0.065,0.126-0.123,0.193-0.177l0.105-0.076l0.111-0.066\r\n\t\tc0.076-0.039,0.152-0.079,0.236-0.105c0.08-0.033,0.166-0.049,0.25-0.072c0.088-0.012,0.173-0.032,0.264-0.035\r\n\t\tc0.088-0.01,0.178-0.009,0.27-0.007c0.09-0.002,0.182,0.014,0.273,0.019C93.232-10.523,93.25-10.52,93.268-10.518\"/>\r\n            <path fill=\"#017BBC\" d=\"M99.837-1.528l-1.13,0.94c-1.078,0.897-2.68,0.751-3.578-0.328l-1.36-1.634\r\n\t\tc-0.079-0.095-0.065-0.236,0.028-0.315l4.691-3.905c0.096-0.079,0.236-0.066,0.315,0.029l1.36,1.634\r\n\t\tC101.063-4.028,100.915-2.426,99.837-1.528\"/>\r\n            <polygon fill=\"#0072BF\" points=\"85.48,-7.951 93.014,-28.665 77.5,-28.755 \t\"/>\r\n            <path fill=\"#FF00FF\" d=\"M12.236-3.931c1.451,0,2.902-0.193,4.063-0.193c1.258,0,2.709,0.193,3.531,0.193\r\n\t\tc0.581,0,0.774-0.145,0.774-0.242c0-0.194-0.193-0.339-0.581-0.436c-2.128-0.435-2.176-0.726-2.37-4.208\r\n\t\tc-0.048-0.822-0.048-4.982-0.048-9.384c0-4.741,0.048-9.723,0.097-10.642c0.146-1.983,0.242-3.387,0.677-3.918\r\n\t\tc0.532-0.678,1.838-1.21,5.998-1.21c2.564,0,3.822,0.097,4.547,0.242c1.112,0.193,2.031,1.209,2.999,2.999\r\n\t\tc0.242,0.436,0.532,0.678,0.726,0.678s0.097-0.678-0.097-1.21c-0.145-0.436-0.967-2.902-1.209-3.241\r\n\t\tc-0.29-0.387-0.629-0.483-0.822-0.483c-0.484,0-4.257-0.048-6.627,0.097c-2.467,0.097-6.095,0.242-7.546,0.242\r\n\t\tc-1.5,0-3.58-0.242-4.208-0.242c-0.581,0-0.968,0.097-0.968,0.338c0,0.194,0.436,0.34,0.822,0.388\r\n\t\tc2.177,0.388,2.419,1.112,2.564,2.563c0.193,1.983,0.193,5.176,0.193,11.9c0,6.578-0.048,10.013-0.145,11.561\r\n\t\tc-0.145,2.854-0.242,3.145-2.467,3.531c-0.532,0.097-0.677,0.242-0.677,0.436C11.462-4.076,11.704-3.931,12.236-3.931\"/>\r\n            <path fill=\"#00ACE4\" d=\"M26.684-16.444l-1.785-8.432c-0.075-0.322-0.099-0.57-0.099-0.793c0-0.694,0.322-0.918,1.016-0.918\r\n\t\tc0.446,0,0.645,0.075,0.794,0.149c-0.124-1.761-1.389-2.554-2.728-2.554c-1.488,0-2.653,0.893-2.653,2.975\r\n\t\tc0,0.472,0.075,1.018,0.199,1.612l1.686,7.96H26.684z M25.568-11.163c1.091,0,1.983-0.893,1.983-1.983\r\n\t\tc0-1.091-0.893-1.959-1.983-1.959s-1.959,0.868-1.959,1.959C23.609-12.056,24.478-11.163,25.568-11.163\"/>\r\n            <path fill=\"#FF9300\" d=\"M40.72-28.843v0.789c2.544,0.176,2.895,1.447,2.895,2.939v10.043c0,3.816-1.403,5.746-3.903,5.746\r\n\t\tc-3.158,0-5.351-2.105-6.097-4.298v-11.491c0-1.447,0.132-2.764,2.851-2.895v-0.834h-9.079v0.789\r\n\t\tc2.544,0.176,2.895,1.447,2.895,2.939v12.587c0,1.009-0.219,2.062-2.851,2.281v0.921l6.184,1.667v-4.254\r\n\t\tc0.79,1.842,3.465,4.254,6.755,4.254c6.184,0,6.579-5.526,6.579-7.983v-9.473c0-1.447,0.132-2.764,2.851-2.895v-0.834H40.72z\"/>\r\n            <path fill=\"#D6E000\" d=\"M49.606-32.544c0.823-0.576,1.974-0.959,3.509-0.959c2.413,0,4.332,1.288,5.264,5.428l0.548,2.521h-0.082\r\n\t\tc-1.234-2.248-3.098-3.344-5.072-3.344c-2.659,0-3.893,2.303-3.893,4.496c0,4.551,3.399,9.019,8.087,9.019\r\n\t\tc1.316,0,2.988-0.466,3.811-0.905L59.75-27.198c-0.576-3.016-1.343-4.797-2.604-5.922c-1.233-1.15-2.933-1.452-4.276-1.452\r\n\t\tc-1.508,0-2.961,0.411-3.729,0.987L49.606-32.544z M60.408-17.027c-0.494,0.247-1.48,0.576-2.687,0.576\r\n\t\tc-3.893,0-6.524-3.975-6.552-7.704c-0.027-1.535,0.466-3.674,2.988-3.674c2.357,0,4.77,3.099,5.291,5.867L60.408-17.027z\"/>\r\n            <path fill=\"#FFAE00\" d=\"M74.99-27.148c0-0.524,0.096-1.694-1.121-1.694c-0.979,0-1.146,0.812-1.146,1.6v0.381l-1.861-1.217\r\n\t\tc-0.739-0.478-1.359-0.764-1.98-0.764h-1.694c-0.645,0-1.36,0.191-2.124,0.836c-1.027,0.883-1.002,1.861-1.05,3.102l-0.239,7.208\r\n\t\tc-0.024,0.835,0.096,1.719,1.146,1.719c0.979,0,1.098-0.835,1.122-1.575l0.238-7.041c0.024-0.525,0.048-1.146,0.239-1.479\r\n\t\tc0.191-0.335,0.788-0.478,1.336-0.478h0.764c0.263,0,0.501,0.072,0.716,0.215l3.365,2.124v6.659c0,0.787,0.168,1.575,1.146,1.575\r\n\t\ts1.145-0.788,1.145-1.575V-27.148z\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M81.049-21.231l-2.676-7.611h-1.58l7.869,21.738h1.483l7.837-21.738h-1.58l-2.742,7.611H81.049z\r\n\t\t M89.177-19.941l-2.645,7.257c-0.517,1.516-0.806,2.612-1.129,3.838h-0.064c-0.322-1.258-0.677-2.387-1.128-3.773l-2.678-7.321\r\n\t\tH89.177z\"/>\r\n            <path fill=\"#FF5A19\" d=\"M100.939-31.036c0.871-0.516,2.773-0.871,4.128-0.871c2.322,0,4.032,1.033,4.709,4.193l0.258,1.354h-0.064\r\n\t\tc-1.226-1.612-2.645-2.354-4.515-2.354c-3.129,0-5.031,2.548-5.064,5.645c-0.031,5.192,3.709,10.353,10.579,10.353\r\n\t\tc2.226,0,4.161-0.419,5.837-1.097l-2.387-12.998c-0.548-2.902-1.451-5.482-3.321-6.998c-1.71-1.354-3.999-1.773-6.095-1.773\r\n\t\tc-2.129,0-4.064,0.387-5.161,1L100.939-31.036z M111.776-16.555c-0.354,0.161-1.032,0.29-1.678,0.29\r\n\t\tc-2.806,0-4.806-3.129-4.806-6.096c0-1.612,0.71-2.773,2.129-2.773c1.516,0,3.031,1.709,3.548,4.354L111.776-16.555z\"/>\r\n            <path fill=\"#FF9300\" d=\"M125.224-29.198c-4.192,0-7.481,3.097-7.481,8.031c0,5.225,3.45,8.289,7.74,8.289\r\n\t\tc4.482,0,7.514-3.257,7.514-7.998c0-5.807-4.031-8.322-7.74-8.322H125.224z M125.354-27.069c2.709,0,4.74,2.549,4.74,6.096\r\n\t\tc0,2.645-1.322,5.967-4.676,5.967c-3.322,0-4.773-3.096-4.773-6.063c0-3.419,1.935-5.999,4.676-5.999H125.354z\"/>\r\n            <path d=\"M82.038-10.475l0.969-0.613c0.787-0.823,2.218-4.304,1.098-4.101l-3.896,0.066C79.5-12.759,80.537-11.664,82.038-10.475\"/>\r\n            <path d=\"M92.168-19.072l-0.838-0.782c-0.996-0.554-3.768,0.985-3.287,2.018l0.872,1.163C91.11-17.287,92.015-17.319,92.168-19.072\"\r\n            />\r\n            <path fill=\"#FDD302\" d=\"M81.623-10.017l3.811-3.985c0.787-0.823,0.061-2.173-1.06-1.969l-4.683,0.849\r\n\t\tC78.982-12.759,80.121-11.206,81.623-10.017\"/>\r\n            <path fill=\"#FDD302\" d=\"M92.079-22.808l-5.598,4.921c-0.575,0.983,0.442,2.128,1.485,1.672l4.36-1.906\r\n\t\tC92.982-19.063,93.436-21.419,92.079-22.808\"/>\r\n            <path fill=\"#ADC80C\" d=\"M8.148-22.754c0,0,0.013,0.693-0.022,1.731c-0.016,0.52-0.042,1.125-0.079,1.772\r\n\t\tc-0.038,0.646-0.083,1.34-0.169,2.015c-0.013,0.083-0.022,0.169-0.038,0.248c-0.015,0.081-0.027,0.159-0.055,0.226\r\n\t\tc-0.019,0.052-0.057,0.106-0.063,0.099c-0.004-0.003,0.01-0.013,0.02-0.019c0.008-0.006,0.009-0.005-0.005-0.013\r\n\t\tc-0.026-0.012-0.08-0.048-0.131-0.09c-0.052-0.042-0.106-0.094-0.16-0.147c-0.107-0.109-0.213-0.229-0.319-0.35\r\n\t\ts-0.212-0.244-0.325-0.365l-0.051-0.05c-0.013-0.013-0.044-0.039-0.066-0.057c-0.048-0.039-0.087-0.067-0.134-0.096\r\n\t\tc-0.09-0.057-0.184-0.105-0.284-0.141c-0.199-0.072-0.422-0.1-0.644-0.063c-0.222,0.036-0.431,0.14-0.585,0.273\r\n\t\tc-0.156,0.132-0.265,0.283-0.345,0.424c-0.079,0.142-0.136,0.279-0.175,0.404c-0.082,0.253-0.114,0.466-0.137,0.639\r\n\t\tc-0.022,0.174-0.029,0.307-0.032,0.397s-0.005,0.139-0.005,0.139c-0.012,0.328,0.244,0.604,0.572,0.617\r\n\t\tc0.328,0.012,0.604-0.244,0.617-0.572c0.001-0.026,0-0.052-0.002-0.077l-0.001-0.016c0,0-0.004-0.039-0.011-0.11\r\n\t\tC5.509-16.006,5.501-16.111,5.5-16.24c-0.001-0.128,0.002-0.284,0.03-0.44c0.025-0.155,0.08-0.311,0.151-0.397\r\n\t\tc0.035-0.045,0.072-0.074,0.125-0.096c0.053-0.021,0.127-0.029,0.213-0.013c0.042,0.007,0.086,0.022,0.129,0.04\r\n\t\tc0.021,0.008,0.045,0.022,0.06,0.029c0.008,0.006,0.009,0.002,0.025,0.015l0.023,0.018l0.012,0.009l0.005,0.004\r\n\t\tc0.01,0.009-0.01-0.009-0.007-0.007l0.003,0.002c0.115,0.092,0.235,0.195,0.361,0.301s0.257,0.217,0.402,0.327\r\n\t\tc0.074,0.055,0.151,0.109,0.239,0.161c0.09,0.051,0.184,0.104,0.323,0.136c0.068,0.016,0.155,0.022,0.248,0.003\r\n\t\tc0.095-0.019,0.185-0.077,0.243-0.138c0.115-0.129,0.142-0.242,0.169-0.355c0.036-0.201,0.046-0.373,0.058-0.552\r\n\t\tc0.033-0.706,0.023-1.398,0.011-2.051c-0.014-0.651-0.037-1.258-0.061-1.778C8.216-22.063,8.148-22.754,8.148-22.754\"/>\r\n            <path fill=\"#ADC80C\" d=\"M16.853-22.754c0,0-0.068,0.69-0.114,1.73c-0.024,0.521-0.047,1.127-0.061,1.778\r\n\t\tc-0.013,0.652-0.022,1.345,0.011,2.051c0.011,0.179,0.021,0.352,0.057,0.552c0.027,0.113,0.055,0.226,0.17,0.355\r\n\t\tc0.058,0.061,0.147,0.119,0.243,0.138c0.093,0.02,0.18,0.013,0.249-0.003c0.139-0.032,0.233-0.085,0.323-0.136\r\n\t\tc0.088-0.052,0.165-0.106,0.239-0.161c0.146-0.109,0.277-0.22,0.402-0.327c0.126-0.106,0.246-0.209,0.361-0.301l0.002-0.002\r\n\t\tc0.003-0.002-0.017,0.016-0.007,0.007l0.006-0.004l0.012-0.009l0.023-0.018c0.017-0.012,0.017-0.009,0.026-0.015\r\n\t\tc0.014-0.007,0.039-0.021,0.06-0.029c0.042-0.018,0.086-0.033,0.129-0.04c0.085-0.016,0.16-0.007,0.213,0.013\r\n\t\tc0.053,0.022,0.089,0.051,0.125,0.096c0.071,0.087,0.126,0.242,0.151,0.397c0.027,0.156,0.031,0.312,0.03,0.44\r\n\t\tc-0.001,0.129-0.01,0.234-0.017,0.306c-0.007,0.072-0.011,0.11-0.011,0.11l-0.001,0.012c-0.032,0.327,0.208,0.618,0.535,0.649\r\n\t\tc0.327,0.032,0.618-0.208,0.65-0.534c0.002-0.026,0.003-0.055,0.002-0.08c0,0-0.001-0.048-0.005-0.139\r\n\t\tc-0.004-0.09-0.011-0.224-0.033-0.397c-0.022-0.173-0.055-0.386-0.136-0.639c-0.039-0.125-0.096-0.262-0.175-0.404\r\n\t\tc-0.08-0.142-0.188-0.292-0.345-0.424c-0.154-0.133-0.363-0.238-0.585-0.273c-0.222-0.037-0.445-0.009-0.644,0.063\r\n\t\tc-0.101,0.036-0.195,0.083-0.285,0.141c-0.047,0.029-0.085,0.058-0.134,0.096c-0.022,0.018-0.053,0.044-0.066,0.057l-0.052,0.05\r\n\t\tc-0.112,0.122-0.219,0.244-0.325,0.365c-0.106,0.121-0.212,0.241-0.319,0.35c-0.054,0.054-0.107,0.105-0.16,0.147\r\n\t\tc-0.051,0.042-0.105,0.078-0.131,0.09c-0.014,0.008-0.014,0.006-0.005,0.013c0.01,0.005,0.023,0.015,0.02,0.019\r\n\t\tc-0.006,0.007-0.045-0.047-0.063-0.099c-0.027-0.067-0.04-0.145-0.055-0.226c-0.016-0.079-0.025-0.165-0.038-0.248\r\n\t\tc-0.085-0.675-0.131-1.369-0.169-2.015c-0.037-0.647-0.063-1.253-0.079-1.772C16.84-22.061,16.853-22.754,16.853-22.754\"/>\r\n            <path fill=\"#ADC80C\" d=\"M19.547-24.547c0-3.901-3.162-7.063-7.063-7.063c-3.901,0-7.063,3.162-7.063,7.063\r\n\t\tc0,3.9,3.162,7.063,7.063,7.063C16.385-17.484,19.547-20.646,19.547-24.547\"/>\r\n            <path fill=\"#ADC80C\" d=\"M23.121-25.177c-0.173-1.094-1.252-3.286-2.349-3.286c-0.922,0-1.095,0.634-1.671,1.614l-0.23,1.728\r\n\t\tl0.676,0.574c0,0,0.534-1.323,0.764-1.784s0.576-0.922,0.864-0.402c0.288,0.518,1.051,1.765,1.051,1.765s0.318,0.558-0.144,0.671\r\n\t\tc-0.461,0.113-1.231,0.303-1.13,0.713c0.101,0.411,0.434,0.438,0.871,0.222s0.718-0.177,0.833,0.067\r\n\t\tc0.114,0.244-0.003,0.871-0.273,1.102c-0.27,0.229,0.549,0.463,0.883,0.271c0.334-0.19,0.324-0.896-0.085-1.23\r\n\t\tc0.486,0.207,0.741,0.58,0.688,1.028s0.808-0.253,0.732-0.562c-0.076-0.308-0.573-1.002-0.906-1.028\r\n\t\tc0.518-0.146,0.531-0.017,0.75,0.255c0.219,0.271,0.598-0.129,0.2-0.584s-1.171-0.647-1.337-0.625\r\n\t\tC23.142-24.647,23.192-24.888,23.121-25.177\"/>\r\n            <path fill=\"#ADC80C\" d=\"M1.699-25.177c0.173-1.094,1.252-3.286,2.349-3.286c0.922,0,1.095,0.634,1.671,1.614l0.23,1.728\r\n\t\tl-0.444,0.544c0,0-0.766-1.293-0.997-1.754s-0.576-0.922-0.864-0.402c-0.288,0.518-1.051,1.765-1.051,1.765\r\n\t\ts-0.319,0.558,0.143,0.671s1.231,0.303,1.13,0.713c-0.101,0.411-0.434,0.438-0.871,0.222s-0.718-0.177-0.833,0.067\r\n\t\ts0.003,0.871,0.273,1.102c0.27,0.229-0.549,0.463-0.883,0.271c-0.334-0.19-0.324-0.896,0.085-1.23\r\n\t\tc-0.486,0.207-0.741,0.58-0.688,1.028c0.053,0.448-0.808-0.253-0.732-0.562c0.076-0.308,0.573-1.002,0.906-1.028\r\n\t\tc-0.518-0.146-0.531-0.017-0.75,0.255c-0.219,0.271-0.599-0.129-0.2-0.584s1.171-0.647,1.337-0.625\r\n\t\tC1.678-24.647,1.628-24.888,1.699-25.177\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M12.585-20.941c0-1.368-1.086-2.478-2.427-2.478S7.73-22.31,7.73-20.941s1.087,2.478,2.428,2.478\r\n\t\tS12.585-19.573,12.585-20.941\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M17.238-20.941c0-1.368-1.087-2.478-2.428-2.478c-1.34,0-2.427,1.109-2.427,2.478s1.087,2.478,2.427,2.478\r\n\t\tC16.151-18.463,17.238-19.573,17.238-20.941\"/>\r\n            <path fill=\"#1C1C1B\" d=\"M12.543-21.275c0-0.798-0.634-1.444-1.416-1.444s-1.415,0.646-1.415,1.444s0.633,1.444,1.415,1.444\r\n\t\tS12.543-20.478,12.543-21.275\"/>\r\n            <path fill=\"#1C1C1B\" d=\"M15.256-21.275c0-0.798-0.634-1.444-1.416-1.444s-1.415,0.646-1.415,1.444s0.633,1.444,1.415,1.444\r\n\t\tS15.256-20.478,15.256-21.275\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M11.752-25.542c0.715-1.603-1.601-3.344-2.644-0.48\"/>\r\n            <path fill=\"#FFFFFF\" d=\"M12.198-25.808c-0.822-1.928,1.674-3.506,2.886-0.102\"/>\r\n            <path fill=\"#ADC80C\" d=\"M9.045-30.233c-0.741-0.803-1.111-0.927-1.05-1.421s1.42-1.297,1.544-1.976\r\n\t\tc0.123-0.68-0.618-0.309-1.112-0.371c-0.25-0.031-0.452-0.252-0.591-0.463c-0.114-0.172,0.015-0.401,0.221-0.401h2.717\r\n\t\tc0.081,0.632,0.056,1.04-0.353,1.651c-0.383,0.575-0.791,0.816-0.821,1.313c-0.028,0.475,1.433,0.729,1.433,0.729\"/>\r\n            <path fill=\"#ADC80C\" d=\"M15.83-30.233c0.741-0.803,1.111-0.927,1.05-1.421c-0.062-0.494-1.42-1.297-1.544-1.976\r\n\t\tc-0.124-0.68,0.618-0.309,1.111-0.371c0.25-0.031,0.452-0.252,0.591-0.463c0.114-0.172-0.015-0.401-0.221-0.401h-2.716\r\n\t\tc-0.081,0.632-0.056,1.04,0.353,1.651c0.383,0.575,0.791,0.816,0.821,1.313c0.028,0.475-1.433,0.729-1.433,0.729\"/>\r\n            <path fill=\"#ADC80C\" d=\"M5.455-24.729c3.526-1.736,7.53-2.367,14.053,0.102\"/>\r\n            <path fill=\"#E3007D\" d=\"M5.455-24.729c0,0,0.219-0.066,0.596-0.197c0.188-0.067,0.421-0.128,0.68-0.215\r\n\t\tc0.129-0.045,0.272-0.078,0.42-0.119c0.149-0.038,0.302-0.088,0.465-0.129c0.328-0.072,0.679-0.164,1.056-0.229\r\n\t\tc0.188-0.037,0.379-0.076,0.579-0.098s0.399-0.061,0.606-0.08s0.417-0.038,0.629-0.057c0.212-0.017,0.429-0.018,0.646-0.03\r\n\t\tc0.217-0.016,0.437-0.005,0.656-0.005c0.22,0.002,0.441-0.003,0.663,0.017c0.221,0.013,0.442,0.024,0.663,0.036\r\n\t\tc0.22,0.023,0.439,0.045,0.656,0.067c0.218,0.018,0.433,0.052,0.646,0.082s0.423,0.061,0.63,0.09\r\n\t\tc0.207,0.037,0.408,0.077,0.608,0.109c0.199,0.034,0.395,0.063,0.583,0.108c0.189,0.041,0.373,0.08,0.55,0.117\r\n\t\tc0.179,0.035,0.352,0.067,0.515,0.11c0.328,0.081,0.632,0.149,0.901,0.208c0.269,0.067,0.502,0.126,0.695,0.174\r\n\t\tc0.387,0.094,0.612,0.141,0.612,0.141s-0.202-0.107-0.562-0.279c-0.181-0.085-0.398-0.195-0.655-0.304\r\n\t\tc-0.257-0.106-0.548-0.226-0.87-0.348c-0.319-0.127-0.676-0.235-1.051-0.356c-0.375-0.121-0.781-0.218-1.199-0.326\r\n\t\tc-0.21-0.049-0.427-0.086-0.646-0.129c-0.219-0.043-0.44-0.088-0.667-0.111c-0.226-0.027-0.454-0.057-0.682-0.086\r\n\t\tc-0.231-0.014-0.462-0.029-0.694-0.044c-0.231-0.019-0.464-0.013-0.695-0.012s-0.462,0.001-0.69,0.022\r\n\t\tc-0.229,0.019-0.455,0.03-0.678,0.059c-0.222,0.033-0.441,0.064-0.657,0.097c-0.427,0.083-0.839,0.171-1.22,0.29\r\n\t\tc-0.385,0.101-0.735,0.243-1.059,0.363c-0.319,0.134-0.608,0.26-0.858,0.389c-0.25,0.129-0.467,0.24-0.637,0.344\r\n\t\tC5.647-24.854,5.455-24.729,5.455-24.729\"/>\r\n        </symbol>\r\n        <svg id=\"app_js\" overflow=\"visible\" width=\"330\" height=\"200\" x=\"3\" y=\"40\">\r\n            <rect id='background' width=\"500\" y='-100' x='-100' height=\"344\"></rect>\r\n            <symbol id=\"lgButton\" viewBox=\"-25.043 -5.537 50.087 11.075\">\r\n                <path fill=\"#689B4A\" d=\"M23.908-3.779h-42.279c-0.627,0-1.136,0.509-1.136,1.136v5.622c0,0.627,0.508,1.136,1.136,1.136h42.279\r\n\t\tc0.627,0,1.136-0.509,1.136-1.136v-5.622C25.044-3.271,24.536-3.779,23.908-3.779\"/>\r\n                <path fill=\"#B5C832\" d=\"M-14.13,0c0-2.969-2.407-5.375-5.376-5.375c-2.969,0-5.376,2.406-5.376,5.375s2.407,5.376,5.376,5.376\r\n\t\tC-16.538,5.376-14.13,2.969-14.13,0\"/>\r\n                <g>\r\n                    <path fill=\"#FFFFFF\" d=\"M-19.506-5.537c-3.053,0-5.537,2.484-5.537,5.537c0,3.054,2.484,5.537,5.537,5.537S-13.969,3.054-13.969,0\r\n\t\t\tC-13.969-3.053-16.453-5.537-19.506-5.537z M-19.506,5.215c-2.875,0-5.215-2.34-5.215-5.215s2.339-5.215,5.215-5.215\r\n\t\t\ts5.215,2.34,5.215,5.215S-16.631,5.215-19.506,5.215z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#FFFFFF\" d=\"M-20.205-3.387c-0.124,0-0.248,0.047-0.342,0.143c-0.189,0.188-0.189,0.494,0,0.684L-17.986,0\r\n\t\t\tl-2.561,2.561c-0.189,0.189-0.189,0.496,0,0.685c0.189,0.189,0.495,0.189,0.684,0l2.903-2.903c0.188-0.188,0.188-0.494,0-0.684\r\n\t\t\tl-2.903-2.902C-19.958-3.34-20.082-3.387-20.205-3.387z\"/>\r\n                </g>\r\n\r\n                <g opacity=\"0.15\">\r\n                    <g>\r\n                        <defs>\r\n                            <polygon id=\"SVGID_1a_\"\r\n                                     points=\"-24.787,-4.74 -17.302,-4.74 -17.302,3.238 -24.787,3.238 \t\t\t\t\"/>\r\n                        </defs>\r\n                        <clipPath id=\"SVGID_2b_\">\r\n                            <use xlink:href=\"#SVGID_1a_\" overflow=\"visible\"/>\r\n                        </clipPath>\r\n                        <path clip-path=\"url(#SVGID_2b_)\"\r\n                              d=\"M-22.043-4.74L-17.302,0l-3.237,3.238l-4.248-4.248C-24.429-2.758-23.401-3.981-22.043-4.74\"\r\n                        />\r\n                    </g>\r\n                </g>\r\n            </symbol>\r\n            <symbol id=\"avatar\" viewBox=\"-47.703 -47.703 95.406 95.406\">\r\n                <path fill=\"#00FFFF\" d=\"M12.141-43.059L47.324-5.924C44.753-26.66,28.884-43.26,8.509-46.931\r\n\t\tC10.03-45.977,11.288-44.646,12.141-43.059z\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-28.956,12.614c0.559-1.427,3.951-1.411,4.786-0.351c0.063,0.079,0.142,0.191,0.225,0.312\r\n\t\tc1.868-0.192,3.474-1.454,4.063-3.267l5.377-23.467c-1.897-0.292-3.934-0.792-5.819-1.644c-5.817-2.632-5.263-6.279-2.54-7.895\r\n\t\tl9.654-5.449c-0.052-0.114-0.084-0.239-0.084-0.373v-8.655c0-3.707,1.957-6.949,4.888-8.774C-30.741-42.976-47.703-23.476-47.703,0\r\n\t\tc0,4.368,0.599,8.595,1.698,12.614H-28.956z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M13.366-38.175v8.655c0,0.502-0.407,0.909-0.909,0.909h-1.001l1.066,4.655h2.166\r\n\t\tc1.217,0,2.205,0.988,2.205,2.205c0,1.218-0.988,2.205-2.205,2.205h-1.156l6.611,28.854c0.59,1.813,2.196,3.075,4.064,3.267\r\n\t\tc0.083-0.12,0.163-0.232,0.225-0.312c0.834-1.06,4.226-1.076,4.785,0.351h16.787c1.1-4.019,1.698-8.246,1.698-12.614\r\n\t\tc0-2.007-0.139-3.981-0.379-5.924L12.141-43.059C12.921-41.604,13.366-39.942,13.366-38.175z\"/>\r\n                <path fill=\"#253A8E\" d=\"M-14.455-19.546c-1.218,0-2.205-0.987-2.205-2.205c0-1.217,0.987-2.205,2.205-2.205h2.194l1.066-4.655\r\n\t\th-1.191c-0.369,0-0.683-0.221-0.825-0.536l-9.654,5.449c-2.723,1.616-3.277,5.263,2.54,7.895c1.885,0.853,3.922,1.353,5.819,1.644\r\n\t\tl1.234-5.387H-14.455z\"/>\r\n                <path fill=\"#FED402\" d=\"M-16.66-21.751c0,1.218,0.987,2.205,2.205,2.205h1.183l0.683-2.979c-0.042-0.001-0.08-0.012-0.122-0.012\r\n\t\tc-1.102,0-1.995,0.637-1.995,1.423c0,0.323,0.153,0.62,0.407,0.859c-0.781-0.268-1.321-0.836-1.321-1.496\r\n\t\tc0-0.917,1.042-1.661,2.327-1.661c0.312,0,0.608,0.044,0.879,0.124l0.153-0.667h-2.194C-15.673-23.956-16.66-22.968-16.66-21.751z\"\r\n                />\r\n                <path fill=\"#D7B606\" d=\"M-15.62-21.751c0,0.66,0.54,1.228,1.321,1.496c-0.254-0.239-0.407-0.536-0.407-0.859\r\n\t\tc0-0.786,0.893-1.423,1.995-1.423c0.042,0,0.081,0.01,0.122,0.012l0.175-0.763c-0.271-0.079-0.568-0.124-0.879-0.124\r\n\t\tC-14.578-23.412-15.62-22.668-15.62-21.751z\"/>\r\n                <path fill=\"#FED402\" d=\"M13.526-23.412c1.285,0,2.326,0.744,2.326,1.661c0,0.66-0.539,1.228-1.32,1.496\r\n\t\tc0.254-0.239,0.406-0.536,0.406-0.859c0-0.786-0.893-1.423-1.994-1.423c-0.033,0-0.062,0.008-0.095,0.009l0.683,2.981h1.156\r\n\t\tc1.217,0,2.205-0.987,2.205-2.205c0-1.217-0.988-2.205-2.205-2.205h-2.166l0.152,0.662C12.938-23.369,13.225-23.412,13.526-23.412z\r\n\t\t\"/>\r\n                <path fill=\"#D7B606\" d=\"M14.938-21.114c0,0.323-0.152,0.62-0.406,0.859c0.781-0.268,1.32-0.836,1.32-1.496\r\n\t\tc0-0.917-1.041-1.661-2.326-1.661c-0.302,0-0.588,0.043-0.852,0.118l0.175,0.767c0.033-0.001,0.062-0.009,0.095-0.009\r\n\t\tC14.046-22.537,14.938-21.9,14.938-21.114z\"/>\r\n                <path fill=\"#FED402\" d=\"M-18.063,23.707c-1.837-4.345-4.757-9.511-5.882-11.132c1.868-0.192,3.474-1.454,4.063-3.267l5.377-23.467\r\n\t\tl1.234-5.387l0.683-2.979l0.175-0.763l0.153-0.667l1.066-4.655h22.65l1.066,4.655l0.152,0.662l0.175,0.767l0.683,2.981\r\n\t\tl6.611,28.854c0.59,1.813,2.196,3.075,4.064,3.267c-1.125,1.621-4.044,6.788-5.881,11.132L0.131,23.863L-18.063,23.707z\r\n\t\t M10.759-4.675L8.301-4.019c-0.339,0.09-0.665,0.213-1.008,0.274s-0.679,0.146-1.026,0.18C5.579-3.467,4.886-3.416,4.192-3.381\r\n\t\tc-1.385,0.067-2.775,0.038-4.16-0.035C-1.353-3.49-2.736-3.61-4.108-3.778c-0.686-0.085-1.37-0.181-2.046-0.295\r\n\t\tc-0.673-0.116-1.351-0.245-1.968-0.416l-2.202-0.609l1.419,1.837c0.291,0.377,0.566,0.683,0.866,1.004\r\n\t\tC-7.741-1.943-7.431-1.642-7.11-1.35c0.643,0.58,1.338,1.113,2.087,1.581c0.748,0.467,1.555,0.867,2.416,1.161\r\n\t\ts1.779,0.478,2.716,0.513c0.469,0.011,0.939-0.007,1.408-0.067c0.463-0.07,0.933-0.148,1.379-0.291\r\n\t\tC3.353,1.43,3.778,1.241,4.213,1.068c0.409-0.211,0.839-0.403,1.218-0.657c0.398-0.232,0.764-0.499,1.125-0.773\r\n\t\tc0.375-0.263,0.688-0.577,1.035-0.866c0.332-0.308,0.652-0.643,0.977-0.968L9.386-3.12L10.759-4.675z M1.821-21.71l0.082,0.079\r\n\t\tc0,0,0.148-0.061,0.381-0.172c0.229-0.102,0.553-0.248,0.943-0.423c0.379-0.163,0.811-0.33,1.27-0.484\r\n\t\tc0.227-0.086,0.463-0.172,0.709-0.245c0.258-0.078,0.489-0.117,0.768-0.141c1.07-0.098,2.13,0.304,2.83,0.772\r\n\t\tc0.354,0.229,0.617,0.476,0.798,0.646c0.181,0.174,0.28,0.286,0.28,0.286l0.091-0.069c0,0-0.07-0.127-0.216-0.344\r\n\t\tc-0.144-0.22-0.371-0.517-0.698-0.835c-0.628-0.651-1.79-1.288-3.072-1.368c-0.303-0.029-0.655-0.024-0.961,0.001\r\n\t\tc-0.317,0.02-0.629,0.079-0.917,0.175c-0.574,0.199-1.045,0.524-1.389,0.849c-0.344,0.327-0.58,0.639-0.707,0.886\r\n\t\tC1.874-21.862,1.821-21.71,1.821-21.71z M-9.71-21.462l0.091,0.069c0,0,0.098-0.111,0.28-0.285c0.18-0.171,0.444-0.417,0.798-0.647\r\n\t\tc0.699-0.467,1.759-0.87,2.83-0.772c0.278,0.024,0.509,0.063,0.767,0.141c0.247,0.073,0.482,0.16,0.709,0.245\r\n\t\tc0.459,0.155,0.89,0.321,1.269,0.484c0.391,0.176,0.716,0.321,0.943,0.423c0.234,0.113,0.382,0.172,0.382,0.172l0.082-0.079\r\n\t\tc0,0-0.053-0.15-0.191-0.386c-0.128-0.247-0.364-0.56-0.708-0.887c-0.343-0.325-0.814-0.65-1.389-0.849\r\n\t\tc-0.287-0.096-0.599-0.155-0.917-0.175c-0.305-0.025-0.658-0.03-0.961,0c-1.281,0.079-2.443,0.716-3.072,1.368\r\n\t\tc-0.327,0.318-0.555,0.614-0.699,0.835C-9.64-21.588-9.71-21.462-9.71-21.462z M-4.492-10.288c2.113-0.11,3.825-1.334,4.623-3.059\r\n\t\tc0.798,1.725,2.51,2.949,4.623,3.059c3.159,0.164,6.008-2.214,6.362-5.313c0.356-3.099-1.916-5.745-5.074-5.91\r\n\t\tc-2.564-0.133-4.923,1.408-5.911,3.65c-0.988-2.242-3.347-3.783-5.911-3.65c-3.158,0.165-5.431,2.811-5.075,5.91\r\n\t\tC-10.5-12.501-7.651-10.124-4.492-10.288z\"/>\r\n                <path fill=\"#FED402\" d=\"M-24.035,25.858c-0.13-0.97,0.476-1.842,1.36-2.101c-1.955-4.146-4.939-9.468-6.313-11.078\r\n\t\tc0.007-0.023,0.022-0.043,0.031-0.066h-17.049c3.355,12.263,11.476,22.547,22.253,28.75\r\n\t\tC-23.528,36.167-23.464,30.096-24.035,25.858z\"/>\r\n                <path fill=\"#FED402\" d=\"M29.249,12.68c-1.373,1.61-4.357,6.932-6.312,11.078c0.884,0.258,1.489,1.131,1.359,2.101\r\n\t\tc-0.565,4.197-0.507,10.194-0.289,15.358c10.65-6.217,18.669-16.437,21.998-28.603H29.218\r\n\t\tC29.227,12.637,29.242,12.657,29.249,12.68z\"/>\r\n                <path fill=\"#017BBD\" d=\"M0.131,23.863l-18.194-0.156c0.637,1.506,1.145,2.913,1.399,4.035c0.08,0.351,0.099,0.663,0.09,0.952\r\n\t\tc0.38,3.236-3.831,3.5-4.312-0.066c-0.063-0.466-0.229-1.085-0.457-1.791c-0.327-0.866-0.787-1.923-1.332-3.079\r\n\t\tc-0.884,0.259-1.49,1.131-1.36,2.101c0.571,4.237,0.506,10.309,0.283,15.505c6.76,3.89,14.56,6.169,22.883,6.318L0.131,23.863\r\n\t\tL0.131,23.863z\"/>\r\n                <path fill=\"#017BBD\" d=\"M24.296,25.858c0.13-0.97-0.475-1.842-1.359-2.101c-0.543,1.151-1.001,2.204-1.329,3.068\r\n\t\tc-0.23,0.71-0.397,1.333-0.461,1.802c-0.481,3.567-4.694,3.301-4.312,0.063c-0.008-0.289,0.011-0.599,0.091-0.949\r\n\t\tc0.254-1.122,0.763-2.529,1.399-4.035L0.131,23.863h0l-0.999,23.818c0.29,0.005,0.577,0.022,0.868,0.022\r\n\t\tc8.756,0,16.954-2.37,24.007-6.487C23.789,36.053,23.731,30.056,24.296,25.858z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-10.855-15.6c-0.356-3.099,1.917-5.745,5.075-5.91c2.564-0.133,4.923,1.408,5.911,3.65\r\n\t\tc-0.229,0.521-0.385,1.079-0.452,1.663c-0.117,1.025,0.058,1.998,0.452,2.851c-0.798,1.725-2.51,2.949-4.623,3.059\r\n\t\tC-7.651-10.124-10.5-12.501-10.855-15.6z M-6.9-16.348c0,1.547,1.255,2.802,2.802,2.802c1.548,0,2.802-1.255,2.802-2.802\r\n\t\tc0-1.547-1.254-2.802-2.802-2.802C-5.645-19.149-6.9-17.895-6.9-16.348z\"/>\r\n                <path fill=\"#22274F\" d=\"M-9.339-21.678c0.18-0.171,0.444-0.417,0.798-0.647c0.699-0.467,1.759-0.87,2.83-0.772\r\n\t\tc0.278,0.024,0.509,0.063,0.767,0.141c0.247,0.073,0.482,0.16,0.709,0.245c0.459,0.155,0.89,0.321,1.269,0.484\r\n\t\tc0.391,0.176,0.716,0.321,0.943,0.423c0.234,0.113,0.382,0.172,0.382,0.172l0.082-0.079c0,0-0.053-0.15-0.191-0.386\r\n\t\tc-0.128-0.247-0.364-0.56-0.708-0.887c-0.343-0.325-0.814-0.65-1.389-0.849c-0.287-0.096-0.599-0.155-0.917-0.175\r\n\t\tc-0.305-0.025-0.658-0.03-0.961,0c-1.281,0.079-2.443,0.716-3.072,1.368c-0.327,0.318-0.555,0.614-0.699,0.835\r\n\t\tc-0.144,0.217-0.214,0.343-0.214,0.343l0.091,0.069C-9.619-21.393-9.521-21.504-9.339-21.678z\"/>\r\n                <path fill=\"#22274F\" d=\"M2.284-21.804c0.229-0.102,0.553-0.248,0.943-0.423c0.379-0.163,0.811-0.33,1.27-0.484\r\n\t\tc0.227-0.086,0.463-0.172,0.709-0.245c0.258-0.078,0.489-0.117,0.768-0.141c1.07-0.098,2.13,0.304,2.83,0.772\r\n\t\tc0.354,0.229,0.617,0.476,0.798,0.646c0.181,0.174,0.28,0.286,0.28,0.286l0.091-0.069c0,0-0.07-0.127-0.216-0.344\r\n\t\tc-0.144-0.22-0.371-0.517-0.698-0.835c-0.628-0.651-1.79-1.288-3.072-1.368c-0.303-0.029-0.655-0.024-0.961,0.001\r\n\t\tc-0.317,0.02-0.629,0.079-0.917,0.175c-0.574,0.199-1.045,0.524-1.389,0.849c-0.344,0.327-0.58,0.639-0.707,0.886\r\n\t\tc-0.139,0.236-0.191,0.387-0.191,0.387l0.082,0.079C1.903-21.631,2.052-21.692,2.284-21.804z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-0.321-16.197c0.067-0.584,0.223-1.143,0.452-1.663c0.988-2.242,3.347-3.783,5.911-3.65\r\n\t\tc3.158,0.165,5.431,2.811,5.074,5.91c-0.354,3.099-3.203,5.477-6.362,5.313c-2.113-0.11-3.825-1.334-4.623-3.059\r\n\t\tC-0.264-14.199-0.438-15.172-0.321-16.197z M1.716-16.348c0,1.547,1.255,2.802,2.803,2.802c1.547,0,2.801-1.255,2.801-2.802\r\n\t\tc0-1.547-1.254-2.802-2.801-2.802C2.971-19.149,1.716-17.895,1.716-16.348z\"/>\r\n                <path fill=\"#22274F\" d=\"M-4.098-13.545c1.548,0,2.802-1.255,2.802-2.802c0-1.547-1.254-2.802-2.802-2.802\r\n\t\tc-1.547,0-2.802,1.255-2.802,2.802C-6.9-14.8-5.645-13.545-4.098-13.545z\"/>\r\n                <path fill=\"#22274F\" d=\"M4.519-13.545c1.547,0,2.801-1.255,2.801-2.802c0-1.547-1.254-2.802-2.801-2.802\r\n\t\tc-1.548,0-2.803,1.255-2.803,2.802C1.716-14.8,2.971-13.545,4.519-13.545z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M0.027-2.645c-1.405,0.054-2.813,0.062-4.223,0.02c-0.633-0.021-1.267-0.054-1.902-0.098\r\n\t\tc0.03,0.024,0.058,0.051,0.088,0.076c0.609,0.482,1.254,0.911,1.924,1.271s1.366,0.648,2.075,0.838\r\n\t\tc0.708,0.192,1.426,0.283,2.133,0.264c0.353-0.016,0.702-0.053,1.047-0.12C1.511-0.472,1.854-0.547,2.183-0.68\r\n\t\tc0.334-0.105,0.65-0.279,0.971-0.426C3.46-1.297,3.778-1.455,4.067-1.683c0.302-0.2,0.584-0.437,0.863-0.679\r\n\t\tc0.286-0.227,0.535-0.517,0.807-0.769L5.888-3.3C5.337-3.184,4.785-3.077,4.229-2.998C2.836-2.801,1.433-2.701,0.027-2.645z\"/>\r\n                <path fill=\"#DB4F14\" d=\"M10.759-4.675L9.386-3.12L8.567-2.196c-0.324,0.325-0.645,0.66-0.977,0.968\r\n\t\tc-0.347,0.289-0.66,0.603-1.035,0.866C6.194-0.088,5.829,0.179,5.431,0.411C5.052,0.665,4.622,0.857,4.213,1.068\r\n\t\tC3.778,1.241,3.353,1.43,2.896,1.547C2.449,1.69,1.979,1.768,1.517,1.838c-0.469,0.06-0.938,0.078-1.408,0.067\r\n\t\tC-0.828,1.87-1.746,1.686-2.607,1.392s-1.668-0.694-2.416-1.161C-5.772-0.237-6.467-0.77-7.11-1.35\r\n\t\tc-0.321-0.292-0.631-0.593-0.929-0.907c-0.3-0.321-0.575-0.627-0.866-1.004l-1.419-1.837l2.202,0.609\r\n\t\tc0.617,0.171,1.295,0.3,1.968,0.416c0.676,0.114,1.36,0.21,2.046,0.295c1.372,0.168,2.755,0.288,4.14,0.362\r\n\t\tc1.385,0.073,2.775,0.102,4.16,0.035c0.693-0.035,1.387-0.086,2.074-0.184c0.348-0.033,0.684-0.118,1.026-0.18\r\n\t\ts0.669-0.184,1.008-0.274L10.759-4.675z M5.888-3.3C5.337-3.184,4.785-3.077,4.229-2.998C2.836-2.801,1.433-2.701,0.027-2.645\r\n\t\tc-1.405,0.054-2.813,0.062-4.223,0.02c-0.633-0.021-1.267-0.054-1.902-0.098c0.03,0.024,0.058,0.051,0.088,0.076\r\n\t\tc0.609,0.482,1.254,0.911,1.924,1.271s1.366,0.648,2.075,0.838c0.708,0.192,1.426,0.283,2.133,0.264\r\n\t\tc0.353-0.016,0.702-0.053,1.047-0.12C1.511-0.472,1.854-0.547,2.183-0.68c0.334-0.105,0.65-0.279,0.971-0.426\r\n\t\tC3.46-1.297,3.778-1.455,4.067-1.683c0.302-0.2,0.584-0.437,0.863-0.679c0.286-0.227,0.535-0.517,0.807-0.769L5.888-3.3z\"/>\r\n                <path fill=\"#004373\" d=\"M-20.925,28.098c-0.086-0.342-0.235-0.777-0.417-1.261c0.229,0.706,0.394,1.325,0.457,1.791\r\n\t\tc0.481,3.566,4.692,3.302,4.312,0.066C-16.654,31.34-20.099,31.359-20.925,28.098z\"/>\r\n                <path fill=\"#017BBD\" d=\"M-28.987,12.68c0.007-0.023,0.022-0.043,0.031-0.066c0.559-1.427,3.951-1.411,4.786-0.351\r\n\t\tc0.063,0.079,0.142,0.191,0.225,0.312c1.125,1.621,4.044,6.788,5.882,11.132c0.637,1.506,1.145,2.913,1.399,4.035\r\n\t\tc0.08,0.351,0.099,0.663,0.09,0.952c-0.08,2.646-3.525,2.665-4.352-0.596c-0.086-0.342-0.235-0.777-0.417-1.261\r\n\t\tc-0.327-0.866-0.787-1.923-1.332-3.079C-24.63,19.612-27.614,14.29-28.987,12.68z M-16.967,28.282c0-0.876-0.71-1.586-1.586-1.586\r\n\t\ts-1.586,0.71-1.586,1.586c0,0.876,0.71,1.586,1.586,1.586S-16.967,29.159-16.967,28.282z\"/>\r\n                <path fill=\"#FED402\" d=\"M-18.553,26.696c-0.876,0-1.586,0.71-1.586,1.586c0,0.876,0.71,1.586,1.586,1.586s1.586-0.71,1.586-1.586\r\n\t\tC-16.967,27.406-17.677,26.696-18.553,26.696z\"/>\r\n                <path fill=\"#004373\" d=\"M16.836,28.691c-0.382,3.238,3.83,3.504,4.312-0.063c0.063-0.469,0.23-1.092,0.461-1.802\r\n\t\tc-0.185,0.489-0.334,0.927-0.422,1.272C20.36,31.36,16.914,31.34,16.836,28.691z\"/>\r\n                <path fill=\"#017BBD\" d=\"M18.326,23.707c1.837-4.345,4.757-9.511,5.881-11.132c0.083-0.12,0.163-0.232,0.225-0.312\r\n\t\tc0.834-1.06,4.226-1.076,4.785,0.351c0.009,0.023,0.024,0.043,0.031,0.066c-1.373,1.61-4.357,6.932-6.312,11.078\r\n\t\tc-0.543,1.151-1.001,2.204-1.329,3.068c-0.185,0.489-0.334,0.927-0.422,1.272c-0.826,3.262-4.272,3.242-4.351,0.593\r\n\t\tc-0.008-0.289,0.011-0.599,0.091-0.949C17.181,26.62,17.689,25.213,18.326,23.707z M20.401,28.282c0-0.876-0.711-1.586-1.586-1.586\r\n\t\tc-0.877,0-1.587,0.71-1.587,1.586c0,0.876,0.71,1.586,1.587,1.586C19.69,29.869,20.401,29.159,20.401,28.282z\"/>\r\n                <path fill=\"#FED402\" d=\"M18.815,26.696c-0.877,0-1.587,0.71-1.587,1.586c0,0.876,0.71,1.586,1.587,1.586\r\n\t\tc0.875,0,1.586-0.71,1.586-1.586C20.401,27.406,19.69,26.696,18.815,26.696z\"/>\r\n                <path fill=\"#017BBD\" d=\"M-13.295-38.175v8.655c0,0.134,0.032,0.258,0.084,0.373c0.143,0.315,0.457,0.536,0.825,0.536h1.191h22.65\r\n\t\th1.001c0.502,0,0.909-0.407,0.909-0.909v-8.655c0-1.767-0.445-3.429-1.226-4.883c-0.853-1.587-2.111-2.918-3.632-3.872\r\n\t\tC5.747-47.429,2.906-47.703,0-47.703c-2.87,0-5.677,0.268-8.407,0.753C-11.338-45.124-13.295-41.882-13.295-38.175z\"/>\r\n            </symbol>\r\n            <symbol id=\"avatarLost\" viewBox=\"-68.395 -68.954 136.789 137.907\">\r\n                <polygon points=\"-9.184,-68.954 -26.288,-25.912 -68.395,-6.62 -32.745,22.947 -27.409,68.954 11.728,44.186 57.132,53.328\r\n\t\t45.67,8.454 68.395,-31.904 22.175,-34.87 \t\"/>\r\n                <path fill=\"#017BBC\" d=\"M27.537-25.5l3.025,1.708c0.794,0.471,0.955,1.533-0.739,2.3c-1.694,0.766-3.819,0.564-3.819,0.564\r\n\t\tl-0.605-4.667L27.537-25.5z\"/>\r\n                <path fill=\"#004373\" d=\"M13.131-0.617c0,1.075,4.809,1.947,10.742,1.947c5.933,0,10.743-0.872,10.743-1.947\r\n\t\ts-4.811-1.947-10.743-1.947C17.939-2.564,13.131-1.692,13.131-0.617\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M27.437-22.583h0.678c0.354,0,0.642-0.287,0.642-0.642s-0.287-0.643-0.642-0.643h-0.678\"/>\r\n                <path fill=\"#D6B406\" d=\"M28.187-23.04c0-0.229-0.26-0.414-0.581-0.414c-0.218,0-0.408,0.085-0.507,0.212\r\n\t\tc0.012-0.259,0.31-0.467,0.677-0.467c0.374,0,0.678,0.217,0.678,0.484c0,0.192-0.157,0.357-0.385,0.436\r\n\t\tC28.143-22.858,28.187-22.945,28.187-23.04\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M20.302-22.583h-0.677c-0.355,0-0.643-0.287-0.643-0.642s0.287-0.643,0.643-0.643h0.677\"/>\r\n                <path fill=\"#D6B406\" d=\"M19.552-23.04c0-0.229,0.26-0.414,0.581-0.414c0.218,0,0.408,0.085,0.507,0.212\r\n\t\tc-0.012-0.259-0.31-0.467-0.676-0.467c-0.375,0-0.679,0.217-0.679,0.484c0,0.192,0.157,0.357,0.385,0.436\r\n\t\tC19.596-22.858,19.552-22.945,19.552-23.04\"/>\r\n                <path fill=\"#FFED00\" d=\"M21.212-28.04l-3.177,13.862c-0.187,0.574-0.722,0.963-1.325,0.963H2.134c-1.35,0-1.912,1.727-0.819,2.521\r\n\t\tl11.792,8.567c0.488,0.354,0.692,0.984,0.506,1.558L9.938,29.555c-0.416,1.284,1.054,2.352,2.146,1.559L23.046,6.285\r\n\t\tc0.488-0.355,1.149-0.355,1.639,0l10.962,24.829c1.092,0.793,2.562-0.275,2.145-1.559L34.116-0.568\r\n\t\tc-0.186-0.574,0.018-1.204,0.507-1.558l11.792-8.567c1.092-0.793,0.53-2.521-0.819-2.521H31.02c-0.603,0-1.139-0.39-1.325-0.963\r\n\t\tL26.519-28.04C25.999-30.264,21.685-30.264,21.212-28.04\"/>\r\n                <path fill=\"#00FFFF\" d=\"M23.046,9.604c0.488-0.355,1.149-0.355,1.639,0l9.094,18.868c1.092,0.794,4.475-0.796,4.058-2.081\r\n\t\tL34.614-0.568c-1.783,0.834-3.441,0.274-3.595-1.255c0,0-0.465-4.944-0.115-7.534c0.045-0.338-0.215-0.639-0.557-0.637\r\n\t\tl-6.482,0.057\"/>\r\n                <path fill=\"#00FFFF\" d=\"M24.685,9.604c-0.488-0.355-1.15-0.355-1.639,0l-9.095,18.868c-1.092,0.794-4.475-0.796-4.057-2.081\r\n\t\tl3.221-26.959c1.783,0.834,3.441,0.274,3.595-1.255c0,0,0.465-4.944,0.115-7.534c-0.044-0.338,0.216-0.639,0.558-0.637l6.482,0.057\r\n\t\t\"/>\r\n                <path fill=\"none\" stroke=\"#292D95\" stroke-width=\"0.1658\" stroke-miterlimit=\"10\" d=\"M13.035-0.036\r\n\t\tc0.076,0.035,0.152,0.068,0.229,0.099\"/>\r\n                <path fill=\"none\" stroke=\"#292D95\" stroke-width=\"0.1658\" stroke-miterlimit=\"10\"\r\n                      stroke-dasharray=\"0.5008,0.5008\" d=\"\r\n\t\tM13.741,0.217c1.618,0.413,3.333-0.209,3.467-1.542c0,0,0.462-4.974,0.105-7.558c-0.045-0.326,0.205-0.618,0.535-0.618h12.025\r\n\t\tc0.329,0,0.58,0.292,0.535,0.618c-0.354,2.583,0.112,7.558,0.112,7.558c0.141,1.4,2.024,2.016,3.71,1.472\"/>\r\n                <path fill=\"none\" stroke=\"#292D95\" stroke-width=\"0.1658\" stroke-miterlimit=\"10\" d=\"M34.466,0.063\r\n\t\tc0.077-0.03,0.153-0.064,0.229-0.099\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M23.733-21.607c-0.104,0.903,0.558,1.674,1.479,1.721c0.92,0.048,1.749-0.645,1.853-1.548\r\n\t\tc0.104-0.903-0.559-1.673-1.478-1.721C24.666-23.202,23.836-22.51,23.733-21.607\"/>\r\n                <path fill=\"#22274F\" d=\"M26.731-23.141c0,0-0.111-0.184-0.351-0.395c-0.234-0.216-0.575-0.465-0.986-0.639\r\n\t\tc-0.101-0.042-0.223-0.079-0.349-0.083c-0.115-0.002-0.258,0.022-0.357,0.073c-0.215,0.096-0.351,0.274-0.437,0.425\r\n\t\tc-0.159,0.331-0.055,0.566-0.065,0.558h0.033c0,0,0.053-0.217,0.244-0.417c0.191-0.205,0.487-0.379,0.845-0.29\r\n\t\tc0.378,0.094,0.74,0.309,1,0.467c0.262,0.163,0.397,0.32,0.397,0.32L26.731-23.141z\"/>\r\n                <path fill=\"#22274F\" d=\"M21.024-23.12c0,0,0.136-0.158,0.401-0.317c0.262-0.157,0.627-0.365,1.007-0.465\r\n\t\tc0.092-0.022,0.191-0.034,0.257-0.029c0.109,0.003,0.143,0.025,0.229,0.05c0.139,0.059,0.271,0.146,0.355,0.255\r\n\t\tc0.184,0.206,0.237,0.424,0.237,0.424h0.032c-0.011,0.006,0.095-0.225-0.054-0.561c-0.083-0.152-0.215-0.339-0.438-0.433\r\n\t\tc-0.093-0.052-0.262-0.072-0.357-0.064c-0.139,0.012-0.244,0.051-0.349,0.093c-0.407,0.176-0.754,0.419-0.991,0.633\r\n\t\tc-0.242,0.208-0.354,0.393-0.354,0.393L21.024-23.12z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M23.996-21.607c0.104,0.903-0.558,1.674-1.479,1.721c-0.919,0.048-1.749-0.645-1.853-1.548\r\n\t\ts0.559-1.673,1.478-1.721C23.063-23.202,23.894-22.51,23.996-21.607\"/>\r\n                <path fill=\"#22274F\" d=\"M24.612-21.651c0,0.451,0.365,0.817,0.816,0.817s0.816-0.366,0.816-0.817c0-0.45-0.365-0.816-0.816-0.816\r\n\t\tS24.612-22.101,24.612-21.651\"/>\r\n                <path fill=\"#22274F\" d=\"M21.439-21.651c0,0.451,0.364,0.817,0.816,0.817c0.45,0,0.815-0.366,0.815-0.817\r\n\t\tc0-0.45-0.365-0.816-0.815-0.816C21.804-22.467,21.439-22.101,21.439-21.651\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M26.321-16.651c-2.429-3.122-4.836-0.082-4.836-0.082C22.255-15.133,25.429-14.924,26.321-16.651\"/>\r\n                <path fill=\"#EA7D00\" d=\"M26.505-17.052c-0.118-0.132-0.243-0.275-0.391-0.412c-0.195-0.173-0.397-0.341-0.629-0.478\r\n\t\tc-0.449-0.285-1.003-0.454-1.551-0.435c-0.549,0.02-1.061,0.216-1.494,0.488c-0.438,0.278-0.807,0.609-1.131,1.017l-0.091,0.114\r\n\t\tl0.064,0.123c0.255,0.482,0.692,0.814,1.15,1.017c0.463,0.202,0.962,0.29,1.453,0.287c0.49-0.006,0.982-0.105,1.42-0.322\r\n\t\tc0.438-0.213,0.813-0.561,1.014-0.997L26.505-17.052z M26.065-16.308c-0.223,0.242-0.503,0.432-0.805,0.552\r\n\t\tc-0.434,0.174-0.907,0.231-1.368,0.2c-0.905-0.06-1.863-0.493-2.205-1.274l-0.025,0.236c0.597-0.648,1.448-1.174,2.276-1.147\r\n\t\tc0.411,0.015,0.807,0.16,1.149,0.41c0.175,0.117,0.332,0.269,0.486,0.422c0.141,0.147,0.281,0.32,0.431,0.52L26.065-16.308z\"/>\r\n                <path fill=\"#004373\" d=\"M34.585,0.997c-0.518,1.295-3.137,1.98-4.631,1.323c0.146,2.421,0.413,3.232,1.097,4.024\r\n\t\tc0.899,1.043,3.498,1.968,4.301,0.285L34.585,0.997z\"/>\r\n                <path fill=\"#017BBC\" d=\"M34.67,1.329c-0.526,1.173-3.193,1.792-4.716,1.198c0.148,2.191,0.448,2.869,1.117,3.642\r\n\t\tc0.843,0.973,3.563,1.781,4.38,0.258L34.67,1.329z\"/>\r\n                <path fill=\"none\" stroke=\"#FDD302\" stroke-width=\"0.1719\" stroke-miterlimit=\"10\"\r\n                      stroke-dasharray=\"0.5141,0.5141\" d=\"M34.57,2.54\r\n\t\tc-0.941,0.748-2.752,1.001-4.031,0.534c0.124,1.725,0.507,2.249,0.938,2.867c0.593,0.848,2.995,1.402,3.682,0.204L34.57,2.54z\"/>\r\n                <path fill=\"#004373\" d=\"M13.145,0.997c0.518,1.295,3.137,1.98,4.632,1.323c-0.146,2.421-0.414,3.232-1.097,4.024\r\n\t\tc-0.899,1.043-3.499,1.968-4.301,0.285L13.145,0.997z\"/>\r\n                <path fill=\"#017BBC\" d=\"M13.06,1.329c0.527,1.173,3.193,1.792,4.717,1.198c-0.148,2.191-0.448,2.869-1.118,3.642\r\n\t\tc-0.842,0.973-3.562,1.781-4.379,0.258L13.06,1.329z\"/>\r\n                <path fill=\"none\" stroke=\"#FDD302\" stroke-width=\"0.1719\" stroke-miterlimit=\"10\"\r\n                      stroke-dasharray=\"0.5141,0.5141\" d=\"M13.16,2.54\r\n\t\tc0.94,0.748,2.751,1.001,4.031,0.534c-0.125,1.725-0.508,2.249-0.939,2.867c-0.592,0.848-2.994,1.402-3.682,0.204L13.16,2.54z\"/>\r\n                <path fill=\"#004373\" d=\"M32.116-13.082c-0.145-0.434-1.013-0.413-1.255-0.096c-0.342,0.448-1.834,3.199-2.117,4.542\r\n\t\tc-0.22,1.042,1.097,1.161,1.243,0.084C30.114-9.491,31.553-12.4,32.116-13.082\"/>\r\n                <path fill=\"#00FFFF\" d=\"M32.347-13.196c-0.138-0.437-1.156-0.434-1.403-0.121c-0.349,0.443-1.882,3.169-2.187,4.508\r\n\t\tc-0.235,1.039,0.975,1.158,1.241,0.104C30.23-9.622,31.772-12.522,32.347-13.196\"/>\r\n                <path fill=\"#FDD302\" d=\"M28.845-8.651c0,0.255,0.208,0.462,0.463,0.462c0.254,0,0.462-0.208,0.462-0.462s-0.208-0.462-0.462-0.462\r\n\t\tC29.053-9.113,28.845-8.906,28.845-8.651\"/>\r\n                <path fill=\"#004373\" d=\"M15.613-13.082c0.146-0.434,1.014-0.413,1.255-0.096c0.343,0.448,1.834,3.199,2.117,4.542\r\n\t\tc0.22,1.042-1.097,1.161-1.242,0.084C17.616-9.491,16.178-12.4,15.613-13.082\"/>\r\n                <path fill=\"#00FFFF\" d=\"M15.384-13.196c0.138-0.437,1.155-0.434,1.402-0.121c0.349,0.443,1.883,3.169,2.188,4.508\r\n\t\tc0.234,1.039-0.975,1.158-1.242,0.104C17.499-9.622,15.957-12.522,15.384-13.196\"/>\r\n                <path fill=\"#FDD302\" d=\"M18.885-8.651c0,0.255-0.207,0.462-0.462,0.462s-0.462-0.208-0.462-0.462s0.207-0.462,0.462-0.462\r\n\t\tS18.885-8.906,18.885-8.651\"/>\r\n                <path fill=\"#00FFFF\" d=\"M23.021-31.021h1.743c1.662,0,3.011,1.348,3.011,3.012v2.521c0,0.146-0.118,0.264-0.265,0.264h-7.236\r\n\t\tc-0.146,0-0.265-0.118-0.265-0.264v-2.521C20.01-29.672,21.358-31.021,23.021-31.021\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M5.722,12.026c0.358-1.441,1.695-2.348,2.986-2.027c-0.061,0.796-0.177,1.304-0.976,2.404\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M5.722,12.026\r\n\t\tc0.358-1.441,1.695-2.348,2.986-2.027c-0.061,0.796-0.177,1.304-0.976,2.404\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M0.089,9.068C0.978,7.879,2.562,7.56,3.627,8.356c1.065,0.796,1.208,2.406,0.319,3.594\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M0.089,9.068\r\n\t\tC0.978,7.879,2.562,7.56,3.627,8.356c1.065,0.796,1.208,2.406,0.319,3.594\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M-3.658,6.021c0.914-0.96,2.3-1.123,3.097-0.365c0.796,0.758,0.701,2.15-0.212,3.11\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M-3.658,6.021\r\n\t\tc0.914-0.96,2.3-1.123,3.097-0.365c0.796,0.758,0.701,2.15-0.212,3.11\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M-6.259,1.997c0.956-0.583,2.163-0.349,2.698,0.525c0.533,0.874,0.192,2.055-0.764,2.64\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M-6.259,1.997\r\n\t\tc0.956-0.583,2.163-0.349,2.698,0.525c0.533,0.874,0.192,2.055-0.764,2.64\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-11.111-12.09c0,0-0.008-2.063,0.069-5.154c0.079-3.09,0.203-7.216,0.453-11.32\r\n\t\tc0.073-1.02,0.124-2.061,0.277-3.016c0.048-0.225,0.107-0.438,0.179-0.575c0.025-0.07,0.087-0.091-0.002-0.003\r\n\t\tc-0.045,0.041-0.161,0.093-0.252,0.086c-0.082,0.002-0.12-0.018-0.125-0.015c0,0.009,0.159,0.193,0.258,0.36\r\n\t\tc0.112,0.177,0.222,0.376,0.329,0.578c0.213,0.407,0.416,0.831,0.623,1.252c0.233,0.426,0.327,0.806,0.826,1.38\r\n\t\tc0.223,0.241,0.499,0.472,0.875,0.633c0.374,0.161,0.884,0.211,1.328,0.071c0.904-0.315,1.239-0.923,1.502-1.355\r\n\t\tc0.483-0.919,0.63-1.694,0.769-2.377c0.124-0.682,0.189-1.266,0.23-1.743c0.081-0.955,0.091-1.493,0.091-1.493l0-0.051\r\n\t\tc0.017-0.809-0.626-1.477-1.435-1.493c-0.808-0.016-1.476,0.626-1.492,1.435c-0.001,0.056,0.002,0.121,0.007,0.176\r\n\t\tc0,0,0.05,0.493,0.083,1.341c0.017,0.425,0.02,0.936-0.012,1.501c-0.033,0.555-0.114,1.205-0.295,1.687\r\n\t\tc-0.079,0.241-0.223,0.372-0.127,0.339c0.047-0.008,0.112,0.019,0.083,0.03c-0.026,0.003-0.109-0.029-0.198-0.101\r\n\t\tc-0.128-0.06-0.424-0.524-0.676-0.885c-0.261-0.384-0.528-0.785-0.827-1.198c-0.151-0.207-0.308-0.417-0.492-0.631\r\n\t\tc-0.202-0.215-0.352-0.435-0.785-0.679c-0.115-0.057-0.271-0.118-0.479-0.127c-0.214-0.009-0.457,0.078-0.6,0.197\r\n\t\tc-0.288,0.242-0.347,0.455-0.407,0.618c-0.106,0.334-0.13,0.624-0.151,0.899c-0.071,1.063-0.08,2.085-0.087,3.126\r\n\t\tc-0.007,4.138,0.115,8.261,0.221,11.355C-11.242-14.149-11.111-12.09-11.111-12.09\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-7.729-10.157c0,0-0.007-2.063,0.07-5.154c0.078-3.09,0.202-7.216,0.452-11.32\r\n\t\tc0.073-1.02,0.125-2.061,0.278-3.016c0.047-0.225,0.107-0.438,0.179-0.575c0.025-0.071,0.087-0.092-0.002-0.004\r\n\t\tc-0.045,0.041-0.162,0.092-0.252,0.085c-0.082,0.002-0.12-0.018-0.126-0.015c0,0.01,0.16,0.193,0.258,0.361\r\n\t\tc0.112,0.177,0.222,0.375,0.329,0.578c0.213,0.406,0.417,0.831,0.624,1.252c0.234,0.427,0.326,0.806,0.827,1.38\r\n\t\tc0.223,0.241,0.498,0.471,0.875,0.633c0.374,0.162,0.884,0.212,1.328,0.071c0.903-0.314,1.238-0.923,1.502-1.355\r\n\t\tc0.483-0.92,0.63-1.694,0.769-2.377c0.124-0.682,0.189-1.266,0.23-1.743c0.08-0.955,0.09-1.492,0.09-1.492l0.001-0.052\r\n\t\tc0.017-0.809-0.626-1.477-1.435-1.493c-0.808-0.016-1.476,0.626-1.492,1.435c-0.001,0.056,0.002,0.121,0.007,0.176\r\n\t\tc0,0,0.049,0.493,0.082,1.341c0.017,0.425,0.021,0.936-0.011,1.501c-0.033,0.555-0.114,1.206-0.295,1.687\r\n\t\tc-0.079,0.241-0.223,0.372-0.128,0.338c0.048-0.008,0.112,0.02,0.084,0.03c-0.026,0.003-0.109-0.029-0.199-0.101\r\n\t\tc-0.127-0.06-0.424-0.523-0.675-0.885c-0.261-0.383-0.529-0.785-0.828-1.198c-0.15-0.206-0.307-0.416-0.491-0.63\r\n\t\tc-0.203-0.215-0.353-0.435-0.785-0.679c-0.116-0.057-0.272-0.119-0.48-0.127c-0.213-0.009-0.457,0.078-0.6,0.196\r\n\t\tc-0.288,0.243-0.346,0.455-0.406,0.618c-0.107,0.334-0.129,0.624-0.151,0.899c-0.072,1.063-0.08,2.086-0.087,3.126\r\n\t\tc-0.008,4.138,0.115,8.261,0.221,11.355C-7.86-12.216-7.729-10.157-7.729-10.157\"/>\r\n                <path fill=\"#ADC80C\" d=\"M7.732,12.403c-4.222,5.114-10.609,8.375-17.758,8.375c-12.709,0-23.012-10.302-23.012-23.012\r\n\t\ts10.303-23.012,23.012-23.012c10.778,0,19.825,7.409,22.326,17.412L5.361-5.483c0,0-6.197,1.896-7.865,2.994\r\n\t\tc-1.669,1.097-3.452,3.156-3.07,4.635c0.382,1.479,2.077,6.792,6.294,8.614C4.939,12.581,7.732,12.403,7.732,12.403\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-3.374-9.103C-0.657-5.566,3.86-4.478,6.717-6.67c2.856-2.194,2.971-6.839,0.255-10.376\r\n\t\tc-2.715-3.537-7.232-4.626-10.089-2.433C-5.974-17.285-6.089-12.64-3.374-9.103\"/>\r\n                <path fill=\"#1C1C1B\" d=\"M1.514-11.482c1.583,2.063,4.218,2.697,5.883,1.418c1.666-1.278,1.732-3.987,0.149-6.049\r\n\t\tc-1.584-2.063-4.217-2.698-5.883-1.419C-0.003-16.252-0.07-13.545,1.514-11.482\"/>\r\n                <path fill=\"#ADC80C\" d=\"M1.18,16.295c2.415,2.615,3.622,3.019,3.421,4.628c-0.201,1.61-4.627,4.226-5.029,6.438\r\n\t\tc-0.403,2.213,2.011,1.006,3.621,1.207c0.814,0.102,1.474,0.821,1.927,1.507c0.37,0.561-0.048,1.311-0.721,1.311h-8.851\r\n\t\tc-0.264-2.057-0.182-3.389,1.149-5.384c1.248-1.871,2.578-2.66,2.673-4.274c0.093-1.544-4.669-2.377-4.669-2.377\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-20.925,16.295c-2.415,2.615-3.622,3.019-3.42,4.628c0.201,1.61,4.628,4.226,5.029,6.438\r\n\t\tc0.403,2.213-2.011,1.006-3.621,1.207c-0.814,0.102-1.474,0.821-1.927,1.507c-0.371,0.561,0.049,1.311,0.722,1.311h8.851\r\n\t\tc0.265-2.057,0.182-3.389-1.148-5.384c-1.248-1.871-2.578-2.66-2.674-4.274c-0.093-1.544,4.669-2.377,4.669-2.377\"/>\r\n                <path fill=\"#E3007D\" d=\"M-5.833,0.955c0,0,0.001,0.077,0.002,0.22c0.007,0.144-0.007,0.355,0.019,0.622\r\n\t\tc0.053,0.261,0.078,0.6,0.181,0.963c0.108,0.36,0.208,0.78,0.396,1.207c0.158,0.442,0.381,0.894,0.624,1.373\r\n\t\tC-4.365,5.814-4.073,6.3-3.756,6.793c0.331,0.483,0.674,0.987,1.074,1.458c0.374,0.497,0.822,0.938,1.25,1.407\r\n\t\tc0.462,0.429,0.908,0.889,1.409,1.269c0.487,0.397,0.983,0.773,1.502,1.087c0.495,0.351,1.029,0.604,1.526,0.865\r\n\t\tc0.493,0.272,1.013,0.424,1.468,0.618c0.463,0.183,0.917,0.266,1.31,0.381c0.391,0.122,0.748,0.153,1.04,0.196\r\n\t\tC7.411,14.154,7.747,14.2,7.747,14.2c0.664,0.088,1.274-0.377,1.363-1.041c0.089-0.663-0.377-1.274-1.04-1.363\r\n\t\tc-0.045-0.006-0.091-0.009-0.137-0.01l-0.146-0.002c0,0-0.273-0.004-0.751-0.012c-0.24-0.004-0.535,0.012-0.868-0.053\r\n\t\tc-0.332-0.059-0.72-0.071-1.128-0.179c-0.403-0.121-0.864-0.187-1.318-0.372c-0.458-0.175-0.956-0.335-1.435-0.593\r\n\t\tc-0.497-0.221-0.984-0.504-1.473-0.81c-0.501-0.29-0.959-0.662-1.442-1.007c-0.448-0.384-0.923-0.747-1.33-1.168\r\n\t\tc-0.434-0.398-0.814-0.833-1.187-1.254c-0.36-0.43-0.696-0.861-0.988-1.285c-0.288-0.43-0.558-0.839-0.76-1.243\r\n\t\tC-5.125,3.417-5.27,3.03-5.417,2.692c-0.144-0.34-0.206-0.651-0.291-0.906c-0.059-0.26-0.071-0.473-0.095-0.614\r\n\t\tC-5.823,1.03-5.833,0.955-5.833,0.955\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-3.93,0.02c1.093,2.881,6.456,2.042,4.184-2.821\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M-3.93,0.02\r\n\t\tc1.093,2.881,6.456,2.042,4.184-2.821\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M1.286-3.648c0.552,4.095,7.737,4.933,6.247-2.108\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M1.286-3.648\r\n\t\tc0.552,4.095,7.737,4.933,6.247-2.108\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M8.046-5.815c1.245,3.499,2.521,4.966,3.844,5.401c1.185,0.389,2.366-0.676,2.146-1.904\r\n\t\tc-0.339-1.894-0.974-3.73-1.735-4.963\"/>\r\n                <path fill=\"none\" stroke=\"#E2E2E2\" stroke-width=\"0.4832\" stroke-miterlimit=\"10\" d=\"M8.046-5.815\r\n\t\tc1.245,3.499,2.521,4.966,3.844,5.401c1.185,0.389,2.366-0.676,2.146-1.904c-0.339-1.894-0.974-3.73-1.735-4.963\"/>\r\n                <path fill=\"#E3007D\" d=\"M12.412-8.47c0,0-0.323,0.08-0.89,0.221c-0.569,0.148-1.37,0.367-2.323,0.653\r\n\t\tC7.293-7.028,4.781-6.193,2.333-5.188c-2.442,1.006-4.839,2.19-6.407,3.444c-0.389,0.313-0.727,0.627-0.99,0.939\r\n\t\tC-5.33-0.498-5.527-0.196-5.641,0.074C-5.756,0.339-5.815,0.565-5.817,0.72c-0.011,0.153-0.017,0.235-0.017,0.235\r\n\t\ts0.016-0.08,0.043-0.231c0.019-0.149,0.104-0.362,0.244-0.602c0.137-0.245,0.358-0.509,0.645-0.772\r\n\t\tc0.284-0.268,0.641-0.529,1.048-0.786c1.639-1.027,4.094-1.909,6.582-2.61c2.494-0.701,5.035-1.23,6.943-1.566\r\n\t\tc0.953-0.168,1.751-0.29,2.303-0.367c0.557-0.072,0.875-0.114,0.875-0.114l0.012-0.001c0.663-0.085,1.132-0.692,1.045-1.355\r\n\t\tc-0.086-0.664-0.692-1.132-1.355-1.045C12.503-8.49,12.456-8.48,12.412-8.47\"/>\r\n                <path fill=\"#006633\" d=\"M-9.169-1.294c-0.688,0.954-1.331,1.96-1.721,3.101c-0.099,0.28-0.165,0.591-0.21,0.88\r\n\t\tc-0.044,0.295-0.113,0.56-0.188,0.845l-0.253,0.841c-0.037,0.161-0.1,0.25-0.1,0.52c0.015,0.079,0.073,0.179,0.142,0.213\r\n\t\tc0.07,0.04,0.221,0.027,0.25,0.006c0.05-0.026,0.113-0.061,0.148-0.089c0.063-0.053,0.133-0.109,0.186-0.163\r\n\t\tc0.441-0.426,0.822-0.867,1.212-1.326C-9.321,3.08-8.951,2.615-8.59,2.145c0.724-0.941,1.396-1.912,2.059-2.901l-0.067,0.081\r\n\t\tc0.449-0.446,0.818-0.923,1.001-1.598C-5.512-2.605-5.512-3-5.653-3.357c-0.142-0.367-0.416-0.623-0.572-0.806\r\n\t\tC-6.588-4.568-6.94-4.976-7.249-5.397c-0.297-0.416-0.579-0.874-0.656-1.26C-7.946-6.852-7.93-6.985-7.868-7.063\r\n\t\tc0.021-0.051,0.283-0.27,0.404-0.316c0.314-0.147,0.536-0.092,0.872,0.196c0.154,0.141,0.301,0.324,0.437,0.523\r\n\t\tc0.132,0.188,0.26,0.424,0.424,0.677C-5.378-5.469-4.997-4.94-4.24-4.616c0.378,0.149,0.877,0.162,1.267-0.006\r\n\t\tc0.102-0.036,0.187-0.086,0.277-0.134c0.159-0.103,0.136-0.093,0.223-0.156c0.186-0.156,0.307-0.297,0.409-0.426\r\n\t\tc0.404-0.539,0.656-1.099,0.831-1.703c0.087-0.301,0.152-0.612,0.175-0.947c0.014-0.165,0.016-0.337-0.001-0.517\r\n\t\tc-0.011-0.091-0.011-0.176-0.035-0.272l-0.031-0.141l-0.015-0.071l-0.004-0.017c0.044,0.207,0.011,0.053,0.021,0.098l-0.001-0.006\r\n\t\tl-0.003-0.025l-0.015-0.103c0-0.01-0.008-0.048-0.003-0.037c0.01,0.029,0.014,0.062,0.013,0.096\r\n\t\tc-0.021,0.142-0.072,0.226-0.145,0.281c-0.105,0.084-0.107,0.044-0.034,0.054c0.132,0.001,0.36,0.048,0.567,0.127\r\n\t\tc0.416,0.146,0.857,0.408,1.093,0.68c0.059,0.045,0.119,0.178,0.108,0.13l0.076,0.192C0.529-7.493,0.522-7.487,0.528-7.473\r\n\t\tc0.013,0.117-0.009,0.308-0.07,0.485C0.33-6.62,0.06-6.251-0.274-5.982c-0.332,0.277-0.731,0.441-1.123,0.493l-0.045,1.415\r\n\t\tc0.598,0.1,1.229,0.136,1.87,0.007c0.637-0.116,1.277-0.414,1.781-0.871c0.249-0.23,0.469-0.492,0.642-0.776\r\n\t\tC2.896-5.785,2.932-5.858,2.972-5.93L3.03-6.039l0.002-0.003c0.048-0.082-0.063,0.106-0.051,0.086l0.003-0.005l0.007-0.011\r\n\t\tl0.015-0.021l0.027-0.042C3.05-6.074,3.166-6.218,3.037-6.047C2.989-6,2.927-5.976,2.869-5.963c-0.061,0.03-0.141,0.04-0.211,0.024\r\n\t\tc-0.125-0.029-0.15-0.039-0.186-0.077C2.475-6,2.478-6.006,2.494-5.988c0.038,0.059,0.083,0.125,0.125,0.223\r\n\t\tC2.707-5.583,2.78-5.363,2.832-5.142C2.888-4.92,2.917-4.694,2.929-4.483C2.935-4.291,2.91-4.06,2.882-4.028\r\n\t\tc-0.004,0.01,0.001-0.023,0.019-0.02c0.013-0.01-0.022,0.023,0.032-0.023l-0.02,0.016L2.875-4.022L2.797-3.958\r\n\t\tC2.705-3.891,2.666-3.861,2.551-3.792C2.358-3.67,2.137-3.56,1.916-3.457C1.468-3.254,0.993-3.088,0.527-2.981\r\n\t\tC0.297-2.936,0.063-2.89-0.141-2.889C-0.34-2.88-0.537-2.912-0.58-2.941l-0.853,1.07C-1.221-1.636-1.004-1.4-0.718-1.168\r\n\t\tc0.141,0.114,0.313,0.233,0.527,0.329c0.217,0.096,0.493,0.152,0.742,0.136c0.497-0.045,0.766-0.194,1.038-0.28l0.197-0.069\r\n\t\tl0.012-0.003C1.661-1.02,1.761-1.047,1.731-1.039h0.003l0.007-0.001l0.027-0.006l0.054-0.012c0.029-0.006,0.083-0.021,0.096-0.02\r\n\t\tc-0.07,0.028-0.066,0-0.098-0.012c-0.06-0.056,0.01-0.035-0.03,0.084C1.762-0.899,1.665-0.76,1.514-0.644\r\n\t\tC1.367-0.521,1.149-0.438,0.931-0.36C0.852-0.342,0.65-0.286,0.543-0.27C0.424-0.255,0.32-0.229,0.182-0.222\r\n\t\tC-0.853-0.13-2.009-0.329-2.994-0.704c-0.109-0.045-0.245-0.11-0.281-0.135L-3.29-0.847l-0.123-0.08l-0.006-0.004l-0.012-0.006\r\n\t\tl-0.026-0.012c-0.037-0.014,0.016-0.002-0.106-0.041c-0.09-0.027-0.196-0.039-0.293-0.032c-0.306,0.046-0.388,0.138-0.493,0.207\r\n\t\tc-0.359,0.292-0.499,0.536-0.694,0.79c-0.352,0.49-0.671,1.003-1.004,1.354l-0.042,0.045l-0.011,0.017\r\n\t\tc-0.995,1.434-1.647,2.951-2.408,4.405c-0.375,0.727-0.758,1.444-1.199,2.11c-0.444,0.649-0.942,1.304-1.572,1.626\r\n\t\tc-0.312,0.153-0.65,0.201-0.986,0.107c-0.164-0.048-0.341-0.133-0.484-0.213c-0.166-0.116-0.355-0.228-0.501-0.349\r\n\t\tc-0.612-0.459-1.075-1.126-1.25-1.9c-0.182-0.774-0.167-1.603-0.152-2.423c0.02-0.822,0.055-1.649,0.059-2.474\r\n\t\tc-0.07,0.822-0.17,1.64-0.256,2.463c-0.077,0.822-0.138,1.66,0.003,2.508c0.075,0.423,0.226,0.837,0.439,1.222\r\n\t\tc0.228,0.377,0.512,0.708,0.851,1.003c0.165,0.15,0.328,0.257,0.492,0.388c0.208,0.139,0.398,0.24,0.626,0.325\r\n\t\tc0.453,0.163,0.989,0.125,1.423-0.064c0.88-0.391,1.435-1.102,1.938-1.78c0.494-0.692,0.917-1.417,1.325-2.142\r\n\t\tc0.815-1.439,1.544-2.941,2.483-4.188l-0.054,0.061c0.497-0.492,0.808-0.989,1.165-1.441c0.163-0.212,0.368-0.46,0.478-0.531\r\n\t\tc0.011-0.021,0.063-0.004-0.1,0.019c-0.06,0.005-0.128-0.008-0.183-0.035c-0.083-0.048-0.004-0.004-0.004-0.004l0.024,0.012\r\n\t\tL-3.93,0.1l0.006,0.003l0.003,0.001c0.026,0.018-0.222-0.146-0.115-0.075l0.075,0.057c0.204,0.146,0.342,0.203,0.5,0.281\r\n\t\tc0.604,0.265,1.204,0.436,1.828,0.554c0.624,0.112,1.265,0.162,1.922,0.114C0.449,1.03,0.634,0.996,0.808,0.971\r\n\t\tc0.185-0.03,0.267-0.055,0.476-0.103C1.623,0.76,1.97,0.636,2.29,0.393C2.607,0.156,2.908-0.178,3.05-0.64\r\n\t\tc0.146-0.433,0.097-1.105-0.444-1.522c-0.269-0.2-0.576-0.265-0.937-0.229L1.548-2.369L1.494-2.358L1.37-2.326L1.146-2.253\r\n\t\tc-0.286,0.099-0.565,0.194-0.663,0.19C0.417-2.06,0.335-2.088,0.148-2.24c-0.169-0.142-0.354-0.343-0.536-0.548l-0.854,1.07\r\n\t\tC-0.8-1.495-0.438-1.497-0.104-1.495c0.336-0.003,0.633-0.061,0.933-0.118c0.584-0.131,1.132-0.322,1.669-0.56\r\n\t\tc0.267-0.122,0.53-0.251,0.794-0.414C3.411-2.653,3.59-2.78,3.713-2.875L3.79-2.94l0.039-0.031l0.02-0.017\r\n\t\tc0.065-0.059,0.039-0.04,0.063-0.064c0.092-0.107,0.195-0.241,0.246-0.352c0.211-0.46,0.187-0.788,0.196-1.128\r\n\t\tc-0.014-0.327-0.057-0.637-0.13-0.939C4.153-5.774,4.06-6.069,3.918-6.375c-0.064-0.15-0.16-0.313-0.275-0.477\r\n\t\tC3.576-6.939,3.48-7.038,3.393-7.122c-0.149-0.1-0.287-0.213-0.544-0.244C2.711-7.38,2.563-7.369,2.435-7.337\r\n\t\tC2.319-7.296,2.204-7.227,2.1-7.144c-0.258,0.23-0.194,0.221-0.255,0.289L1.817-6.812l-0.08,0.131L1.699-6.612\r\n\t\tC1.673-6.567,1.651-6.518,1.622-6.476C1.514-6.299,1.38-6.148,1.234-6.012C0.653-5.465-0.269-5.32-1.195-5.482L-1.24-4.068\r\n\t\tc0.702-0.09,1.353-0.386,1.866-0.817c0.517-0.43,0.931-0.973,1.168-1.649c0.11-0.346,0.178-0.711,0.124-1.143\r\n\t\tc-0.021-0.12-0.05-0.25-0.083-0.359L1.758-8.228C1.613-8.515,1.528-8.619,1.392-8.771c-0.508-0.545-1.066-0.834-1.68-1.061\r\n\t\tc-0.31-0.108-0.627-0.191-1.046-0.191c-0.201,0.006-0.488,0.021-0.816,0.266c-0.171,0.155-0.309,0.345-0.34,0.633\r\n\t\tC-2.5-9.058-2.503-8.992-2.502-8.929C-2.5-8.883-2.497-8.887-2.494-8.864l0.017,0.103l0.051,0.241\r\n\t\tc0.014,0.037,0.012,0.092,0.021,0.137c0.01,0.094,0.013,0.2,0.005,0.309c-0.009,0.217-0.052,0.45-0.113,0.678\r\n\t\tc-0.12,0.457-0.329,0.92-0.581,1.268l-0.15,0.181C-3.268-5.927-3.4-5.831-3.357-5.861c-0.032,0.017-0.064,0.041-0.094,0.048\r\n\t\tc-0.12,0.052-0.208,0.05-0.345,0.009c-0.28-0.095-0.639-0.463-0.897-0.85c-0.142-0.205-0.277-0.455-0.47-0.713\r\n\t\tc-0.184-0.249-0.39-0.494-0.652-0.716c-0.259-0.219-0.591-0.425-1.002-0.5c-0.41-0.079-0.851,0.021-1.171,0.203\r\n\t\tC-8.141-8.302-8.35-8.146-8.426-8.071l-0.078,0.068l-0.02,0.018l-0.033,0.029l-0.013,0.015l-0.053,0.062\r\n\t\tC-8.69-7.795-8.765-7.719-8.815-7.62c-0.239,0.397-0.221,0.865-0.133,1.197c0.184,0.692,0.546,1.166,0.895,1.634\r\n\t\tc0.36,0.456,0.746,0.869,1.133,1.272c0.211,0.223,0.353,0.353,0.416,0.507c0.067,0.156,0.082,0.335,0.041,0.538\r\n\t\tc-0.08,0.402-0.381,0.857-0.702,1.191l-0.047,0.051L-7.232-1.2c-0.607,0.995-1.259,1.974-1.914,2.942\r\n\t\tc-0.328,0.485-0.665,0.963-1.014,1.43c-0.346,0.46-0.71,0.934-1.092,1.349c-0.049,0.056-0.094,0.092-0.139,0.138\r\n\t\tc-0.021,0.019-0.026,0.017-0.037,0.031c0.053-0.041,0.241,0.034,0.231,0.138c-0.006-0.026,0.032-0.221,0.063-0.344l0.205-0.864\r\n\t\tc0.059-0.289,0.118-0.6,0.143-0.889c0.03-0.296,0.069-0.566,0.149-0.847C-10.323,0.77-9.785-0.293-9.169-1.294\"/>\r\n                <path fill=\"#ADC80C\" d=\"M-9.169-1.294c0,0-1.571,2.234-1.759,3.902c-0.189,1.668-1.105,3.165,0.181,1.722\r\n\t\tC-9,2.371-6.881-0.978-6.881-0.978S-5.29-2.471-6.35-3.6c-1.06-1.131-2.826-3.015-1.821-3.957C-7.167-8.499-6.209-7.981-5.4-6.615\r\n\t\ts1.648,1.758,2.394,1.295c0.746-0.463,1.539-2.387,1.209-3.494c-0.33-1.106,2.323-0.29,2.896,0.825\r\n\t\tc0.574,1.114-0.706,3.021-2.418,3.21C0.377-4.48,1.735-5.046,2.387-6.364c0.652-1.319,1.758,2.126,1.005,2.833\r\n\t\tS0.047-1.812-0.911-2.33c1.156,1.319,1.422,0.985,2.501,0.636c1.08-0.35,1.408,1.413-0.49,1.95S-3.248-0.055-3.665-0.41\r\n\t\tc-0.416-0.355-1.304,1.417-2.02,2.113c-2.204,2.947-4.212,9.898-7.208,7.951c-2.518-1.638-1.865-3.675-1.7-7.374\"/>\r\n            </symbol>\r\n            <symbol id=\"avatarQuestion\" viewBox=\"-52.748 -52.747 105.495 105.494\">\r\n                <path fill=\"#00FFFF\" d=\"M-31.22-20.429c-0.617-0.849-0.927-1.786-0.927-2.815c0-1.798,0.478-3.186,1.428-4.163\r\n\t\tc0.951-0.976,2.068-1.465,3.354-1.465c1.079,0,1.979,0.386,2.698,1.157c0.721,0.771,1.31,1.877,1.773,3.315\r\n\t\tc0.154,0.72,0.694,1.079,1.618,1.079c0.297,0,0.62-0.015,0.965-0.043l-6.716,7.088c-0.67-0.549-1.318-1.099-1.919-1.648\r\n\t\tC-29.845-18.745-30.605-19.581-31.22-20.429z\"/>\r\n                <polygon fill=\"#00FFFF\" points=\"-0.989,-25.708 -1.718,-22.528 -1.683,-25.708 \t\"/>\r\n                <path fill=\"#00FFFF\" d=\"M35.512,12.567c0.158-0.219,0.306-0.414,0.435-0.565c-0.433-1.367-3.625-1.364-4.399-0.381\r\n\t\tc-0.057,0.072-0.129,0.175-0.205,0.284c-1.706-0.176-3.173-1.327-3.711-2.984L22.721-12.51c1.732-0.266,3.594-0.723,5.315-1.501\r\n\t\tc5.312-2.404,4.806-5.735,2.319-7.21l-8.739-4.933v-14.563c0-1.75-1.419-3.169-3.169-3.169H0.436c-0.728,0-1.39,0.255-1.925,0.667\r\n\t\tv-0.012h0l-0.053,0.056c-0.247,0.199-0.472,0.422-0.649,0.686L-15.749-28.18c-0.513-0.837-1.249-1.593-2.211-2.265\r\n\t\tc-0.976-0.682-2.171-1.232-3.585-1.651c-1.413-0.42-3.046-0.631-4.897-0.631c-2.105,0-3.957,0.368-5.55,1.103\r\n\t\tc-1.593,0.735-2.916,1.66-3.971,2.775c-1.053,1.116-1.85,2.342-2.39,3.678c-0.54,1.337-0.81,2.648-0.81,3.932\r\n\t\tc0,1.542,0.283,2.904,0.847,4.086c0.567,1.183,1.287,2.236,2.16,3.161c0.875,0.925,1.812,1.787,2.814,2.583\r\n\t\tc0.332,0.264,0.646,0.521,0.964,0.779L-51.81,9.882C-52.417,6.68-52.748,3.379-52.748,0c0-29.132,23.616-52.747,52.747-52.747\r\n\t\tc29.132,0,52.748,23.615,52.748,52.747c0,7.743-1.682,15.09-4.68,21.714L35.512,12.567z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M-30.528-9.096c0.875,0.746,1.595,1.53,2.16,2.351c0.566,0.823,0.848,1.748,0.848,2.776\r\n\t\tc0,2.004-0.436,4.292-1.311,6.861c-0.155,0.462-0.231,0.771-0.231,0.925c0,0.412,0.181,0.784,0.539,1.118\r\n\t\tc0.361,0.335,1.079,0.655,2.159,0.963c4.317-4.83,6.477-8.762,6.477-11.794c0-1.439-0.309-2.724-0.925-3.855\r\n\t\tc-0.617-1.13-1.375-2.159-2.274-3.084c-0.899-0.925-1.876-1.799-2.93-2.622c-0.35-0.273-0.678-0.546-1.011-0.819l6.716-7.088\r\n\t\tc0.314-0.025,0.646-0.061,1.002-0.111c0.745-0.102,1.439-0.243,2.082-0.424c0.643-0.179,1.183-0.411,1.618-0.694\r\n\t\tc0.438-0.282,0.656-0.603,0.656-0.963c0-0.874-0.257-1.736-0.771-2.588c-0.008-0.012-0.018-0.024-0.024-0.036l13.557-14.309\r\n\t\tc-0.342,0.506-0.542,1.115-0.542,1.772v14.73c0,0.154,0.125,0.279,0.279,0.279h0.772l-0.035,3.18l-0.246,1.072H-3.94\r\n\t\tc-1.112,0-2.014,0.901-2.014,2.013c0,1.112,0.901,2.014,2.014,2.014h1.054L-8.923,8.921c-0.191,0.589-0.509,1.106-0.902,1.549\r\n\t\tl-3.396,0.838c-1.129-0.649-3.638-0.507-4.018,0.694c0.059,0.069,0.13,0.165,0.194,0.249l-4.478,1.104\r\n\t\tc-0.04-1.463-0.553-2.72-1.564-3.756c-1.053-1.079-2.353-1.619-3.895-1.619c-1.489,0-2.762,0.54-3.815,1.619\r\n\t\tc-1.053,1.079-1.581,2.391-1.581,3.933c0,0.873,0.174,1.662,0.49,2.38l-1.926,0.476l0.112,0.189\r\n\t\tc-5.084,1.94-0.425,20.318,4.789,25.518c1.877,1.87,3.684,3.791,4.535,4.612c0.043,0.041,0.079,0.086,0.121,0.128\r\n\t\tC-38.373,39.509-48.754,25.997-51.81,9.882l19.434-20.512C-31.735-10.108-31.112-9.594-30.528-9.096z\"/>\r\n                <path fill=\"#D7D8D7\"\r\n                      d=\"M-1.49-43.23L-1.49-43.23l0,0.012c-0.019,0.014-0.036,0.03-0.053,0.044L-1.49-43.23z\"/>\r\n                <path fill=\"#1A4796\" d=\"M22.674-17.43c1.112,0,2.014-0.902,2.014-2.014c0-1.112-0.902-2.013-2.014-2.013H20.67l-0.974-4.252h1.64\r\n\t\tc0.154,0,0.279-0.125,0.279-0.279v-0.167l8.739,4.933c2.487,1.475,2.993,4.806-2.319,7.21c-1.722,0.779-3.583,1.235-5.315,1.501\r\n\t\tl-1.127-4.919H22.674z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M24.688-19.444c0,1.112-0.902,2.014-2.014,2.014h-1.081L20.97-20.15c0.039-0.002,0.073-0.011,0.112-0.011\r\n\t\tc1.006,0,1.822,0.582,1.822,1.3c0,0.295-0.139,0.566-0.371,0.784c0.713-0.245,1.206-0.763,1.206-1.366\r\n\t\tc0-0.837-0.952-1.516-2.126-1.516c-0.285,0-0.555,0.041-0.803,0.113l-0.14-0.609h2.004C23.786-21.457,24.688-20.556,24.688-19.444z\r\n\t\t\"/>\r\n                <path fill=\"#CDAE2C\" d=\"M23.739-19.444c0,0.603-0.493,1.121-1.206,1.366c0.232-0.218,0.371-0.489,0.371-0.784\r\n\t\tc0-0.718-0.816-1.3-1.822-1.3c-0.039,0-0.074,0.009-0.112,0.011l-0.16-0.697c0.248-0.072,0.519-0.113,0.803-0.113\r\n\t\tC22.787-20.96,23.739-20.281,23.739-19.444z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M-2.879-20.96c-1.174,0-2.125,0.679-2.125,1.516c0,0.603,0.493,1.121,1.206,1.366\r\n\t\tc-0.232-0.218-0.371-0.489-0.371-0.784c0-0.718,0.816-1.3,1.822-1.3c0.03,0,0.057,0.007,0.086,0.008l-0.624,2.724H-3.94\r\n\t\tc-1.112,0-2.014-0.902-2.014-2.014c0-1.112,0.901-2.013,2.014-2.013h1.977l-0.138,0.604C-2.342-20.921-2.604-20.96-2.879-20.96z\"/>\r\n                <path fill=\"#CDAE2C\" d=\"M-4.17-18.862c0,0.295,0.139,0.566,0.371,0.784c-0.713-0.245-1.206-0.763-1.206-1.366\r\n\t\tc0-0.837,0.952-1.516,2.125-1.516c0.275,0,0.537,0.039,0.777,0.107l-0.16,0.699c-0.029-0.001-0.056-0.008-0.086-0.008\r\n\t\tC-3.354-20.162-4.17-19.58-4.17-18.862z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M9.354,22.215l0,0.012L9.354,22.215l-1.997-0.018l7.344-8.324c1.081-1.225,1.307-2.705,0.947-4.011\r\n\t\tc0.041-2.6-2.309-5.037-5.327-4.363L7.331,6.237L6.11,4.783C5.544,4.109,4.54,4.022,3.867,4.588\r\n\t\tc-0.6,0.503-0.732,1.352-0.356,2.007C3.457,6.789,3.438,6.991,3.459,7.192L-9.826,10.47c0.394-0.442,0.711-0.96,0.902-1.549\r\n\t\tl6.038-26.351l0.624-2.724l0.16-0.699l0.138-0.604l0.246-1.072l0.729-3.18h20.685l0.974,4.252l0.14,0.609l0.16,0.697l0.624,2.721\r\n\t\tl1.127,4.919l4.911,21.431c0.539,1.657,2.005,2.809,3.711,2.984c-1.027,1.479-3.694,6.198-5.372,10.167L9.354,22.215z M1.815,2.002\r\n\t\tc0.351,0.087,0.706-0.063,0.899-0.344c0.449-0.661,1.739-0.923,2.948-0.945C6.9,0.679,8.186,0.799,9.47,0.927\r\n\t\tc1.286,0.13,2.581,0.284,3.888,0.352c0.652,0.031,1.309,0.043,1.963-0.008c0.651-0.051,1.309-0.162,1.902-0.431l1.662-0.755\r\n\t\tl-0.693-0.487c-0.306-0.214-0.563-0.414-0.91-0.641c-0.342-0.228-0.684-0.452-1.025-0.644c-0.68-0.401-1.397-0.752-2.137-1.05\r\n\t\tc-1.477-0.599-3.074-0.959-4.69-0.994C7.814-3.756,6.182-3.461,4.704-2.76C3.969-2.405,3.263-1.969,2.646-1.385\r\n\t\tC2.039-0.805,1.469-0.1,1.226,0.882L1.201,0.982C1.089,1.434,1.365,1.891,1.815,2.002z M7.749-19.788\r\n\t\tc-0.105-0.239-0.313-0.539-0.624-0.854c-0.31-0.312-0.744-0.624-1.279-0.81c-0.269-0.089-0.56-0.14-0.858-0.153\r\n\t\tc-0.284-0.018-0.617-0.019-0.896,0.013c-1.191,0.09-2.262,0.694-2.829,1.307c-0.297,0.298-0.501,0.574-0.629,0.78\r\n\t\tc-0.128,0.203-0.189,0.319-0.189,0.319l0.1,0.077c0,0,0.093-0.101,0.262-0.255c0.168-0.151,0.413-0.371,0.738-0.573\r\n\t\tc0.646-0.409,1.604-0.754,2.562-0.647c0.251,0.027,0.45,0.066,0.682,0.142c0.218,0.071,0.426,0.153,0.628,0.23\r\n\t\tc0.408,0.137,0.797,0.274,1.147,0.408c0.366,0.141,0.671,0.259,0.884,0.341c0.222,0.091,0.367,0.137,0.367,0.137l0.091-0.088\r\n\t\tC7.906-19.415,7.866-19.561,7.749-19.788z M18.249-19.505c-0.128-0.207-0.333-0.482-0.629-0.781\r\n\t\tc-0.567-0.612-1.638-1.217-2.829-1.307c-0.279-0.032-0.613-0.03-0.896-0.013c-0.298,0.014-0.59,0.065-0.858,0.153\r\n\t\tc-0.535,0.186-0.969,0.499-1.279,0.811c-0.311,0.314-0.519,0.614-0.625,0.854c-0.116,0.227-0.156,0.374-0.156,0.374l0.091,0.087\r\n\t\tc0,0,0.145-0.046,0.367-0.136c0.213-0.083,0.518-0.2,0.884-0.342c0.35-0.133,0.739-0.27,1.147-0.407\r\n\t\tc0.202-0.077,0.41-0.159,0.628-0.23c0.231-0.077,0.43-0.115,0.682-0.143c0.958-0.107,1.916,0.239,2.561,0.648\r\n\t\tc0.326,0.201,0.571,0.421,0.739,0.572c0.169,0.155,0.262,0.256,0.262,0.256l0.1-0.077C18.438-19.186,18.376-19.303,18.249-19.505z\r\n\t\t M19.387-13.826c0.325-2.83-1.751-5.246-4.635-5.397c-2.361-0.123-4.509,1.32-5.398,3.395c-0.889-2.075-3.038-3.518-5.398-3.395\r\n\t\tc-2.884,0.151-4.96,2.567-4.635,5.397c0.325,2.83,2.926,5.003,5.811,4.852c1.944-0.102,3.5-1.244,4.222-2.838\r\n\t\tc0.722,1.594,2.277,2.736,4.222,2.838C16.461-8.823,19.062-10.996,19.387-13.826z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M31.423,24.036c0.12-0.886-0.434-1.682-1.241-1.918c1.602-3.397,3.955-7.648,5.33-9.551l12.556,9.146\r\n\t\tc-3.727,8.236-9.497,15.35-16.679,20.676C31.056,37.136,30.737,29.133,31.423,24.036z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M-28.912,42.095c-5.214-5.199-9.873-23.577-4.789-25.518l1.413,2.381l16.756,29.184l2.661-3.017\r\n\t\tc-0.118,1.569-0.209,2.531-0.209,2.531c-0.125,1.25-0.575,2.287-1.265,3.101c-3.462-0.977-6.777-2.296-9.911-3.922\r\n\t\tc-0.042-0.042-0.078-0.087-0.121-0.128C-25.228,45.886-27.035,43.965-28.912,42.095z\"/>\r\n                <path fill=\"#077FBD\" d=\"M9.354,22.215l16.617-0.143c-0.582,1.375-1.046,2.661-1.278,3.686c-0.073,0.322-0.091,0.607-0.083,0.872\r\n\t\tc-0.345,2.951,3.498,3.192,3.937-0.064c0.057-0.423,0.207-0.983,0.413-1.621c0.299-0.794,0.721-1.764,1.222-2.826\r\n\t\tc0.808,0.236,1.361,1.032,1.241,1.918c-0.686,5.097-0.367,13.1-0.035,18.354c-6.066,4.499-13.129,7.73-20.8,9.293L9.354,22.227\r\n\t\tL9.354,22.215z\"/>\r\n                <path fill=\"#077FBD\" d=\"M-12.871,45.125L7.357,22.197l1.996,0.018l0,0.012l1.235,29.456C7.168,52.38,3.626,52.747,0,52.747\r\n\t\tc-4.974,0-9.781-0.703-14.344-1.99c0.689-0.813,1.14-1.851,1.265-3.101C-13.08,47.656-12.989,46.694-12.871,45.125z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M13.576-8.974c-1.944-0.102-3.5-1.244-4.222-2.838c0.349-0.77,0.519-1.637,0.413-2.559\r\n\t\tc-0.059-0.515-0.216-0.996-0.413-1.457c0.889-2.075,3.037-3.518,5.398-3.395c2.884,0.151,4.96,2.567,4.635,5.397\r\n\t\tC19.062-10.996,16.461-8.823,13.576-8.974z M12.696-18.078c-1.413,0-2.559,1.146-2.559,2.559s1.146,2.559,2.559,2.559\r\n\t\ts2.559-1.146,2.559-2.559S14.109-18.078,12.696-18.078z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M9.354-11.812c-0.722,1.594-2.278,2.736-4.222,2.838c-2.885,0.151-5.486-2.022-5.811-4.852\r\n\t\tc-0.325-2.83,1.751-5.246,4.635-5.397c2.36-0.123,4.509,1.32,5.398,3.395c0.197,0.461,0.354,0.942,0.413,1.457\r\n\t\tC9.873-13.449,9.703-12.582,9.354-11.812z M5.868-18.078c-1.413,0-2.559,1.146-2.559,2.559s1.146,2.559,2.559,2.559\r\n\t\tc1.413,0,2.559-1.146,2.559-2.559S7.281-18.078,5.868-18.078z\"/>\r\n                <path fill=\"#1A2451\" d=\"M12.696-12.959c-1.413,0-2.559-1.146-2.559-2.559s1.146-2.559,2.559-2.559s2.559,1.146,2.559,2.559\r\n\t\tS14.109-12.959,12.696-12.959z\"/>\r\n                <path fill=\"#1A2451\" d=\"M5.868-12.959c-1.413,0-2.559-1.146-2.559-2.559s1.146-2.559,2.559-2.559c1.413,0,2.559,1.146,2.559,2.559\r\n\t\tS7.281-12.959,5.868-12.959z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M5.524-0.848C6.71-1.296,8.021-1.424,9.293-1.297c1.277,0.136,2.527,0.524,3.689,1.112\r\n\t\tc0.582,0.293,1.147,0.627,1.685,1.011c0.088,0.059,0.168,0.126,0.251,0.187c-0.507-0.036-1.013-0.083-1.516-0.164\r\n\t\tc-1.27-0.207-2.527-0.5-3.798-0.772C8.332-0.195,7.05-0.464,5.698-0.579C5.466-0.597,5.229-0.601,4.992-0.605\r\n\t\tC5.168-0.689,5.342-0.778,5.524-0.848z\"/>\r\n                <path fill=\"#F3901E\" d=\"M1.226,0.882C1.469-0.1,2.039-0.805,2.646-1.385C3.263-1.969,3.969-2.405,4.704-2.76\r\n\t\tC6.182-3.461,7.814-3.756,9.43-3.73c1.616,0.035,3.213,0.396,4.69,0.994c0.74,0.298,1.457,0.648,2.137,1.05\r\n\t\tc0.341,0.191,0.683,0.416,1.025,0.644c0.347,0.227,0.604,0.427,0.91,0.641l0.693,0.487L17.223,0.84\r\n\t\tc-0.593,0.269-1.251,0.38-1.902,0.431c-0.654,0.051-1.311,0.039-1.963,0.008c-1.307-0.067-2.602-0.222-3.888-0.352\r\n\t\tC8.186,0.799,6.9,0.679,5.663,0.713C4.454,0.735,3.164,0.997,2.714,1.658C2.521,1.939,2.167,2.089,1.815,2.002\r\n\t\tc-0.451-0.111-0.726-0.568-0.615-1.02L1.226,0.882z M9.604,0.076c1.271,0.272,2.528,0.565,3.798,0.772\r\n\t\tc0.503,0.081,1.009,0.128,1.516,0.164c-0.083-0.061-0.163-0.128-0.251-0.187c-0.538-0.384-1.103-0.718-1.685-1.011\r\n\t\tc-1.162-0.588-2.412-0.977-3.689-1.112C8.021-1.424,6.71-1.296,5.524-0.848C5.342-0.778,5.168-0.689,4.992-0.605\r\n\t\tc0.237,0.005,0.474,0.009,0.706,0.026C7.05-0.464,8.332-0.195,9.604,0.076z\"/>\r\n                <path fill=\"#004B77\" d=\"M28.583,26.083c0.078-0.31,0.212-0.702,0.376-1.139c-0.206,0.638-0.355,1.198-0.413,1.621\r\n\t\tc-0.439,3.257-4.282,3.016-3.937,0.064C24.686,29.043,27.83,29.059,28.583,26.083z\"/>\r\n                <path fill=\"#077FBD\" d=\"M28.96,24.944c-0.164,0.437-0.298,0.829-0.376,1.139c-0.754,2.976-3.897,2.96-3.973,0.547\r\n\t\tc-0.008-0.265,0.009-0.55,0.083-0.872c0.232-1.024,0.696-2.311,1.278-3.686c1.678-3.969,4.345-8.688,5.372-10.167\r\n\t\tc0.076-0.109,0.148-0.212,0.205-0.284c0.774-0.983,3.966-0.986,4.399,0.381c-0.129,0.151-0.277,0.347-0.435,0.565\r\n\t\tc-1.375,1.902-3.728,6.153-5.33,9.551C29.681,23.181,29.259,24.15,28.96,24.944z M26.417,27.698c0.8,0,1.449-0.647,1.449-1.447\r\n\t\tc0-0.801-0.649-1.448-1.449-1.448c-0.799,0-1.448,0.647-1.448,1.448C24.969,27.051,25.618,27.698,26.417,27.698z\"/>\r\n                <path fill=\"#FDD129\" d=\"M26.417,24.803c0.8,0,1.449,0.647,1.449,1.448c0,0.8-0.649,1.447-1.449,1.447\r\n\t\tc-0.799,0-1.448-0.647-1.448-1.447C24.969,25.45,25.618,24.803,26.417,24.803z\"/>\r\n                <path fill=\"#077FBD\"\r\n                      d=\"M-17.044,12.251c-0.064-0.084-0.136-0.18-0.194-0.249c0.38-1.201,2.889-1.344,4.018-0.694L-17.044,12.251z\"\r\n                />\r\n                <path fill=\"#077FBD\" d=\"M21.336-25.708h-1.64H-0.989h-0.694h-0.772c-0.154,0-0.279-0.125-0.279-0.279v-14.73\r\n\t\tc0-0.657,0.2-1.266,0.542-1.772c0.178-0.263,0.403-0.487,0.649-0.686c0.018-0.014,0.035-0.03,0.053-0.044\r\n\t\tc0.535-0.412,1.197-0.667,1.925-0.667h18.011c1.75,0,3.169,1.419,3.169,3.169v14.563v0.167\r\n\t\tC21.616-25.833,21.491-25.708,21.336-25.708z\"/>\r\n                <path fill=\"#1A2451\" d=\"M10.474,6.718L8.167,7.232L7.331,6.237l2.991-0.738c3.019-0.674,5.368,1.764,5.327,4.363\r\n\t\tC15.076,7.784,13.011,6.151,10.474,6.718z\"/>\r\n                <path fill=\"#1A2451\" d=\"M3.459,7.192c0.032,0.305,0.152,0.604,0.364,0.856l0.108,0.129l-25.466,5.682\r\n\t\tc0.006-0.11,0.028-0.214,0.028-0.327c0-0.062-0.014-0.116-0.016-0.177l4.478-1.104l3.823-0.943l3.396-0.838L3.459,7.192z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-31.767,16.143l-1.894,0.423l1.373,2.393l-1.413-2.381l-0.112-0.189l1.926-0.476\r\n\t\tC-31.852,15.992-31.806,16.065-31.767,16.143z\"/>\r\n                <path fill=\"#1A2451\" d=\"M7.433,7.396L6.262,6.002C5.696,5.328,4.692,5.241,4.02,5.806C3.765,6.02,3.594,6.297,3.511,6.595\r\n\t\tC3.135,5.939,3.267,5.091,3.867,4.588C4.54,4.022,5.544,4.109,6.11,4.783l1.221,1.454l0.836,0.995L7.433,7.396z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M-33.661,16.565l1.894-0.423c0.251,0.502,0.559,0.976,0.971,1.398c1.054,1.08,2.326,1.619,3.815,1.619\r\n\t\tc1.542,0,2.842-0.539,3.895-1.619c0.979-1.002,1.482-2.235,1.552-3.682L3.931,8.178l2.165,2.578c0.565,0.673,1.57,0.76,2.243,0.195\r\n\t\tc0.673-0.565,0.761-1.57,0.195-2.243L7.433,7.396l0.733-0.164l2.307-0.515c2.537-0.566,4.603,1.066,5.175,3.145\r\n\t\tc0.36,1.306,0.134,2.786-0.947,4.011l-7.344,8.324l-20.228,22.928l-2.661,3.017l-16.756-29.184L-33.661,16.565z\"/>\r\n                <path fill=\"#FFDB16\" d=\"M6.262,6.002l1.171,1.395l1.101,1.312c0.566,0.673,0.478,1.678-0.195,2.243\r\n\t\tc-0.673,0.564-1.678,0.478-2.243-0.195L3.931,8.178L3.823,8.049C3.611,7.796,3.491,7.497,3.459,7.192\r\n\t\tC3.438,6.991,3.457,6.789,3.511,6.595C3.594,6.297,3.765,6.02,4.02,5.806C4.692,5.241,5.696,5.328,6.262,6.002z\"/>\r\n                <path fill=\"#1A2451\" d=\"M18.075-19.365c-0.168-0.151-0.413-0.371-0.739-0.572c-0.645-0.409-1.603-0.755-2.561-0.648\r\n\t\tc-0.252,0.028-0.451,0.066-0.682,0.143c-0.218,0.071-0.426,0.153-0.628,0.23c-0.408,0.137-0.797,0.274-1.147,0.407\r\n\t\tc-0.366,0.142-0.671,0.259-0.884,0.342c-0.222,0.09-0.367,0.136-0.367,0.136l-0.091-0.087c0,0,0.04-0.147,0.156-0.374\r\n\t\tc0.106-0.24,0.314-0.54,0.625-0.854c0.31-0.312,0.744-0.625,1.279-0.811c0.268-0.088,0.56-0.139,0.858-0.153\r\n\t\tc0.283-0.017,0.617-0.019,0.896,0.013c1.191,0.09,2.262,0.695,2.829,1.307c0.296,0.299,0.501,0.574,0.629,0.781\r\n\t\tc0.128,0.202,0.189,0.319,0.189,0.319l-0.1,0.077C18.337-19.109,18.244-19.21,18.075-19.365z\"/>\r\n                <path fill=\"#1A2451\" d=\"M7.448-19.463c-0.213-0.082-0.518-0.2-0.884-0.341c-0.35-0.134-0.739-0.271-1.147-0.408\r\n\t\tc-0.202-0.077-0.41-0.159-0.628-0.23c-0.232-0.076-0.431-0.115-0.682-0.142c-0.958-0.107-1.916,0.238-2.562,0.647\r\n\t\tc-0.325,0.202-0.57,0.422-0.738,0.573c-0.169,0.154-0.262,0.255-0.262,0.255l-0.1-0.077c0,0,0.061-0.116,0.189-0.319\r\n\t\tc0.128-0.206,0.332-0.482,0.629-0.78c0.567-0.613,1.638-1.217,2.829-1.307c0.279-0.032,0.612-0.031,0.896-0.013\r\n\t\tc0.298,0.013,0.589,0.064,0.858,0.153c0.535,0.186,0.969,0.498,1.279,0.81c0.311,0.315,0.519,0.615,0.624,0.854\r\n\t\tc0.117,0.228,0.157,0.374,0.157,0.374l-0.091,0.088C7.815-19.326,7.67-19.373,7.448-19.463z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-14.953-25.556c0,0.36-0.219,0.681-0.656,0.963c-0.436,0.283-0.976,0.515-1.618,0.694\r\n\t\tc-0.643,0.181-1.337,0.322-2.082,0.424c-0.355,0.05-0.688,0.085-1.002,0.111c-0.345,0.028-0.668,0.043-0.965,0.043\r\n\t\tc-0.924,0-1.464-0.359-1.618-1.079c-0.464-1.438-1.053-2.544-1.773-3.315c-0.719-0.771-1.619-1.157-2.698-1.157\r\n\t\tc-1.285,0-2.402,0.489-3.354,1.465c-0.95,0.977-1.428,2.365-1.428,4.163c0,1.029,0.31,1.966,0.927,2.815\r\n\t\tc0.615,0.848,1.375,1.684,2.274,2.505c0.601,0.55,1.249,1.099,1.919,1.648c0.333,0.273,0.661,0.546,1.011,0.819\r\n\t\tc1.054,0.823,2.03,1.697,2.93,2.622c0.899,0.925,1.657,1.954,2.274,3.084c0.616,1.131,0.925,2.416,0.925,3.855\r\n\t\tc0,3.033-2.159,6.964-6.477,11.794c-1.08-0.308-1.798-0.628-2.159-0.963c-0.358-0.334-0.539-0.706-0.539-1.118\r\n\t\tc0-0.153,0.076-0.463,0.231-0.925c0.875-2.569,1.311-4.857,1.311-6.861c0-1.028-0.281-1.954-0.848-2.776\r\n\t\tc-0.565-0.821-1.285-1.605-2.16-2.351c-0.584-0.498-1.207-1.012-1.849-1.534c-0.317-0.258-0.632-0.515-0.964-0.779\r\n\t\tc-1.003-0.796-1.939-1.658-2.814-2.583c-0.873-0.925-1.593-1.978-2.16-3.161c-0.563-1.182-0.847-2.544-0.847-4.086\r\n\t\tc0-1.284,0.27-2.595,0.81-3.932c0.54-1.336,1.337-2.562,2.39-3.678c1.055-1.115,2.378-2.04,3.971-2.775\r\n\t\tc1.593-0.735,3.444-1.103,5.55-1.103c1.852,0,3.484,0.211,4.897,0.631c1.414,0.419,2.609,0.969,3.585,1.651\r\n\t\tc0.962,0.672,1.698,1.428,2.211,2.265c0.007,0.012,0.017,0.024,0.024,0.036C-15.209-27.292-14.953-26.43-14.953-25.556z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-21.535,13.859c-0.069,1.446-0.573,2.68-1.552,3.682c-1.053,1.08-2.353,1.619-3.895,1.619\r\n\t\tc-1.489,0-2.762-0.539-3.815-1.619c-0.412-0.423-0.72-0.896-0.971-1.398c-0.039-0.077-0.085-0.15-0.12-0.23\r\n\t\tc-0.316-0.718-0.49-1.507-0.49-2.38c0-1.542,0.528-2.854,1.581-3.933c1.054-1.079,2.326-1.619,3.815-1.619\r\n\t\tc1.542,0,2.842,0.54,3.895,1.619c1.012,1.036,1.524,2.293,1.564,3.756c0.002,0.061,0.016,0.115,0.016,0.177\r\n\t\tC-21.506,13.646-21.529,13.749-21.535,13.859z\"/>\r\n            </symbol>\r\n            <symbol id=\"avatarSad\" viewBox=\"-47.702 -47.703 95.404 95.406\">\r\n                <path fill=\"#00FFFF\" d=\"M16.584-15.424c1.087-0.282,2.177-0.644,3.219-1.115c5.853-2.648,5.295-6.318,2.555-7.944l-9.713-5.482\r\n\t\tc0.053-0.115,0.085-0.241,0.085-0.376v-8.708c0-3.083-1.349-5.844-3.479-7.75C31.167-42.49,47.702-23.18,47.702,0\r\n\t\tc0,1.967-0.133,3.9-0.364,5.805L16.584-15.424z\"/>\r\n                <path fill=\"#00FFFF\" d=\"M23.673,11.701c-0.063,0.079-0.142,0.192-0.226,0.313c-1.879-0.192-3.496-1.462-4.089-3.287L17.346-0.06\r\n\t\tl3.74,3.705l6.612,7.632C26.471,10.682,24.316,10.884,23.673,11.701z\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-13.859-41.244l-33.464,35.32c2.463-19.866,17.129-35.935,36.271-40.478\r\n\t\tC-12.439-45.013-13.431-43.234-13.859-41.244z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M-20.917,8.727c-0.592,1.825-2.209,3.094-4.089,3.287c-0.083-0.12-0.163-0.233-0.226-0.313\r\n\t\tc-0.839-1.066-4.25-1.083-4.813,0.352h-0.496l7.286-8.408l4.531-4.489L-20.917,8.727z\"/>\r\n                <path fill=\"#00D9D7\" d=\"M-14.095-39.049v8.708c0,0.505,0.409,0.915,0.915,0.915h1.007l-1.074,4.685h-2.178\r\n\t\tc-1.226,0-2.219,0.993-2.219,2.219c0,1.225,0.993,2.218,2.219,2.218h1.161l-0.977,4.261c-0.175,0.011-0.352,0.026-0.531,0.058\r\n\t\tc-0.745-0.144-1.557-0.11-2.396,0.158l-29.322,20.24C-47.625,2.959-47.702,1.488-47.702,0c0-2.008,0.139-3.981,0.379-5.924\r\n\t\tl33.464-35.32C-14.01-40.536-14.095-39.803-14.095-39.049z\"/>\r\n                <path fill=\"#253B8C\" d=\"M13.693-15.998l-0.987-4.307h1.19c1.226,0,2.219-0.993,2.219-2.218c0-1.226-0.993-2.219-2.219-2.219H11.69\r\n\t\tl-1.074-4.685h1.199c0.37,0,0.686-0.223,0.83-0.539l9.713,5.482c2.74,1.626,3.298,5.296-2.555,7.944\r\n\t\tc-1.042,0.472-2.132,0.833-3.219,1.115l-0.586-0.404C15.193-16.085,14.414-16.123,13.693-15.998z\"/>\r\n                <path fill=\"#FDD302\" d=\"M12.143-23.314c1.108,0,2.007,0.641,2.007,1.432c0,0.325-0.153,0.624-0.409,0.864\r\n\t\tc0.785-0.27,1.329-0.841,1.329-1.505c0-0.923-1.048-1.671-2.342-1.671c-0.313,0-0.611,0.044-0.884,0.124l-0.154-0.671h2.207\r\n\t\tc1.226,0,2.219,0.993,2.219,2.219c0,1.225-0.993,2.218-2.219,2.218h-1.19l-0.687-2.998C12.062-23.304,12.1-23.314,12.143-23.314z\"\r\n                />\r\n                <path fill=\"#D6B406\" d=\"M15.07-22.523c0,0.664-0.544,1.235-1.329,1.505c0.256-0.24,0.409-0.539,0.409-0.864\r\n\t\tc0-0.791-0.899-1.432-2.007-1.432c-0.043,0-0.081,0.01-0.124,0.012l-0.176-0.768c0.273-0.08,0.571-0.124,0.884-0.124\r\n\t\tC14.022-24.194,15.07-23.446,15.07-22.523z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-14.256-24.194c-1.294,0-2.342,0.748-2.342,1.671c0,0.664,0.544,1.235,1.329,1.505\r\n\t\tc-0.256-0.24-0.409-0.539-0.409-0.864c0-0.791,0.899-1.432,2.007-1.432c0.033,0,0.063,0.008,0.095,0.009l-0.688,3h-1.161\r\n\t\tc-1.226,0-2.219-0.993-2.219-2.218c0-1.226,0.993-2.219,2.219-2.219h2.178l-0.152,0.666\r\n\t\tC-13.666-24.151-13.954-24.194-14.256-24.194z\"/>\r\n                <path fill=\"#D6B406\" d=\"M-15.678-21.882c0,0.325,0.153,0.624,0.409,0.864c-0.785-0.27-1.329-0.841-1.329-1.505\r\n\t\tc0-0.923,1.048-1.671,2.342-1.671c0.303,0,0.591,0.043,0.856,0.118l-0.177,0.771c-0.032-0.001-0.062-0.009-0.095-0.009\r\n\t\tC-14.779-23.314-15.678-22.673-15.678-21.882z\"/>\r\n                <path fill=\"#FDD302\" d=\"M23.536,25.38c0.132-0.976-0.478-1.853-1.367-2.113c1.949-4.133,4.91-9.418,6.309-11.091l0.084,0.097\r\n\t\tl4.231,22.354c-2.859,2.709-6.051,5.068-9.512,7.008C23.033,36.269,22.938,29.822,23.536,25.38z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-30.541,12.053h0.496c-0.01,0.023-0.024,0.044-0.032,0.068c1.381,1.619,4.384,6.974,6.351,11.146\r\n\t\tc-0.89,0.261-1.498,1.138-1.367,2.113c0.565,4.202,0.512,10.198,0.295,15.377c-9.523-5.808-16.841-14.864-20.438-25.624\r\n\t\tl10.021,2.315L-30.541,12.053z\"/>\r\n                <path fill=\"#FDD302\" d=\"M11.844-24.07l0.176,0.768l0.687,2.998l0.987,4.307c-0.03,0.005-0.062,0.007-0.092,0.012\r\n\t\tc-1.361-0.241-2.614,0.113-3.591,0.829c0.127-0.378,0.218-0.771,0.265-1.178c0.263-2.294-0.908-4.338-2.81-5.326\r\n\t\tc0.053-0.026,0.121-0.047,0.17-0.075c0.406-0.214,0.71-0.436,0.912-0.608c0.201-0.168,0.304-0.271,0.304-0.271l-0.068-0.092\r\n\t\tc0,0-0.127,0.08-0.352,0.196c-0.222,0.114-0.547,0.277-0.953,0.398c-0.209,0.065-0.442,0.118-0.688,0.155\r\n\t\tc-0.505-0.181-1.048-0.294-1.622-0.324c-0.284-0.015-0.563-0.002-0.841,0.022c-0.174-0.077-0.336-0.158-0.501-0.267\r\n\t\tc-0.217-0.14-0.42-0.291-0.615-0.437c-0.399-0.28-0.768-0.563-1.088-0.829c-0.326-0.279-0.599-0.512-0.79-0.676\r\n\t\tc-0.193-0.174-0.319-0.274-0.319-0.274l-0.102,0.053c0,0,0.009,0.161,0.075,0.428c0.053,0.274,0.192,0.643,0.432,1.056\r\n\t\tc0.239,0.412,0.601,0.859,1.099,1.214c0.059,0.041,0.134,0.063,0.197,0.101c-1.546,0.585-2.829,1.773-3.494,3.281\r\n\t\tc-0.678-1.539-1.999-2.748-3.589-3.319c0.07-0.04,0.153-0.062,0.22-0.106c0.507-0.342,0.881-0.779,1.131-1.184\r\n\t\tc0.251-0.407,0.4-0.772,0.46-1.045c0.074-0.265,0.086-0.425,0.086-0.425l-0.1-0.056c0,0-0.129,0.097-0.327,0.266\r\n\t\tc-0.194,0.158-0.473,0.384-0.808,0.654c-0.326,0.257-0.702,0.53-1.109,0.799c-0.199,0.142-0.404,0.287-0.627,0.421\r\n\t\tc-0.221,0.136-0.428,0.231-0.677,0.322c-0.201-0.01-0.403-0.011-0.607,0c-0.442,0.023-0.866,0.099-1.27,0.214\r\n\t\tc-0.4-0.038-0.784-0.11-1.107-0.221c-0.402-0.132-0.723-0.304-0.942-0.423c-0.222-0.122-0.347-0.206-0.347-0.206l-0.069,0.091\r\n\t\tc0,0,0.1,0.105,0.297,0.279c0.197,0.177,0.495,0.407,0.895,0.631c0.111,0.067,0.254,0.123,0.386,0.183\r\n\t\tc-1.984,0.958-3.218,3.048-2.948,5.399c0.357,3.118,3.224,5.511,6.401,5.345c2.127-0.111,3.849-1.342,4.652-3.077\r\n\t\tc0.803,1.735,2.526,2.966,4.652,3.077c1.602,0.083,3.123-0.484,4.285-1.465c-0.353,1.298-0.181,2.759,0.777,4.063l8.41,8.332\r\n\t\tl2.013,8.786c0.593,1.825,2.21,3.095,4.089,3.287c-1.131,1.629-4.07,6.829-5.919,11.202l-18.307,0.156l-18.308-0.156\r\n\t\tc-1.849-4.373-4.787-9.573-5.919-11.202c1.88-0.193,3.497-1.462,4.089-3.287l2.193-9.571l7.617-7.547\r\n\t\tc2.506-3.409-0.279-7.903-4.135-7.652l0.977-4.261l0.688-3l0.177-0.771l0.152-0.666l1.074-4.685h22.79l1.074,4.685L11.844-24.07z\r\n\t\t M-11.058,1.288l2.24-0.622c0.621-0.172,1.303-0.303,1.979-0.419c0.681-0.115,1.368-0.212,2.058-0.299\r\n\t\tC-3.4-0.221-2.008-0.343-0.614-0.418c1.393-0.074,2.792-0.104,4.186-0.037C4.269-0.42,4.966-0.369,5.659-0.271\r\n\t\tC6.007-0.238,6.346-0.153,6.69-0.091c0.346,0.062,0.674,0.185,1.014,0.275l2.502,0.666L8.809-0.73L7.985-1.659\r\n\t\tC7.659-1.987,7.336-2.324,7.001-2.635C6.652-2.926,6.335-3.241,5.958-3.506C5.596-3.783,5.227-4.051,4.825-4.285\r\n\t\tC4.442-4.541,4.01-4.733,3.598-4.946C3.16-5.12,2.731-5.312,2.27-5.428C1.82-5.573,1.348-5.651,0.88-5.721\r\n\t\tC0.409-5.781-0.064-5.799-0.538-5.788c-0.944,0.035-1.869,0.22-2.735,0.517c-0.867,0.297-1.68,0.7-2.434,1.17\r\n\t\tC-6.46-3.629-7.16-3.093-7.807-2.508C-8.13-2.214-8.443-1.911-8.743-1.595c-0.302,0.323-0.578,0.632-0.871,1.011L-11.058,1.288z\"/>\r\n                <path fill=\"#017BBC\" d=\"M17.528,23.216c-0.641,1.515-1.152,2.931-1.408,4.06c-0.08,0.353-0.1,0.665-0.091,0.956\r\n\t\tc-0.384,3.257,3.853,3.525,4.338-0.064c0.063-0.467,0.228-1.085,0.456-1.79c0.329-0.874,0.793-1.941,1.345-3.11\r\n\t\tc0.89,0.261,1.499,1.138,1.367,2.113c-0.598,4.442-0.503,10.889-0.255,16.254c-6.822,3.823-14.673,6.021-23.04,6.063l-1.02-24.325\r\n\t\tL17.528,23.216z\"/>\r\n                <path fill=\"#017BBC\" d=\"M-25.093,25.38c-0.131-0.976,0.478-1.853,1.367-2.113c0.553,1.171,1.018,2.24,1.347,3.116\r\n\t\tc0.227,0.702,0.391,1.318,0.454,1.784c0.485,3.589,4.722,3.321,4.338,0.065c0.009-0.291-0.011-0.604-0.091-0.957\r\n\t\tc-0.256-1.129-0.768-2.545-1.408-4.06l18.308,0.156l1.02,24.325c-0.081,0-0.16,0.006-0.241,0.006\r\n\t\tc-9.083,0-17.573-2.54-24.798-6.946C-24.582,35.578-24.528,29.582-25.093,25.38z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M4.527-22.171c-0.072-0.028-0.134-0.058-0.199-0.087c0.277-0.024,0.557-0.037,0.841-0.022\r\n\t\tc0.573,0.03,1.117,0.144,1.622,0.324C6.088-21.85,5.271-21.876,4.527-22.171z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M8.158-12.455c-1.162,0.981-2.684,1.549-4.285,1.465c-2.126-0.111-3.849-1.342-4.652-3.077\r\n\t\tc0.397-0.858,0.574-1.837,0.455-2.869c-0.067-0.587-0.224-1.149-0.455-1.673c0.665-1.508,1.947-2.696,3.494-3.281\r\n\t\tc0.203,0.123,0.408,0.245,0.638,0.329c0.288,0.11,0.627,0.215,0.928,0.273c1.181,0.269,2.384,0.028,3.184-0.373\r\n\t\tc1.902,0.988,3.073,3.032,2.81,5.326c-0.047,0.407-0.138,0.8-0.265,1.178C9.108-14.497,8.452-13.535,8.158-12.455z M3.476-19.858\r\n\t\tc-1.557,0-2.819,1.262-2.819,2.819s1.262,2.819,2.819,2.819c1.557,0,2.819-1.262,2.819-2.819S5.033-19.858,3.476-19.858z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-7.996-22.067c0.403-0.115,0.827-0.191,1.27-0.214c0.204-0.011,0.406-0.01,0.607,0\r\n\t\tc-0.012,0.004-0.021,0.009-0.032,0.013C-6.757-22.046-7.4-22.011-7.996-22.067z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-0.779-14.066c-0.803,1.735-2.525,2.966-4.652,3.077c-3.178,0.166-6.044-2.227-6.401-5.345\r\n\t\tc-0.27-2.351,0.964-4.44,2.948-5.399c0.785,0.359,1.87,0.572,2.956,0.355c0.302-0.049,0.643-0.145,0.934-0.248\r\n\t\tc0.225-0.076,0.426-0.189,0.627-0.301c1.59,0.572,2.911,1.78,3.589,3.319c0.231,0.524,0.388,1.085,0.455,1.673\r\n\t\tC-0.205-15.903-0.381-14.924-0.779-14.066z M-5.193-19.858c-1.558,0-2.819,1.262-2.819,2.819s1.262,2.819,2.819,2.819\r\n\t\tc1.557,0,2.819-1.262,2.819-2.819S-3.636-19.858-5.193-19.858z\"/>\r\n                <path fill=\"#1A2451\" d=\"M3.476-14.22c-1.557,0-2.819-1.262-2.819-2.819s1.262-2.819,2.819-2.819c1.557,0,2.819,1.262,2.819,2.819\r\n\t\tS5.033-14.22,3.476-14.22z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-5.193-14.22c-1.558,0-2.819-1.262-2.819-2.819s1.262-2.819,2.819-2.819c1.557,0,2.819,1.262,2.819,2.819\r\n\t\tS-3.636-14.22-5.193-14.22z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-4.87-1.224c-0.628,0.019-1.257,0.053-1.888,0.095c0.024-0.019,0.046-0.041,0.07-0.06\r\n\t\tc0.611-0.484,1.261-0.916,1.935-1.277c0.673-0.361,1.374-0.65,2.085-0.841c0.712-0.192,1.433-0.284,2.143-0.265\r\n\t\tc0.355,0.018,0.706,0.053,1.052,0.121c0.343,0.079,0.687,0.154,1.017,0.288c0.336,0.106,0.653,0.28,0.976,0.428\r\n\t\tc0.307,0.193,0.627,0.352,0.918,0.58c0.302,0.201,0.585,0.44,0.865,0.684c0.289,0.228,0.539,0.52,0.811,0.773L5.25-0.545\r\n\t\tc-0.545-0.114-1.091-0.221-1.642-0.3C2.207-1.044,0.794-1.146-0.62-1.202C-2.034-1.257-3.451-1.266-4.87-1.224z\"/>\r\n                <path fill=\"#EA7D00\" d=\"M-9.614-0.584c0.293-0.379,0.569-0.688,0.871-1.011c0.3-0.316,0.612-0.619,0.936-0.913\r\n\t\tC-7.16-3.093-6.46-3.629-5.707-4.102c0.754-0.47,1.566-0.873,2.434-1.17c0.867-0.297,1.792-0.481,2.735-0.517\r\n\t\tc0.473-0.011,0.946,0.007,1.418,0.067C1.348-5.651,1.82-5.573,2.27-5.428C2.731-5.312,3.16-5.12,3.598-4.946\r\n\t\tC4.01-4.733,4.442-4.541,4.825-4.285c0.402,0.234,0.771,0.502,1.134,0.779c0.377,0.265,0.694,0.58,1.043,0.871\r\n\t\tc0.335,0.311,0.657,0.647,0.984,0.976L8.809-0.73l1.398,1.581L7.705,0.185C7.365,0.094,7.037-0.029,6.69-0.091\r\n\t\tC6.346-0.153,6.007-0.238,5.659-0.271C4.966-0.369,4.269-0.42,3.571-0.455C2.178-0.521,0.778-0.492-0.614-0.418\r\n\t\tC-2.008-0.343-3.4-0.221-4.781-0.052C-5.47,0.035-6.158,0.132-6.838,0.247c-0.677,0.116-1.358,0.247-1.979,0.419l-2.24,0.622\r\n\t\tL-9.614-0.584z M5.25-0.545L5.115-0.697C4.842-0.951,4.592-1.243,4.304-1.471c-0.28-0.243-0.563-0.482-0.865-0.684\r\n\t\tc-0.291-0.229-0.611-0.387-0.918-0.58C2.198-2.882,1.88-3.056,1.544-3.162C1.214-3.296,0.871-3.371,0.527-3.45\r\n\t\tC0.182-3.519-0.169-3.554-0.524-3.571c-0.71-0.02-1.431,0.072-2.143,0.265c-0.711,0.19-1.412,0.479-2.085,0.841\r\n\t\tc-0.674,0.361-1.323,0.793-1.935,1.277c-0.024,0.019-0.046,0.041-0.07,0.06c0.631-0.042,1.26-0.076,1.888-0.095\r\n\t\tc1.419-0.042,2.836-0.033,4.25,0.021c1.414,0.057,2.826,0.158,4.228,0.357C4.16-0.766,4.706-0.659,5.25-0.545z\"/>\r\n                <path fill=\"#004373\" d=\"M20.407,27.635c0.086-0.342,0.234-0.775,0.417-1.258c-0.228,0.705-0.393,1.323-0.456,1.79\r\n\t\tc-0.485,3.59-4.723,3.321-4.338,0.064C16.108,30.896,19.575,30.916,20.407,27.635z\"/>\r\n                <path fill=\"#017BBC\" d=\"M23.673,11.701c0.643-0.817,2.798-1.02,4.025-0.424l0.779,0.898c-1.398,1.673-4.36,6.958-6.309,11.091\r\n\t\tc-0.551,1.169-1.016,2.236-1.345,3.11c-0.182,0.482-0.33,0.916-0.417,1.258c-0.832,3.281-4.299,3.261-4.378,0.597\r\n\t\tc-0.008-0.291,0.011-0.604,0.091-0.956c0.256-1.129,0.767-2.545,1.408-4.06c1.849-4.373,4.788-9.573,5.919-11.202\r\n\t\tC23.531,11.894,23.611,11.78,23.673,11.701z M18.021,29.415c0.881,0,1.596-0.715,1.596-1.596s-0.715-1.596-1.596-1.596\r\n\t\tc-0.882,0-1.596,0.715-1.596,1.596S17.139,29.415,18.021,29.415z\"/>\r\n                <path fill=\"#FDD302\" d=\"M18.021,26.224c0.881,0,1.596,0.715,1.596,1.596s-0.715,1.596-1.596,1.596\r\n\t\tc-0.882,0-1.596-0.715-1.596-1.596S17.139,26.224,18.021,26.224z\"/>\r\n                <path fill=\"#004373\" d=\"M-17.587,28.232c0.384,3.256-3.853,3.523-4.338-0.065c-0.063-0.466-0.228-1.082-0.454-1.784\r\n\t\tc0.181,0.479,0.328,0.912,0.414,1.252C-21.132,30.915-17.667,30.896-17.587,28.232z\"/>\r\n                <path fill=\"#017BBC\" d=\"M-25.231,11.701c0.063,0.079,0.143,0.192,0.226,0.313c1.132,1.629,4.07,6.829,5.919,11.202\r\n\t\tc0.641,1.515,1.152,2.931,1.408,4.06c0.08,0.354,0.1,0.666,0.091,0.957c-0.079,2.663-3.545,2.683-4.378-0.598\r\n\t\tc-0.086-0.34-0.233-0.772-0.414-1.252c-0.329-0.876-0.794-1.945-1.347-3.116c-1.967-4.172-4.97-9.526-6.351-11.146\r\n\t\tc0.008-0.024,0.022-0.045,0.032-0.068C-29.481,10.618-26.07,10.635-25.231,11.701z M-19.579,29.415\r\n\t\tc0.883,0,1.597-0.715,1.597-1.596s-0.714-1.596-1.597-1.596c-0.881,0-1.596,0.715-1.596,1.596S-20.459,29.415-19.579,29.415z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-19.579,26.224c0.883,0,1.597,0.715,1.597,1.596s-0.714,1.596-1.597,1.596\r\n\t\tc-0.881,0-1.596-0.715-1.596-1.596S-20.459,26.224-19.579,26.224z\"/>\r\n                <path fill=\"#017BBC\" d=\"M12.73-39.049v8.708c0,0.135-0.033,0.261-0.085,0.376c-0.144,0.316-0.459,0.539-0.83,0.539h-1.199h-22.79\r\n\t\th-1.007c-0.506,0-0.915-0.41-0.915-0.915v-8.708c0-0.754,0.085-1.487,0.236-2.195c0.428-1.99,1.42-3.769,2.807-5.157\r\n\t\tC-7.503-47.244-3.806-47.703,0-47.703c3.166,0,6.258,0.316,9.251,0.904C11.382-44.893,12.73-42.132,12.73-39.049z\"/>\r\n                <path fill=\"#1A2451\" d=\"M-11.106-8.392l-7.617,7.547l-4.531,4.489l10.429-12.036c2.239-3.048,0.254-6.975-2.946-7.594\r\n\t\tc0.18-0.032,0.356-0.047,0.531-0.058C-11.385-16.295-8.6-11.801-11.106-8.392z\"/>\r\n                <path fill=\"#FDD302\" d=\"M-15.772-15.986c3.2,0.62,5.186,4.546,2.946,7.594L-23.254,3.645l-7.286,8.408l-4.675,5.396l-10.021-2.315\r\n\t\tc-1.143-3.419-1.913-7.006-2.254-10.721l29.322-20.24C-17.329-16.096-16.517-16.13-15.772-15.986z\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M33.045,17.448l12.376-2.859c-2.479,7.726-6.876,14.587-12.629,20.037l-4.231-22.354L33.045,17.448z\"/>\r\n                <path fill=\"#1A2451\" d=\"M8.936-8.392c-0.958-1.304-1.13-2.765-0.777-4.063c0.293-1.08,0.95-2.042,1.852-2.702\r\n\t\tc0.978-0.716,2.23-1.07,3.591-0.829c-3.2,0.62-5.185,4.547-2.946,7.594l10.43,12.037l-3.74-3.705L8.936-8.392z\"/>\r\n                <path fill=\"#FDD302\" d=\"M28.561,12.272l-0.084-0.097l-0.779-0.898l-6.612-7.632L10.656-8.392c-2.239-3.047-0.254-6.974,2.946-7.594\r\n\t\tc0.03-0.005,0.062-0.007,0.092-0.012c0.721-0.125,1.5-0.087,2.305,0.17l0.586,0.404L47.338,5.805\r\n\t\tc-0.367,3.023-1.011,5.962-1.917,8.784l-12.376,2.859L28.561,12.272z\"/>\r\n                <path fill=\"#21264F\" d=\"M4.281-21.288c-0.301-0.058-0.64-0.163-0.928-0.273c-0.23-0.084-0.436-0.206-0.638-0.329\r\n\t\tc-0.063-0.038-0.138-0.06-0.197-0.101c-0.498-0.355-0.86-0.802-1.099-1.214c-0.24-0.413-0.379-0.782-0.432-1.056\r\n\t\tc-0.066-0.267-0.075-0.428-0.075-0.428l0.102-0.053c0,0,0.126,0.1,0.319,0.274c0.191,0.164,0.464,0.397,0.79,0.676\r\n\t\tc0.32,0.266,0.689,0.549,1.088,0.829c0.195,0.146,0.398,0.297,0.615,0.437c0.165,0.108,0.328,0.19,0.501,0.267\r\n\t\tc0.065,0.029,0.127,0.06,0.199,0.087c0.745,0.295,1.561,0.322,2.263,0.214c0.246-0.038,0.479-0.09,0.688-0.155\r\n\t\tc0.406-0.121,0.731-0.284,0.953-0.398c0.225-0.116,0.352-0.196,0.352-0.196l0.068,0.092c0,0-0.103,0.103-0.304,0.271\r\n\t\tc-0.202,0.172-0.506,0.394-0.912,0.608c-0.049,0.028-0.117,0.048-0.17,0.075C6.665-21.26,5.462-21.019,4.281-21.288z\"/>\r\n                <path fill=\"#21264F\" d=\"M-5.928-21.378c-1.086,0.217-2.171,0.004-2.956-0.355c-0.132-0.06-0.274-0.115-0.386-0.183\r\n\t\tc-0.399-0.224-0.697-0.454-0.895-0.631c-0.197-0.174-0.297-0.279-0.297-0.279l0.069-0.091c0,0,0.125,0.084,0.347,0.206\r\n\t\tc0.22,0.119,0.54,0.291,0.942,0.423c0.323,0.11,0.707,0.183,1.107,0.221c0.596,0.056,1.238,0.021,1.845-0.201\r\n\t\tc0.012-0.004,0.021-0.009,0.032-0.013c0.249-0.091,0.456-0.186,0.677-0.322c0.223-0.134,0.428-0.279,0.627-0.421\r\n\t\tc0.407-0.269,0.783-0.542,1.109-0.799c0.335-0.27,0.613-0.496,0.808-0.654c0.198-0.169,0.327-0.266,0.327-0.266l0.1,0.056\r\n\t\tc0,0-0.012,0.16-0.086,0.425c-0.06,0.273-0.209,0.638-0.46,1.045c-0.25,0.405-0.624,0.842-1.131,1.184\r\n\t\tc-0.066,0.044-0.149,0.066-0.22,0.106c-0.201,0.112-0.402,0.226-0.627,0.301C-5.286-21.523-5.626-21.427-5.928-21.378z\"/>\r\n            </symbol>\r\n            <symbol id=\"badguy\" viewBox=\"-48.82 -38.762 97.639 77.522\">\r\n                <g>\r\n                    <path fill=\"#ADC80C\" d=\"M16.766-8.884c0,0-0.053-2.728,0.086-6.812c0.063-2.043,0.163-4.425,0.309-6.972\r\n\t\t\tc0.151-2.542,0.33-5.271,0.666-7.927c0.102-0.646,0.167-1.335,0.364-1.86c0.074-0.204,0.225-0.416,0.25-0.391\r\n\t\t\tc0.016,0.014-0.038,0.052-0.077,0.074c-0.032,0.023-0.034,0.02,0.021,0.049c0.242,0.109,0.743,0.52,1.144,0.935\r\n\t\t\tc0.423,0.428,0.839,0.898,1.257,1.374c0.417,0.477,0.836,0.96,1.279,1.437l0.202,0.2c0.051,0.052,0.175,0.152,0.26,0.224\r\n\t\t\tc0.19,0.15,0.343,0.265,0.526,0.378c0.354,0.225,0.725,0.414,1.119,0.553c0.783,0.283,1.66,0.393,2.533,0.25\r\n\t\t\tc0.873-0.144,1.695-0.554,2.302-1.076c1.229-1.068,1.716-2.291,2.048-3.262c0.32-0.993,0.449-1.831,0.537-2.514\r\n\t\t\tc0.086-0.683,0.113-1.207,0.128-1.563c0.013-0.356,0.02-0.546,0.02-0.546c0.048-1.292-0.959-2.378-2.251-2.428\r\n\t\t\tc-1.292-0.048-2.378,0.96-2.427,2.251c-0.004,0.103-0.001,0.203,0.008,0.302l0.006,0.062c0,0,0.016,0.15,0.042,0.433\r\n\t\t\tc0.028,0.282,0.063,0.696,0.067,1.203c0.007,0.506-0.009,1.117-0.116,1.73c-0.099,0.612-0.315,1.223-0.596,1.563\r\n\t\t\tc-0.257,0.33-0.62,0.547-1.327,0.432c-0.167-0.027-0.34-0.086-0.508-0.157c-0.081-0.03-0.178-0.087-0.235-0.115\r\n\t\t\tc-0.034-0.021-0.037-0.007-0.101-0.056c-0.043-0.03-0.162-0.128-0.144-0.104c-0.455-0.362-0.926-0.767-1.42-1.185\r\n\t\t\tc-0.495-0.419-1.01-0.854-1.583-1.284c-0.603-0.416-1.157-0.888-2.21-1.167c-0.268-0.061-0.611-0.088-0.976-0.011\r\n\t\t\tc-0.376,0.074-0.728,0.301-0.957,0.542c-0.453,0.509-0.561,0.95-0.666,1.395c-0.142,0.79-0.183,1.469-0.228,2.174\r\n\t\t\tc-0.13,2.776-0.092,5.5-0.043,8.066c0.056,2.563,0.145,4.95,0.24,6.996C16.5-11.6,16.766-8.884,16.766-8.884\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-17.479-8.884c0,0,0.268-2.716,0.45-6.808c0.096-2.046,0.185-4.434,0.24-6.996\r\n\t\t\tc0.049-2.566,0.087-5.29-0.043-8.066c-0.044-0.705-0.085-1.384-0.228-2.174c-0.105-0.444-0.213-0.886-0.666-1.395\r\n\t\t\tc-0.229-0.241-0.581-0.468-0.957-0.542c-0.363-0.077-0.708-0.05-0.976,0.011c-1.054,0.279-1.607,0.751-2.21,1.167\r\n\t\t\tc-0.573,0.43-1.088,0.865-1.583,1.284c-0.494,0.418-0.965,0.822-1.42,1.185c0.019-0.023-0.101,0.074-0.144,0.104\r\n\t\t\tc-0.063,0.049-0.066,0.034-0.101,0.056c-0.058,0.028-0.154,0.085-0.235,0.115c-0.168,0.071-0.341,0.13-0.508,0.157\r\n\t\t\tc-0.707,0.115-1.07-0.102-1.327-0.432c-0.28-0.34-0.497-0.95-0.596-1.563c-0.107-0.613-0.123-1.225-0.116-1.73\r\n\t\t\tc0.005-0.507,0.039-0.921,0.067-1.203c0.026-0.282,0.042-0.433,0.042-0.433l0.005-0.048c0.125-1.287-0.817-2.431-2.104-2.556\r\n\t\t\tc-1.286-0.125-2.431,0.815-2.556,2.103c-0.01,0.101-0.012,0.215-0.009,0.314c0,0,0.007,0.189,0.02,0.546\r\n\t\t\tc0.016,0.355,0.042,0.88,0.128,1.563c0.088,0.683,0.216,1.521,0.537,2.514c0.332,0.971,0.819,2.193,2.048,3.262\r\n\t\t\tc0.606,0.522,1.429,0.933,2.301,1.076c0.873,0.143,1.752,0.033,2.534-0.25c0.395-0.139,0.766-0.328,1.119-0.553\r\n\t\t\tc0.184-0.113,0.336-0.228,0.526-0.378c0.086-0.071,0.209-0.172,0.26-0.224l0.202-0.2c0.442-0.477,0.862-0.96,1.28-1.437\r\n\t\t\tc0.417-0.476,0.833-0.946,1.256-1.374c0.4-0.415,0.901-0.825,1.144-0.935c0.056-0.029,0.054-0.025,0.021-0.049\r\n\t\t\tc-0.039-0.022-0.092-0.061-0.077-0.074c0.026-0.025,0.176,0.187,0.25,0.391c0.197,0.525,0.263,1.214,0.364,1.86\r\n\t\t\tc0.336,2.655,0.515,5.385,0.666,7.927c0.146,2.547,0.244,4.929,0.309,6.972C-17.426-11.612-17.479-8.884-17.479-8.884\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-28.077-1.831c0,15.344,12.438,27.783,27.782,27.783c15.346,0,27.784-12.439,27.784-27.783\r\n\t\t\tS15.051-29.614-0.294-29.614C-15.638-29.614-28.077-17.174-28.077-1.831\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-42.137,0.644c0.681,4.308,4.928,12.93,9.24,12.93c3.626,0,4.308-2.493,6.573-6.348l0.907-6.8\r\n\t\t\tl-2.66-2.257c0,0-2.1,5.204-3.007,7.017c-0.907,1.814-2.268,3.627-3.4,1.588c-1.133-2.04-4.132-6.946-4.132-6.946\r\n\t\t\ts-1.254-2.192,0.562-2.64c1.817-0.446,4.846-1.191,4.447-2.806c-0.396-1.615-1.707-1.721-3.424-0.87\r\n\t\t\tc-1.718,0.851-2.826,0.695-3.276-0.265c-0.449-0.959,0.014-3.428,1.075-4.331c1.063-0.903-2.161-1.823-3.475-1.072\r\n\t\t\tc-1.313,0.752-1.273,3.524,0.335,4.841c-1.913-0.813-2.916-2.278-2.707-4.043c0.208-1.764-3.18,0.996-2.882,2.207\r\n\t\t\ts2.254,3.941,3.563,4.047c-2.036,0.575-2.088,0.063-2.95-1.003c-0.862-1.063-2.354,0.506-0.786,2.298\r\n\t\t\tc1.566,1.792,4.606,2.547,5.262,2.461C-42.217-1.434-42.416-0.489-42.137,0.644\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M42.136,0.644c-0.681,4.308-4.928,12.93-9.24,12.93c-3.626,0-4.307-2.493-6.573-6.348l-0.907-6.8\r\n\t\t\tl1.746-2.136c0,0,3.015,5.083,3.921,6.896c0.907,1.814,2.267,3.627,3.4,1.588c1.133-2.04,4.132-6.946,4.132-6.946\r\n\t\t\ts1.254-2.192-0.563-2.64c-1.816-0.446-4.845-1.191-4.446-2.806c0.397-1.615,1.707-1.721,3.424-0.87\r\n\t\t\tc1.718,0.851,2.826,0.695,3.276-0.265c0.45-0.959-0.014-3.428-1.075-4.331s2.161-1.823,3.475-1.072\r\n\t\t\tc1.313,0.752,1.273,3.524-0.335,4.841c1.913-0.813,2.915-2.278,2.707-4.043c-0.208-1.764,3.181,0.996,2.883,2.207\r\n\t\t\tc-0.299,1.211-2.255,3.941-3.564,4.047c2.036,0.575,2.088,0.063,2.95-1.003c0.862-1.063,2.354,0.506,0.787,2.298\r\n\t\t\ts-4.607,2.547-5.263,2.461C42.216-1.434,42.415-0.489,42.136,0.644\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M-0.691-16.015c0,5.385,4.274,9.748,9.549,9.748s9.549-4.363,9.549-9.748c0-5.384-4.274-9.748-9.549-9.748\r\n\t\t\tS-0.691-21.399-0.691-16.015\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M-18.994-16.015c0,5.385,4.274,9.748,9.549,9.748s9.549-4.363,9.549-9.748\r\n\t\t\tc0-5.384-4.274-9.748-9.549-9.748S-18.994-21.399-18.994-16.015\"/>\r\n                    <path fill=\"#1C1C1B\" d=\"M-0.525-14.701c0,3.14,2.493,5.685,5.567,5.685c3.075,0,5.567-2.545,5.567-5.685\r\n\t\t\tc0-3.139-2.492-5.684-5.567-5.684C1.968-20.384-0.525-17.839-0.525-14.701\"/>\r\n                    <path fill=\"#1C1C1B\" d=\"M-11.197-14.701c0,3.14,2.493,5.685,5.568,5.685s5.566-2.545,5.566-5.685c0-3.139-2.491-5.684-5.566-5.684\r\n\t\t\tS-11.197-17.839-11.197-14.701\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M2.589,2.083c-2.815,6.306,6.297,13.155,10.397,1.889\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M0.832,3.127C4.069,10.71-5.754,16.922-10.52,3.526\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M13.236,20.542c2.915,3.157,4.373,3.644,4.13,5.587s-5.588,5.102-6.073,7.773s2.43,1.214,4.372,1.457\r\n\t\t\tc0.983,0.123,1.779,0.991,2.326,1.819c0.448,0.678-0.058,1.582-0.87,1.582H6.434c-0.319-2.483-0.22-4.089,1.387-6.499\r\n\t\t\tc1.507-2.259,3.112-3.212,3.229-5.161c0.11-1.864-5.639-2.869-5.639-2.869\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M-13.454,20.542c-2.915,3.157-4.373,3.644-4.13,5.587c0.242,1.943,5.588,5.102,6.072,7.773\r\n\t\t\tc0.486,2.672-2.429,1.214-4.372,1.457c-0.982,0.123-1.778,0.991-2.325,1.819c-0.448,0.678,0.058,1.582,0.87,1.582h10.687\r\n\t\t\tc0.319-2.483,0.219-4.089-1.387-6.499c-1.507-2.259-3.112-3.212-3.229-5.161c-0.111-1.864,5.639-2.869,5.639-2.869\"/>\r\n                    <path fill=\"#ADC80C\" d=\"M27.36-1.115C13.49,5.721-2.262,8.198-27.922-1.511\"/>\r\n                    <path fill=\"#E3007D\" d=\"M27.36-1.115c0,0-0.859,0.268-2.343,0.777c-0.74,0.266-1.657,0.504-2.678,0.847\r\n\t\t\tc-1.027,0.319-2.214,0.61-3.479,0.974c-1.292,0.287-2.67,0.645-4.153,0.902c-1.468,0.316-3.047,0.472-4.659,0.708\r\n\t\t\tC9.236,3.167,8.41,3.24,7.574,3.315C6.738,3.373,5.885,3.374,5.033,3.429C4.18,3.494,3.316,3.466,2.45,3.458\r\n\t\t\tc-0.866-0.012-1.736,0.001-2.605-0.08c-0.87-0.044-1.741-0.088-2.606-0.133c-0.866-0.09-1.729-0.18-2.583-0.269\r\n\t\t\tc-1.709-0.185-3.391-0.442-5.02-0.674c-1.612-0.335-3.2-0.535-4.681-0.865c-1.477-0.345-2.9-0.578-4.191-0.895\r\n\t\t\tc-1.29-0.321-2.483-0.586-3.546-0.821c-1.055-0.263-1.975-0.492-2.732-0.681c-1.523-0.367-2.407-0.553-2.407-0.553\r\n\t\t\ts0.795,0.415,2.212,1.1c0.711,0.333,1.566,0.766,2.575,1.192c1.012,0.417,2.157,0.888,3.42,1.367\r\n\t\t\tc1.257,0.5,2.659,0.926,4.136,1.402c1.478,0.479,3.074,0.859,4.72,1.273c0.829,0.186,1.682,0.338,2.539,0.513\r\n\t\t\tc0.859,0.175,1.729,0.35,2.622,0.435c0.891,0.11,1.786,0.221,2.687,0.332c0.906,0.063,1.815,0.125,2.727,0.188\r\n\t\t\tC0.625,6.357,1.54,6.329,2.45,6.323c0.91-0.01,1.817,0,2.715-0.083c0.899-0.063,1.791-0.112,2.666-0.229\r\n\t\t\tc0.873-0.129,1.735-0.257,2.583-0.382c1.684-0.317,3.305-0.665,4.8-1.136c1.518-0.394,2.892-0.953,4.165-1.426\r\n\t\t\tc1.256-0.526,2.394-1.024,3.376-1.528c0.981-0.509,1.836-0.947,2.506-1.354C26.603-0.625,27.36-1.115,27.36-1.115\"/>\r\n                </g>\r\n            </symbol>\r\n            <symbol  id=\"earth\" viewBox=\"0 0 69 57\">\r\n                            <path fill=\"#EB6608\" d=\"M34.5,57.823c23.851-8.51,36.89-25.975,34.136-39.361C66.753,9.306,61.32,0,50.189,0\r\n\t\tC43.49,0,36.347,8.177,34.5,16.72C32.652,8.177,25.509,0,18.811,0C7.678,0,2.247,9.306,0.363,18.462\r\n\t\tC-2.391,31.848,10.647,49.313,34.5,57.823\"/>\r\n            </symbol>\r\n            <symbol id=\"goodie\" viewBox=\"-26.111 -34.501 52.223 69.001\">\r\n                <path fill=\"#FF00FF\" d=\"M12.428-33.346c11.046,5.522-5.492,23.319-11.984,23.088c-3.185-0.113-3.442-1.558-3.442-1.558\r\n\t\tS-1.943-40.534,12.428-33.346 M11.605-27.895c-0.428-2.379-2.999-2.459-3.903-2.298c-3.19,0.565-4.584,7.087-5.327,13.875\r\n\t\tC5.863-17.803,12.317-23.936,11.605-27.895\"/>\r\n                <path fill=\"#FF00FF\" d=\"M1.625-16.261c0,0,0.525,1.371-2.147,3.109c-5.445,3.544-28.789-3.185-22.169-13.61\r\n\t\tC-14.079-40.328,1.625-16.261,1.625-16.261 M-5.04-17.239c-4.134-5.435-8.951-10.416-11.976-9.256\r\n\t\tc-0.858,0.328-3.02,1.721-2.161,3.98C-17.747-18.754-8.794-16.714-5.04-17.239\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-24.419-4.732v37.363c0,1.032,0.836,1.869,1.868,1.869h45.103c1.032,0,1.868-0.837,1.868-1.869V-4.732\r\n\t\tH-24.419z\"/>\r\n                <polygon fill=\"#FFFFFF\" points=\"-26.111,-4.732 26.112,-4.732 26.112,-14.074 -26.111,-14.074 \t\"/>\r\n                <g opacity=\"0.5\">\r\n                    <g>\r\n                        <defs>\r\n                            <polygon id=\"SVGID_1b_\"\r\n                                     points=\"9.47,-13.331 -17.682,-13.331 -17.682,-22.38 9.47,-22.38 \t\t\t\t\"/>\r\n                        </defs>\r\n                        <clipPath id=\"SVGID_2a_\">\r\n                            <use xlink:href=\"#SVGID_1b_\" overflow=\"visible\"/>\r\n                        </clipPath>\r\n                        <path clip-path=\"url(#SVGID_2a_)\" fill=\"#B3B3B3\" d=\"M1.654-15.734h-7.347v0.282h-11.988l3.017,1.379h8.971v0.738H5.694v-0.738\r\n\t\t\t\tH7.95l1.52-1.379H5.694v-0.282H3.1c0.114-0.445,0.013-0.71,0.013-0.71s-0.039-0.059-0.115-0.172l-0.623,0.299l0.118-1.026\r\n\t\t\t\tc-0.738-1.041-2.112-2.891-3.985-5.037c-0.541,2.287-0.339,1.492-0.339,1.492c0.338,0.414,2.039,2.592,2.554,3.325\r\n\t\t\t\ts0.695,0.994,0.834,1.201C1.697-16.156,1.655-15.937,1.654-15.734\"/>\r\n                    </g>\r\n                </g>\r\n                <polygon fill=\"#FF00FF\"\r\n                         points=\"-5.693,34.5 5.694,34.5 5.694,-4.96 5.694,-14.355 -5.693,-14.355 -5.693,-4.96 -5.693,-3.574 \t\"/>\r\n                <g opacity=\"0.5\">\r\n                    <g>\r\n                        <defs>\r\n                            <polygon id=\"SVGID_3_\"\r\n                                     points=\"24.42,-3.351 -24.419,-3.351 -24.419,-4.73 24.42,-4.73 \t\t\t\t\"/>\r\n                        </defs>\r\n                        <clipPath id=\"SVGID_4_\">\r\n                            <use xlink:href=\"#SVGID_3_\" overflow=\"visible\"/>\r\n                        </clipPath>\r\n                        <polygon clip-path=\"url(#SVGID_4_)\" fill=\"#B3B3B3\"\r\n                                 points=\"24.42,-3.354 -24.419,-3.354 -24.419,-4.732 24.42,-4.732 \t\t\t\"/>\r\n                    </g>\r\n                </g>\r\n            </symbol>\r\n        </svg>\r\n\r\n        <rect class='interfaceBG' fill=\"#170C59\" width=\"500\" x='-100' height=\"37\"/>\r\n        <svg class='interface' width=\"340\" height=\"37\">\r\n            <symbol id=\"live_x5F_icon\" viewBox=\"-5.541 -7.476 11.082 14.952\">\r\n                <path fill=\"#253B8C\" d=\"M-0.88,6.153l-0.725-0.409c-0.19-0.113-0.229-0.368,0.177-0.551c0.406-0.184,0.916-0.135,0.916-0.135\r\n\t\tl0.144,1.118L-0.88,6.153z\"/>\r\n                <path fill=\"#004373\" d=\"M2.941,0.191c0-0.258-1.521-0.466-2.943-0.466s-2.944,0.208-2.944,0.466s1.522,0.466,2.944,0.466\r\n\t\tS2.941,0.449,2.941,0.191\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M-0.856,5.454h-0.162c-0.085,0-0.154,0.069-0.154,0.154c0,0.085,0.069,0.154,0.154,0.154h0.162\"/>\r\n                <path fill=\"#D6B406\" d=\"M-1.035,5.563c0,0.055,0.062,0.1,0.139,0.1c0.053,0,0.098-0.021,0.121-0.051\r\n\t\tC-0.778,5.674-0.85,5.724-0.937,5.724c-0.089,0-0.163-0.052-0.163-0.116c0-0.046,0.038-0.085,0.092-0.104\r\n\t\tC-1.025,5.521-1.035,5.541-1.035,5.563\"/>\r\n                <path fill=\"#FDD302\"\r\n                      d=\"M0.854,5.454h0.162c0.085,0,0.154,0.069,0.154,0.154c0,0.085-0.069,0.154-0.154,0.154H0.854\"/>\r\n                <path fill=\"#D6B406\" d=\"M1.033,5.563c0,0.055-0.062,0.1-0.139,0.1c-0.053,0-0.098-0.021-0.122-0.051\r\n\t\tc0.003,0.062,0.074,0.112,0.162,0.112c0.09,0,0.163-0.052,0.163-0.116c0-0.046-0.039-0.085-0.093-0.104\r\n\t\tC1.023,5.521,1.033,5.541,1.033,5.563\"/>\r\n                <path fill=\"#FFED00\" d=\"M0.636,6.762L1.397,3.44C1.441,3.303,1.57,3.209,1.714,3.209h3.493c0.324,0,0.458-0.413,0.196-0.604\r\n\t\tL2.947,0.553C2.83,0.468,2.781,0.317,2.825,0.18l0.511-7.217c0.1-0.308-0.252-0.563-0.514-0.374L0.196-1.462\r\n\t\tc-0.117,0.084-0.275,0.084-0.392,0l-2.626-5.949c-0.262-0.189-0.614,0.066-0.514,0.374l0.511,7.217\r\n\t\tc0.045,0.137-0.004,0.289-0.121,0.373l-2.456,2.053c-0.262,0.19-0.127,0.604,0.196,0.604h3.492c0.145,0,0.273,0.094,0.318,0.231\r\n\t\tl0.761,3.321C-0.511,7.295,0.522,7.295,0.636,6.762\"/>\r\n                <path fill=\"#00FFFF\" d=\"M0.196-2.257c-0.117,0.084-0.275,0.084-0.392,0l-2.179-4.521c-0.262-0.19-1.071,0.191-0.972,0.499\r\n\t\tl0.402,6.459c0.427-0.2,1.194-0.066,1.23,0.301c0,0,0.112,1.184,0.028,1.805c-0.011,0.081,0.051,0.153,0.133,0.152L0,2.425\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-0.196-2.257c0.117,0.084,0.275,0.084,0.392,0l2.179-4.521c0.262-0.19,1.072,0.191,0.972,0.499L2.945,0.18\r\n\t\tc-0.427-0.2-1.194-0.066-1.231,0.301c0,0-0.111,1.184-0.028,1.805c0.011,0.081-0.051,0.153-0.133,0.152L0,2.425\"/>\r\n                <g>\r\n                    <path fill=\"#292D95\" d=\"M2.916,0.011L2.902,0.048C2.921,0.055,2.938,0.063,2.955,0.07l0.017-0.036\r\n\t\t\tC2.954,0.026,2.935,0.018,2.916,0.011z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#292D95\" d=\"M2.472-0.059c-0.011,0-0.022,0-0.033,0l0.001,0.04c0.039-0.001,0.079,0,0.117,0.001l0.002-0.04\r\n\t\t\tC2.53-0.058,2.501-0.059,2.472-0.059z M-2.472-0.059c-0.031,0-0.061,0.001-0.09,0.002l0.001,0.04\r\n\t\t\tc0.029-0.001,0.059-0.001,0.089-0.001h0.03l0-0.04L-2.472-0.059z M-2.321-0.052l-0.003,0.04c0.04,0.003,0.079,0.008,0.117,0.014\r\n\t\t\tl0.006-0.039C-2.24-0.044-2.28-0.049-2.321-0.052z M2.318-0.052c-0.041,0.003-0.081,0.008-0.12,0.015l0.006,0.04\r\n\t\t\tc0.038-0.006,0.078-0.011,0.117-0.014L2.318-0.052z M2.68-0.045L2.674-0.006C2.714,0,2.754,0.007,2.79,0.015l0.009-0.039\r\n\t\t\tC2.761-0.033,2.721-0.04,2.68-0.045z M-2.683-0.045C-2.724-0.04-2.764-0.032-2.802-0.023l0.009,0.039\r\n\t\t\tC-2.757,0.007-2.718,0-2.677-0.005L-2.683-0.045z M-2.082-0.015l-0.009,0.039c0.039,0.009,0.077,0.019,0.113,0.031l0.013-0.038\r\n\t\t\tC-2.002,0.005-2.042-0.005-2.082-0.015z M2.079-0.015C2.039-0.005,2,0.005,1.962,0.018l0.012,0.038\r\n\t\t\tc0.036-0.012,0.074-0.022,0.113-0.031L2.079-0.015z M-1.852,0.061l-0.016,0.036c0.038,0.018,0.072,0.036,0.102,0.056l0.021-0.033\r\n\t\t\tC-1.776,0.099-1.813,0.079-1.852,0.061z M1.849,0.062C1.81,0.08,1.773,0.1,1.742,0.121l0.022,0.033\r\n\t\t\tc0.029-0.02,0.064-0.039,0.102-0.056L1.849,0.062z M-1.649,0.2l-0.03,0.026c0.027,0.03,0.045,0.062,0.056,0.095l0.038-0.012\r\n\t\t\tC-1.598,0.271-1.619,0.233-1.649,0.2z M1.647,0.202c-0.03,0.034-0.052,0.071-0.063,0.11l0.038,0.012\r\n\t\t\tc0.01-0.033,0.028-0.065,0.055-0.095L1.647,0.202z M-1.569,0.432l-0.04,0.003c0.002,0.031,0.005,0.071,0.009,0.119l0.04-0.002\r\n\t\t\tC-1.563,0.503-1.566,0.462-1.569,0.432z M1.568,0.435C1.565,0.466,1.563,0.506,1.559,0.553l0.04,0.003\r\n\t\t\tc0.004-0.047,0.007-0.087,0.01-0.119L1.568,0.435z M-1.55,0.67l-0.04,0.003C-1.588,0.71-1.585,0.75-1.583,0.792l0.04-0.002\r\n\t\t\tC-1.545,0.748-1.548,0.708-1.55,0.67z M1.551,0.673C1.548,0.71,1.546,0.75,1.543,0.792l0.04,0.002\r\n\t\t\tC1.585,0.752,1.588,0.713,1.59,0.676L1.551,0.673z M-1.536,0.909l-0.04,0.001l0.006,0.12l0.04-0.002L-1.536,0.909z M1.536,0.912\r\n\t\t\tC1.534,0.951,1.532,0.991,1.53,1.031l0.04,0.002c0.002-0.041,0.004-0.081,0.006-0.119L1.536,0.912z M-1.524,1.147l-0.041,0.002\r\n\t\t\tc0.001,0.039,0.003,0.079,0.004,0.119l0.04-0.001C-1.522,1.228-1.523,1.187-1.524,1.147z M1.526,1.15\r\n\t\t\tc-0.002,0.04-0.003,0.08-0.004,0.12l0.04,0.001c0.002-0.04,0.003-0.08,0.004-0.119L1.526,1.15z M-1.518,1.387l-0.04,0\r\n\t\t\tc0,0.04,0.001,0.08,0.001,0.12l0.04,0C-1.517,1.467-1.517,1.427-1.518,1.387z M1.519,1.39c0,0.04-0.001,0.08-0.001,0.12h0.04\r\n\t\t\tc0-0.04,0.001-0.079,0.002-0.119L1.519,1.39z M-1.556,1.626c0,0.04-0.001,0.08-0.001,0.119l0.04,0.001\r\n\t\t\tc0.001-0.04,0.002-0.079,0.002-0.12H-1.556z M1.557,1.629h-0.04c0,0.041,0.001,0.081,0.002,0.12l0.04,0\r\n\t\t\tC1.559,1.709,1.558,1.669,1.557,1.629z M-1.562,1.864c-0.002,0.041-0.004,0.081-0.007,0.119l0.04,0.002\r\n\t\t\tc0.002-0.039,0.004-0.079,0.006-0.119L-1.562,1.864z M1.563,1.867l-0.04,0.002C1.526,1.91,1.527,1.95,1.53,1.988l0.04-0.003\r\n\t\t\tC1.567,1.947,1.565,1.908,1.563,1.867z M-1.579,2.101c-0.003,0.024-0.006,0.046-0.008,0.069C-1.589,2.176-1.589,2.184-1.589,2.19\r\n\t\t\tc0,0.013,0.002,0.024,0.004,0.036l0.039-0.009C-1.548,2.208-1.549,2.199-1.549,2.19c0-0.005,0-0.011,0.001-0.016\r\n\t\t\tc0.003-0.023,0.005-0.046,0.008-0.07L-1.579,2.101z M1.581,2.104l-0.04,0.004C1.544,2.131,1.547,2.153,1.55,2.175\r\n\t\t\tc0,0.005,0,0.01,0,0.016c0,0.01-0.001,0.019-0.004,0.029l0.039,0.01C1.589,2.216,1.59,2.204,1.59,2.19\r\n\t\t\tc0-0.007,0-0.014-0.001-0.021C1.586,2.148,1.584,2.126,1.581,2.104z M-1.483,2.291l-0.016,0.037C-1.48,2.336-1.46,2.34-1.44,2.34\r\n\t\t\th0.066V2.3H-1.44C-1.455,2.3-1.47,2.297-1.483,2.291z M1.482,2.292C1.469,2.298,1.456,2.3,1.441,2.3H1.372V2.34h0.069\r\n\t\t\tc0.02,0,0.039-0.004,0.056-0.011L1.482,2.292z M1.253,2.3h-0.12V2.34h0.12V2.3z M1.014,2.3H0.895V2.34h0.119V2.3z M0.775,2.3\r\n\t\t\th-0.12V2.34h0.12V2.3z M0.536,2.3H0.417V2.34h0.119V2.3z M0.298,2.3h-0.12V2.34h0.12V2.3z M0.059,2.3H-0.06V2.34h0.119V2.3z\r\n\t\t\t M-0.18,2.3h-0.12V2.34h0.12V2.3z M-0.418,2.3h-0.119V2.34h0.119V2.3z M-0.657,2.3h-0.119V2.34h0.119V2.3z M-0.896,2.3h-0.12V2.34\r\n\t\t\th0.12V2.3z M-1.135,2.3h-0.119V2.34h0.119V2.3z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"none\" d=\"M-2.909,0.029c-0.019,0.007-0.038,0.015-0.055,0.022\"/>\r\n                </g>\r\n                <path fill=\"#FFFFFF\" d=\"M0.032,5.221c0.024-0.216-0.134-0.401-0.354-0.413c-0.221-0.011-0.419,0.155-0.444,0.371\r\n\t\tc-0.025,0.216,0.134,0.4,0.354,0.412S0.007,5.437,0.032,5.221\"/>\r\n                <path fill=\"#22274F\" d=\"M-0.687,5.588c0,0,0.018,0.037,0.063,0.082c0.044,0.046,0.125,0.09,0.214,0.096\r\n\t\tc0.044,0.004,0.09,0,0.131-0.012c0.04-0.014,0.073-0.038,0.097-0.06c0.048-0.045,0.063-0.089,0.063-0.089L-0.124,5.6\r\n\t\tc0,0-0.037,0.017-0.092,0.042c-0.026,0.012-0.057,0.023-0.088,0.033c-0.032,0.013-0.066,0.024-0.103,0.027\r\n\t\tc-0.075,0.006-0.149-0.021-0.198-0.054c-0.05-0.033-0.075-0.065-0.075-0.065L-0.687,5.588z\"/>\r\n                <path fill=\"#22274F\" d=\"M0.68,5.583c0,0-0.025,0.033-0.075,0.065c-0.049,0.032-0.124,0.06-0.198,0.054\r\n\t\tC0.371,5.699,0.336,5.688,0.304,5.675c-0.031-0.01-0.063-0.021-0.088-0.033C0.161,5.617,0.124,5.6,0.124,5.6L0.117,5.605\r\n\t\tc0,0,0.015,0.043,0.063,0.089c0.025,0.022,0.057,0.046,0.097,0.06C0.318,5.766,0.364,5.77,0.409,5.766\r\n\t\tc0.088-0.005,0.17-0.05,0.213-0.096c0.045-0.045,0.064-0.082,0.064-0.082L0.68,5.583z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M-0.031,5.221c-0.026-0.216,0.133-0.401,0.354-0.413c0.22-0.011,0.419,0.155,0.444,0.371\r\n\t\tc0.025,0.216-0.133,0.4-0.354,0.412C0.191,5.603-0.007,5.437-0.031,5.221\"/>\r\n                <path fill=\"#22274F\" d=\"M-0.1,5.231c0-0.108-0.087-0.195-0.196-0.195c-0.108,0-0.195,0.087-0.195,0.195\r\n\t\tc0,0.108,0.087,0.195,0.195,0.195C-0.187,5.426-0.1,5.339-0.1,5.231\"/>\r\n                <path fill=\"#22274F\" d=\"M0.501,5.231c0-0.108-0.087-0.195-0.195-0.195S0.11,5.123,0.11,5.231c0,0.108,0.088,0.195,0.196,0.195\r\n\t\tS0.501,5.339,0.501,5.231\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M0.57,4.371c-0.582-0.748-1.159-0.02-1.159-0.02C-0.394,4.305,0.298,4.259,0.57,4.371\"/>\r\n                <path fill=\"#EA7D00\" d=\"M0.755,4.432L0.646,4.308L0.589,4.243L0.52,4.176C0.473,4.134,0.425,4.094,0.37,4.061\r\n\t\tc-0.108-0.068-0.24-0.108-0.371-0.104C-0.133,3.962-0.256,4.009-0.36,4.074c-0.052,0.032-0.101,0.069-0.146,0.11\r\n\t\tc-0.045,0.041-0.086,0.083-0.125,0.133l-0.099,0.127l0.153-0.041c0.087-0.023,0.185-0.038,0.28-0.05\r\n\t\tc0.096-0.011,0.192-0.02,0.289-0.025C0.09,4.324,0.187,4.321,0.283,4.326C0.38,4.332,0.478,4.34,0.57,4.371L0.755,4.432z\r\n\t\t M0.402,4.32C0.363,4.313,0.324,4.305,0.286,4.299C0.189,4.286,0.091,4.279-0.007,4.275c-0.098-0.004-0.196-0.004-0.295-0.001\r\n\t\tc-0.099,0.003-0.196,0.008-0.299,0.025l0.054,0.085c0.07-0.077,0.16-0.148,0.252-0.198C-0.201,4.136-0.1,4.106-0.001,4.109\r\n\t\ts0.194,0.038,0.275,0.099c0.042,0.027,0.08,0.064,0.116,0.101L0.402,4.32z\"/>\r\n                <path fill=\"#004373\" d=\"M-2.938-0.195c0.124-0.311,1.121-0.474,1.479-0.317c-0.035-0.58-0.099-0.774-0.263-0.964\r\n\t\tc-0.215-0.25-1.207-0.471-1.399-0.068L-2.938-0.195z\"/>\r\n                <path fill=\"#017BBC\" d=\"M-2.959-0.274c0.127-0.281,1.135-0.43,1.5-0.287c-0.036-0.525-0.107-0.688-0.268-0.873\r\n\t\tC-1.929-1.667-2.95-1.861-3.146-1.497L-2.959-0.274z\"/>\r\n                <g>\r\n                    <path fill=\"#FDD302\" d=\"M-2.631-1.614c-0.043,0.001-0.086,0.004-0.125,0.009l0.005,0.041c0.038-0.005,0.079-0.008,0.121-0.009\r\n\t\t\tL-2.631-1.614z M-2.507-1.613l-0.002,0.041c0.04,0.002,0.081,0.005,0.122,0.01l0.004-0.041C-2.424-1.607-2.466-1.611-2.507-1.613z\r\n\t\t\t M-2.259-1.585l-0.007,0.041c0.041,0.008,0.081,0.017,0.119,0.026l0.01-0.04C-2.176-1.568-2.217-1.577-2.259-1.585z M-2.88-1.58\r\n\t\t\tC-2.926-1.567-2.965-1.55-2.999-1.53l0.021,0.036c0.03-0.018,0.066-0.033,0.109-0.045L-2.88-1.58z M-2.017-1.522l-0.014,0.04\r\n\t\t\tc0.042,0.015,0.079,0.031,0.109,0.048l0.021-0.035C-1.934-1.488-1.973-1.505-2.017-1.522z M-3.055-1.431l-0.041,0.007l0.02,0.122\r\n\t\t\tl0.041-0.007L-3.055-1.431z M-1.802-1.384L-1.836-1.36c0.022,0.032,0.046,0.066,0.068,0.102l0.035-0.021\r\n\t\t\tC-1.755-1.316-1.779-1.351-1.802-1.384z M-3.015-1.188l-0.041,0.006l0.02,0.122l0.04-0.007L-3.015-1.188z M-1.675-1.168\r\n\t\t\tl-0.038,0.016c0.015,0.037,0.028,0.074,0.04,0.114l0.04-0.011C-1.645-1.091-1.659-1.13-1.675-1.168z M-2.976-0.944l-0.041,0.007\r\n\t\t\tl0.02,0.122l0.041-0.006L-2.976-0.944z M-1.606-0.928L-1.647-0.92c0.006,0.037,0.012,0.078,0.017,0.121l0.041-0.005\r\n\t\t\tC-1.594-0.848-1.6-0.89-1.606-0.928z M-2.102-0.769c-0.041,0-0.083,0.002-0.124,0.005l0.003,0.041\r\n\t\t\tc0.041-0.002,0.082-0.004,0.122-0.005L-2.102-0.769z M-1.978-0.769l-0.001,0.042c0.042,0.001,0.083,0.003,0.123,0.006l0.003-0.041\r\n\t\t\tC-1.893-0.765-1.935-0.768-1.978-0.769z M-2.35-0.754c-0.042,0.004-0.083,0.01-0.124,0.016l0.007,0.041\r\n\t\t\tc0.039-0.006,0.08-0.011,0.121-0.016L-2.35-0.754z M-1.729-0.747l-0.006,0.041c0.044,0.008,0.083,0.017,0.117,0.028l0.013-0.039\r\n\t\t\tC-1.641-0.729-1.683-0.739-1.729-0.747z M-2.595-0.716c-0.043,0.01-0.083,0.02-0.121,0.03l0.011,0.04\r\n\t\t\tc0.037-0.01,0.077-0.021,0.119-0.029L-2.595-0.716z M-2.936-0.701l-0.041,0.007l0.02,0.122l0.015-0.002l0.02,0.025\r\n\t\t\tc0.025-0.02,0.061-0.04,0.103-0.058l-0.016-0.038c-0.032,0.014-0.061,0.029-0.084,0.043L-2.936-0.701z\"/>\r\n                </g>\r\n                <path fill=\"#004373\" d=\"M2.938-0.195C2.814-0.506,1.817-0.669,1.459-0.513c0.035-0.58,0.099-0.774,0.262-0.964\r\n\t\tc0.216-0.25,1.208-0.471,1.4-0.068L2.938-0.195z\"/>\r\n                <path fill=\"#017BBC\" d=\"M2.958-0.274c-0.125-0.281-1.135-0.43-1.5-0.287c0.036-0.525,0.108-0.688,0.269-0.873\r\n\t\tC1.929-1.667,2.95-1.861,3.145-1.497L2.958-0.274z\"/>\r\n                <g>\r\n                    <path fill=\"#FDD302\" d=\"M2.631-1.614L2.63-1.573c0.042,0.001,0.083,0.004,0.121,0.009l0.005-0.041\r\n\t\t\tC2.717-1.609,2.675-1.613,2.631-1.614z M2.506-1.613c-0.041,0.002-0.083,0.005-0.124,0.01l0.004,0.041\r\n\t\t\tc0.041-0.005,0.082-0.008,0.121-0.01L2.506-1.613z M2.258-1.585C2.217-1.577,2.175-1.568,2.137-1.559l0.01,0.04\r\n\t\t\tc0.039-0.009,0.079-0.018,0.119-0.026L2.258-1.585z M2.88-1.58L2.869-1.54c0.042,0.012,0.079,0.027,0.108,0.045L2.999-1.53\r\n\t\t\tC2.966-1.55,2.926-1.567,2.88-1.58z M2.017-1.522C1.972-1.505,1.934-1.488,1.901-1.469l0.021,0.035\r\n\t\t\tc0.03-0.017,0.067-0.034,0.109-0.048L2.017-1.522z M3.055-1.431L3.035-1.31l0.041,0.007l0.02-0.122L3.055-1.431z M1.802-1.384\r\n\t\t\tC1.779-1.351,1.755-1.316,1.733-1.28l0.035,0.021C1.789-1.294,1.813-1.328,1.835-1.36L1.802-1.384z M3.015-1.188l-0.02,0.122\r\n\t\t\tl0.041,0.007l0.02-0.122L3.015-1.188z M1.675-1.168C1.659-1.13,1.646-1.091,1.633-1.049l0.04,0.011\r\n\t\t\tc0.011-0.041,0.024-0.078,0.04-0.114L1.675-1.168z M2.975-0.944l-0.02,0.122l0.041,0.006l0.02-0.122L2.975-0.944z M1.606-0.928\r\n\t\t\tC1.599-0.89,1.593-0.848,1.588-0.804l0.041,0.005C1.634-0.842,1.64-0.883,1.647-0.92L1.606-0.928z M2.101-0.769L2.1-0.729\r\n\t\t\tc0.041,0.001,0.082,0.003,0.123,0.005l0.002-0.041C2.184-0.767,2.142-0.769,2.101-0.769z M1.977-0.769\r\n\t\t\tC1.934-0.768,1.892-0.765,1.853-0.762l0.003,0.041c0.039-0.003,0.08-0.005,0.123-0.006L1.977-0.769z M2.349-0.754L2.345-0.713\r\n\t\t\tc0.041,0.004,0.082,0.009,0.122,0.016l0.006-0.041C2.432-0.744,2.391-0.75,2.349-0.754z M1.729-0.747\r\n\t\t\tc-0.046,0.008-0.088,0.018-0.123,0.03l0.013,0.039c0.033-0.011,0.073-0.021,0.117-0.028L1.729-0.747z M2.595-0.716L2.586-0.676\r\n\t\t\tc0.042,0.009,0.082,0.019,0.119,0.029l0.012-0.04C2.679-0.697,2.638-0.707,2.595-0.716z M2.935-0.701l-0.016,0.1\r\n\t\t\tc-0.023-0.015-0.052-0.03-0.084-0.043L2.819-0.606c0.043,0.018,0.077,0.038,0.103,0.058l0.021-0.025l0.014,0.002l0.02-0.122\r\n\t\t\tL2.935-0.701z\"/>\r\n                </g>\r\n                <path fill=\"#004373\" d=\"M-1.977,3.178c0.035,0.104,0.243,0.098,0.301,0.022c0.082-0.107,0.439-0.767,0.507-1.088\r\n\t\tc0.053-0.25-0.263-0.278-0.297-0.021C-1.498,2.317-1.842,3.015-1.977,3.178\"/>\r\n                <path fill=\"#00FFFF\" d=\"M-2.033,3.205C-2,3.31-1.755,3.31-1.696,3.234c0.084-0.105,0.451-0.759,0.524-1.08\r\n\t\tc0.056-0.249-0.234-0.277-0.298-0.024C-1.525,2.349-1.895,3.044-2.033,3.205\"/>\r\n                <path fill=\"#FDD302\" d=\"M-1.193,2.116c0-0.061-0.049-0.111-0.111-0.111c-0.061,0-0.111,0.05-0.111,0.111\r\n\t\tc0,0.062,0.05,0.111,0.111,0.111C-1.243,2.228-1.193,2.178-1.193,2.116\"/>\r\n                <path fill=\"#004373\" d=\"M1.977,3.178c-0.035,0.104-0.243,0.098-0.3,0.022C1.594,3.093,1.237,2.434,1.169,2.113\r\n\t\tc-0.053-0.25,0.263-0.278,0.297-0.021C1.497,2.317,1.842,3.015,1.977,3.178\"/>\r\n                <path fill=\"#00FFFF\" d=\"M2.032,3.205C1.999,3.31,1.755,3.31,1.696,3.234c-0.083-0.105-0.451-0.759-0.523-1.08\r\n\t\tC1.116,1.905,1.405,1.876,1.469,2.129C1.525,2.349,1.895,3.044,2.032,3.205\"/>\r\n                <path fill=\"#FDD302\" d=\"M1.193,2.116c0-0.061,0.05-0.111,0.11-0.111c0.061,0,0.111,0.05,0.111,0.111\r\n\t\tc0,0.062-0.05,0.111-0.111,0.111C1.243,2.228,1.193,2.178,1.193,2.116\"/>\r\n                <path fill=\"#00FFFF\" d=\"M0.202,7.476h-0.417c-0.399,0-0.722-0.323-0.722-0.722V6.15c0-0.035,0.029-0.064,0.064-0.064H0.86\r\n\t\tc0.036,0,0.064,0.029,0.064,0.064v0.604C0.924,7.153,0.601,7.476,0.202,7.476\"/>\r\n            </symbol>\r\n            <g class='button pauseButton'>\r\n                <path fill=\"#F4911E\" class=\"background\" d=\"M300.093,18.103c0,6.423-5.207,11.63-11.629,11.63c-6.423,0-11.63-5.207-11.63-11.63\r\n\t\ts5.207-11.629,11.63-11.629C294.886,6.473,300.093,11.68,300.093,18.103\"/>\r\n                <g>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M286.507,23.152c-0.599,0-1.085-0.486-1.085-1.085v-8.564c0-0.599,0.486-1.085,1.085-1.085\r\n\t\t\t\tc0.6,0,1.085,0.486,1.085,1.085v8.564C287.593,22.666,287.107,23.152,286.507,23.152z\"/>\r\n                    </g>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M290.612,23.152c-0.599,0-1.085-0.486-1.085-1.085v-8.564c0-0.599,0.486-1.085,1.085-1.085\r\n\t\t\t\tc0.6,0,1.086,0.486,1.086,1.085v8.564C291.698,22.666,291.212,23.152,290.612,23.152z\"/>\r\n                    </g>\r\n                </g>\r\n            </g>\r\n            <g class='button homeButton'>\r\n                <path fill=\"#F4911E\" class=\"background\" d=\"M330.406,18.103c0,6.423-5.207,11.63-11.63,11.63c-6.422,0-11.629-5.207-11.629-11.63\r\n\t\ts5.207-11.629,11.629-11.629C325.2,6.473,330.406,11.68,330.406,18.103\"/>\r\n                <g>\r\n                    <polygon fill=\"#FFFFFF\" points=\"327.305,15.9 318.776,8.333 310.249,15.9 318.776,14.039 \t\t\"/>\r\n                    <polygon fill=\"#FFFFFF\" points=\"318.776,15.215 312.889,16.456 312.889,25.904 316.953,26.982 316.953,22.067 320.601,22.067\r\n\t\t\t320.601,26.982 324.666,25.904 324.666,16.456 \t\t\"/>\r\n                </g>\r\n            </g>\r\n            <text class='scoreLabel' x=\"94\" y=\"10\" text-anchor='middle' fill=\"#FFFFFF\" font-size=\"4.3164\">\r\n            </text>\r\n            <path fill=\"#FFFFFF\" d=\"M106.405,22.915H81.67c-3.023,0-5.473-2.45-5.473-5.472c0-3.023,2.45-5.473,5.473-5.473h24.734\r\n\tc3.022,0,5.472,2.45,5.472,5.473C111.877,20.464,109.427,22.915,106.405,22.915\"/>\r\n            <text class='levelLabel' text-anchor='middle' x=\"155\" y=\"10\" fill=\"#FFFFFF\"\r\n                  font-size=\"4.3164\">\r\n            </text>\r\n            <path fill=\"#FFFFFF\" d=\"M158.519,22.915h-6.129c-3.022,0-5.473-2.45-5.473-5.472c0-3.023,2.45-5.473,5.473-5.473h6.129\r\n\tc3.022,0,5.472,2.45,5.472,5.473C163.99,20.464,161.541,22.915,158.519,22.915\"/>\r\n\r\n            <path fill=\"#FFFFFF\" d=\"M56.805,22.915H32.07c-3.022,0-5.472-2.45-5.472-5.472c0-3.023,2.45-5.473,5.472-5.473h24.735\r\n\tc3.022,0,5.472,2.45,5.472,5.473C62.277,20.464,59.827,22.915,56.805,22.915\"/>\r\n            <g>\r\n                <path fill=\"#B0B0B0\" d=\"M24.113,26.574c-4.896,0-8.879-3.983-8.879-8.879c0-4.896,3.983-8.878,8.879-8.878\r\n\t\tc4.895,0,8.878,3.983,8.878,8.878C32.991,22.591,29.008,26.574,24.113,26.574z M24.113,14.069c-2,0-3.626,1.627-3.626,3.625\r\n\t\tc0,1.999,1.626,3.625,3.626,3.625c1.999,0,3.625-1.626,3.625-3.625C27.738,15.696,26.111,14.069,24.113,14.069z\"/>\r\n            </g>\r\n            <g>\r\n                <path fill=\"#FFFFFF\" d=\"M24.113,25.26c-4.172,0-7.566-3.394-7.566-7.565c0-4.171,3.394-7.565,7.566-7.565\r\n\t\tc4.171,0,7.565,3.394,7.565,7.565C31.678,21.867,28.284,25.26,24.113,25.26z M24.113,12.757c-2.723,0-4.939,2.215-4.939,4.938\r\n\t\tc0,2.724,2.216,4.938,4.939,4.938c2.723,0,4.938-2.215,4.938-4.938C29.051,14.972,26.835,12.757,24.113,12.757z\"/>\r\n            </g>\r\n            <path id=\"clockBackground\" fill=\"#eb1c24\" d=\"M30.364,17.695c0,3.453-2.799,6.252-6.251,6.252c-3.453,0-6.252-2.799-6.252-6.252s2.799-6.252,6.252-6.252\r\n\tC27.565,11.443,30.364,14.242,30.364,17.695\"/>\r\n            <g>\r\n                <rect x=\"23.451\" y=\"7.202\" fill=\"#B0B0B0\" width=\"1.323\" height=\"2.327\"/>\r\n            </g>\r\n            <g>\r\n                <rect x=\"21.557\" y=\"6.448\" fill=\"#B0B0B0\" width=\"5.111\" height=\"1.323\"/>\r\n            </g>\r\n            <g>\r\n                <rect x=\"16.354\" y=\"8.686\" transform=\"matrix(0.5883 0.8087 -0.8087 0.5883 15.3447 -10.3562)\"\r\n                      fill=\"#B0B0B0\" width=\"2.977\" height=\"2.408\"/>\r\n            </g>\r\n            <text id='time' x=\"44\" y='20' text-anchor='middle' fill=\"#666666\" font-size=\"7.88\"></text>\r\n            <text id=\"score\" text-anchor='middle' x=\"94\" y=\"20\" fill=\"#666666\"\r\n                  font-size=\"7.88\">0\r\n            </text>\r\n            <text id='level' x=\"153\" y=\"20\" fill=\"#666666\" font-size=\"7.88\">1</text>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 177.4878 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 190.6787 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 203.8701 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 217.061 16.0083)\" overflow=\"visible\"/>\r\n            <use xlink:href=\"#live_x5F_icon\" class=\"liveIcon\" width=\"11.082\" height=\"14.952\" x=\"-5.541\" y=\"-7.476\"\r\n                 transform=\"matrix(1 0 0 -1 230.252 16.0083)\" overflow=\"visible\"/>\r\n        </svg>\r\n        <svg x=\"0px\" y=\"37px\" class='levelPopup' style='display:none' width=\"330px\" height=\"200px\">\r\n            <g>\r\n                <polygon fill=\"#FFFFFF\" points=\"165,7.417 195.082,68.37 262.347,78.145 213.674,125.59 225.165,192.583 165,160.952\r\n\t\t104.835,192.583 116.327,125.59 67.653,78.145 134.917,68.37 \t\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M156.425,103.669l-7.794-13.539c-0.547-1.602-2.824-1.566-3.322,0.052l3.117,13.438\"/>\r\n                <path fill=\"#00FFFF\"\r\n                      d=\"M147.751,105.679l-2.329-11.446c0.498-1.616,5.085-2.566,5.634-0.965l6.103,10.401L147.751,105.679z\"/>\r\n                <path fill=\"#274571\" d=\"M178.248,79.869c0,1.348-6.029,2.439-13.467,2.439c-7.437,0-13.466-1.092-13.466-2.439\r\n\t\tc0-1.347,6.029-2.439,13.466-2.439C172.219,77.43,178.248,78.522,178.248,79.869\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M173.157,103.669l7.794-13.539c0.547-1.602,2.825-1.566,3.323,0.052l-3.118,13.438\"/>\r\n                <path fill=\"#00FFFF\"\r\n                      d=\"M181.831,105.679l2.329-11.446c-0.498-1.616-5.085-2.566-5.633-0.965l-6.104,10.401L181.831,105.679z\"/>\r\n                <path fill=\"#303D8A\" d=\"M160.188,48.677l-3.793,2.142c-0.994,0.591-1.196,1.921,0.927,2.881c2.125,0.963,4.788,0.708,4.788,0.708\r\n\t\tl0.758-5.848L160.188,48.677z\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M160.313,52.334h-0.849c-0.444,0-0.805-0.361-0.805-0.806s0.36-0.805,0.805-0.805h0.849\"/>\r\n                <path fill=\"#CDB42C\" d=\"M159.374,51.761c0-0.287,0.326-0.519,0.729-0.519c0.273,0,0.51,0.107,0.635,0.267\r\n\t\tc-0.016-0.326-0.389-0.586-0.849-0.586c-0.469,0-0.85,0.271-0.85,0.605c0,0.241,0.197,0.449,0.482,0.548\r\n\t\tC159.429,51.988,159.374,51.88,159.374,51.761\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M169.258,52.334h0.849c0.444,0,0.805-0.361,0.805-0.806s-0.36-0.805-0.805-0.805h-0.849\"/>\r\n                <path fill=\"#CDB42C\" d=\"M170.198,51.761c0-0.287-0.325-0.519-0.728-0.519c-0.274,0-0.513,0.107-0.637,0.267\r\n\t\tc0.016-0.326,0.389-0.586,0.849-0.586c0.47,0,0.85,0.271,0.85,0.605c0,0.241-0.197,0.449-0.482,0.548\r\n\t\tC170.142,51.988,170.198,51.88,170.198,51.761\"/>\r\n                <path fill=\"#F3D332\" d=\"M178.277,77.978l10.36-29.498c0.089-1.867-2.051-2.311-2.999,0l-9.052,14.498l-2.825,1.099\r\n\t\tc-0.756,0-1.428-0.486-1.662-1.206l-3.982-17.378c-0.297-1.401-1.814-2.097-3.33-2.09c-1.517-0.007-3.032,0.688-3.329,2.09\r\n\t\tl-3.982,17.378c-0.234,0.72-0.905,1.206-1.662,1.206l-2.825-1.099l-9.052-14.498c-0.769-1.479-2.98-2.034-2.852,0l10.212,29.498\r\n\t\tc0.613,0.445,0.87,1.233,0.635,1.953l0.213,19.56c-0.393,1.21,0.549,2.267,1.623,2.296c0.358,0.011,0.73-0.092,1.072-0.341\r\n\t\tl8.922-12.923c0.306-0.223,0.665-0.334,1.024-0.335c0.359,0.001,0.719,0.112,1.023,0.335l9.502,16.351\r\n\t\tc0.343,0.249,0.715,0.354,1.072,0.342c1.075-0.028,2.017-1.085,1.623-2.294l-0.365-22.99\r\n\t\tC177.408,79.211,177.665,78.423,178.277,77.978\"/>\r\n                <polygon fill=\"#274571\" points=\"149.902,92.337 149.204,91.123 148.397,100.658 \t\"/>\r\n                <path fill=\"#00FFFF\" d=\"M165.818,92.683c-0.612-0.444-1.442-0.444-2.055,0l-9.109,15.408c-1.369,0.994-7.444-1.265-6.921-2.875\r\n\t\tl3.582-25.285c2.235,1.046,4.315,0.345,4.506-1.574c0,0,0.583-6.195,0.146-9.443c-0.058-0.423,0.269-0.802,0.696-0.798l8.127,0.07\"\r\n                />\r\n                <polygon fill=\"#274571\" points=\"179.68,92.337 180.378,91.123 181.185,100.658 \t\"/>\r\n                <path fill=\"#00FFFF\" d=\"M163.764,92.683c0.612-0.444,1.442-0.444,2.055,0l9.108,15.408c1.37,0.994,7.445-1.265,6.921-2.875\r\n\t\tl-3.582-25.285c-2.235,1.046-4.314,0.345-4.505-1.574c0,0-0.583-6.195-0.146-9.443c0.058-0.423-0.269-0.802-0.696-0.798\r\n\t\tl-8.127,0.07\"/>\r\n                <g>\r\n                    <path fill=\"#0071BC\" d=\"M178.118,80.818l-0.077-0.193c0.095-0.038,0.188-0.077,0.282-0.122l0.088,0.189\r\n\t\t\tC178.313,80.737,178.217,80.779,178.118,80.818z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#0071BC\" d=\"M153.356,81.177c-0.001,0-0.002,0-0.003,0l-0.012-0.208c0.211,0.006,0.417-0.012,0.612-0.038l0.027,0.206\r\n\t\t\tC153.776,81.163,153.566,81.177,153.356,81.177z M176.24,81.177h-0.01c-0.212,0-0.424-0.014-0.629-0.041l0.026-0.206\r\n\t\t\tc0.196,0.026,0.399,0.039,0.603,0.039L176.24,81.177z M176.88,81.136l-0.026-0.206c0.203-0.026,0.406-0.066,0.603-0.116\r\n\t\t\tl0.053,0.202C177.302,81.068,177.09,81.108,176.88,81.136z M152.701,81.136c-0.211-0.027-0.422-0.067-0.629-0.121l0.052-0.201\r\n\t\t\tc0.198,0.05,0.401,0.09,0.604,0.116L152.701,81.136z M154.609,81.005l-0.058-0.199c0.202-0.059,0.393-0.132,0.568-0.219\r\n\t\t\tl0.093,0.187C155.026,80.865,154.823,80.944,154.609,81.005z M174.971,81.005c-0.213-0.062-0.416-0.14-0.603-0.232l0.093-0.187\r\n\t\t\tc0.174,0.088,0.366,0.161,0.567,0.22L174.971,81.005z M155.759,80.423l-0.131-0.16c0.159-0.132,0.295-0.279,0.404-0.438\r\n\t\t\tl0.171,0.116C156.085,80.117,155.935,80.278,155.759,80.423z M173.821,80.421c-0.175-0.144-0.325-0.306-0.444-0.48l0.171-0.118\r\n\t\t\tc0.108,0.159,0.245,0.307,0.405,0.438L173.821,80.421z M156.483,79.346l-0.2-0.056c0.028-0.103,0.048-0.21,0.06-0.317l0.001-0.015\r\n\t\t\tc0.003-0.032,0.012-0.126,0.024-0.271l0.207,0.018c-0.01,0.111-0.017,0.193-0.021,0.239l0.001,0.001l-0.005,0.047\r\n\t\t\tC156.538,79.112,156.515,79.231,156.483,79.346z M173.099,79.344c-0.033-0.113-0.055-0.232-0.066-0.352\r\n\t\t\tc0-0.001-0.009-0.104-0.025-0.29l0.207-0.017c0.016,0.184,0.025,0.286,0.025,0.286c0.01,0.107,0.03,0.214,0.059,0.315\r\n\t\t\tL173.099,79.344z M156.625,78.078l-0.207-0.017c0.015-0.187,0.03-0.396,0.046-0.627l0.207,0.016\r\n\t\t\tC156.655,77.68,156.64,77.89,156.625,78.078z M172.957,78.075c-0.014-0.187-0.029-0.397-0.045-0.628l0.207-0.015\r\n\t\t\tc0.017,0.23,0.032,0.44,0.046,0.627L172.957,78.075z M156.713,76.822l-0.208-0.013c0.012-0.201,0.025-0.41,0.037-0.627\r\n\t\t\tl0.208,0.012C156.738,76.412,156.726,76.621,156.713,76.822z M172.871,76.818c-0.012-0.199-0.024-0.41-0.037-0.628l0.208-0.01\r\n\t\t\tc0.013,0.216,0.024,0.425,0.037,0.626L172.871,76.818z M156.782,75.565l-0.208-0.01c0.009-0.205,0.019-0.415,0.027-0.627\r\n\t\t\tl0.208,0.008C156.801,75.149,156.792,75.361,156.782,75.565z M172.804,75.562c-0.009-0.205-0.019-0.415-0.027-0.628l0.208-0.008\r\n\t\t\tc0.008,0.213,0.017,0.423,0.027,0.627L172.804,75.562z M156.832,74.309l-0.208-0.009c0.006-0.206,0.011-0.414,0.016-0.626\r\n\t\t\tl0.208,0.005C156.843,73.889,156.838,74.1,156.832,74.309z M172.755,74.305c-0.006-0.207-0.012-0.418-0.015-0.63l0.208-0.004\r\n\t\t\tc0.003,0.21,0.008,0.42,0.015,0.627L172.755,74.305z M156.856,73.048l-0.208-0.001c0.002-0.127,0.002-0.253,0.002-0.38\r\n\t\t\tl-0.001-0.247l0.209-0.001v0.248C156.858,72.795,156.858,72.921,156.856,73.048z M172.731,73.046c0-0.112,0-0.227,0-0.339\r\n\t\t\tc0-0.097,0-0.194,0-0.291l0.208,0.002c0,0.096,0,0.193,0,0.289c0,0.112,0,0.225,0.001,0.337L172.731,73.046z M156.641,71.793\r\n\t\t\tc-0.005-0.211-0.012-0.419-0.02-0.625l0.208-0.007c0.008,0.205,0.015,0.415,0.02,0.629L156.641,71.793z M172.949,71.791\r\n\t\t\tl-0.208-0.004c0.005-0.214,0.013-0.425,0.021-0.631l0.208,0.011C172.96,71.37,172.954,71.58,172.949,71.791z M156.586,70.544\r\n\t\t\tc-0.015-0.219-0.034-0.427-0.053-0.622l0.207-0.021c0.021,0.196,0.039,0.408,0.055,0.629L156.586,70.544z M173.004,70.541\r\n\t\t\tl-0.207-0.014c0.015-0.22,0.034-0.432,0.054-0.629l0.208,0.021C173.038,70.116,173.019,70.324,173.004,70.541z M156.694,69.306\r\n\t\t\tl-0.205-0.036c0.045-0.242,0.202-0.45,0.42-0.561l0.092,0.187C156.842,68.977,156.727,69.131,156.694,69.306z M172.896,69.304\r\n\t\t\tc-0.033-0.176-0.149-0.328-0.31-0.408l0.092-0.188c0.218,0.108,0.376,0.317,0.422,0.557L172.896,69.304z M172.016,68.836h-0.628\r\n\t\t\tv-0.207h0.628V68.836z M170.76,68.836h-0.628v-0.207h0.628V68.836z M169.504,68.836h-0.628v-0.207h0.628V68.836z M168.248,68.836\r\n\t\t\th-0.628v-0.207h0.628V68.836z M166.993,68.836h-0.628v-0.207h0.628V68.836z M165.736,68.836h-0.628v-0.207h0.628V68.836z\r\n\t\t\t M164.48,68.836h-0.628v-0.207h0.628V68.836z M163.224,68.836h-0.627v-0.207h0.627V68.836z M161.969,68.836h-0.628v-0.207h0.628\r\n\t\t\tV68.836z M160.713,68.836h-0.628v-0.207h0.628V68.836z M159.457,68.836h-0.628v-0.207h0.628V68.836z M158.201,68.836h-0.628\r\n\t\t\tv-0.207h0.628V68.836z\"/>\r\n                </g>\r\n                <g>\r\n                    <path fill=\"#0071BC\" d=\"M151.464,80.818c-0.098-0.039-0.197-0.081-0.292-0.126l0.088-0.189c0.093,0.045,0.186,0.084,0.281,0.122\r\n\t\t\tL151.464,80.818z\"/>\r\n                </g>\r\n                <path fill=\"#FFFFFF\" d=\"M164.957,53.557c0.129,1.132-0.701,2.098-1.854,2.158c-1.154,0.061-2.194-0.809-2.323-1.939\r\n\t\tc-0.13-1.132,0.7-2.099,1.853-2.158C163.786,51.557,164.826,52.426,164.957,53.557\"/>\r\n                <path fill=\"#282B4F\" d=\"M161.198,51.635c0,0,0.025-0.046,0.078-0.126c0.052-0.08,0.136-0.189,0.255-0.305\r\n\t\tc0.12-0.113,0.275-0.238,0.471-0.33c0.191-0.095,0.421-0.154,0.651-0.17c0.049-0.006,0.119-0.003,0.176-0.006\r\n\t\tc0.058,0.002,0.117,0.002,0.174,0.006c0.117,0.009,0.23,0.029,0.335,0.064c0.21,0.073,0.382,0.19,0.507,0.311\r\n\t\tc0.064,0.058,0.116,0.119,0.159,0.172c0.043,0.057,0.077,0.106,0.101,0.15c0.049,0.087,0.068,0.142,0.068,0.142l-0.029,0.029\r\n\t\tc0,0-0.055-0.021-0.141-0.062c-0.086-0.04-0.205-0.096-0.343-0.155c-0.14-0.059-0.297-0.12-0.464-0.177\r\n\t\tc-0.082-0.031-0.168-0.063-0.26-0.089c-0.044-0.016-0.09-0.024-0.137-0.035c-0.047-0.007-0.085-0.016-0.142-0.017\r\n\t\tc-0.39-0.03-0.778,0.108-1.033,0.281c-0.129,0.084-0.226,0.175-0.291,0.236c-0.066,0.063-0.103,0.104-0.103,0.104L161.198,51.635z\"\r\n                />\r\n                <path fill=\"#282B4F\" d=\"M168.352,51.66c0,0-0.036-0.04-0.102-0.104c-0.066-0.062-0.163-0.152-0.292-0.236\r\n\t\tc-0.255-0.173-0.644-0.312-1.033-0.281c-0.057,0.001-0.095,0.01-0.142,0.017c-0.046,0.011-0.092,0.02-0.139,0.035\r\n\t\tc-0.089,0.026-0.175,0.058-0.258,0.089c-0.168,0.057-0.324,0.118-0.463,0.177c-0.139,0.06-0.257,0.115-0.344,0.155\r\n\t\tc-0.086,0.04-0.141,0.062-0.141,0.062l-0.03-0.029c0,0,0.02-0.055,0.069-0.142c0.025-0.044,0.058-0.094,0.101-0.15\r\n\t\tc0.043-0.053,0.095-0.114,0.159-0.172c0.126-0.12,0.297-0.237,0.507-0.31c0.105-0.036,0.218-0.057,0.335-0.065\r\n\t\tc0.058-0.004,0.116-0.004,0.174-0.006c0.059,0.003,0.127,0,0.176,0.006c0.23,0.016,0.46,0.075,0.652,0.17\r\n\t\tc0.193,0.092,0.35,0.217,0.47,0.33c0.12,0.115,0.203,0.225,0.255,0.305c0.053,0.08,0.079,0.126,0.079,0.126L168.352,51.66z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M164.626,53.557c-0.13,1.132,0.701,2.098,1.853,2.158c1.153,0.061,2.194-0.809,2.324-1.939\r\n\t\tc0.129-1.132-0.701-2.099-1.854-2.158C165.796,51.557,164.755,52.426,164.626,53.557\"/>\r\n                <path fill=\"#282B4F\" d=\"M164.27,53.503c0,0.564-0.458,1.022-1.023,1.022s-1.023-0.458-1.023-1.022c0-0.565,0.458-1.023,1.023-1.023\r\n\t\tS164.27,52.938,164.27,53.503\"/>\r\n                <path fill=\"#282B4F\" d=\"M167.417,53.503c0,0.564-0.459,1.022-1.024,1.022s-1.023-0.458-1.023-1.022\r\n\t\tc0-0.565,0.458-1.023,1.023-1.023S167.417,52.938,167.417,53.503\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M167.774,58.004c-3.043,3.913-6.062,0.103-6.062,0.103C162.733,58.349,166.351,58.586,167.774,58.004\"/>\r\n                <path fill=\"#D27C1D\" d=\"M168.722,57.688l-0.547,0.639l-0.146,0.171l-0.168,0.186c-0.111,0.115-0.225,0.23-0.345,0.341\r\n\t\tc-0.241,0.221-0.502,0.426-0.787,0.6c-0.287,0.177-0.598,0.319-0.928,0.416c-0.33,0.095-0.676,0.141-1.019,0.128\r\n\t\tc-0.688-0.022-1.331-0.269-1.874-0.61c-0.273-0.171-0.527-0.366-0.761-0.577c-0.118-0.108-0.231-0.218-0.339-0.333\r\n\t\tc-0.11-0.115-0.21-0.228-0.316-0.365l-0.523-0.677l0.809,0.227c0.224,0.064,0.473,0.111,0.718,0.153\r\n\t\tc0.247,0.042,0.497,0.077,0.747,0.108c0.501,0.062,1.006,0.106,1.513,0.133s1.012,0.035,1.519,0.012\r\n\t\tc0.254-0.011,0.507-0.031,0.757-0.066c0.126-0.017,0.251-0.037,0.375-0.066c0.125-0.024,0.247-0.061,0.368-0.101L168.722,57.688z\r\n\t\t M166.892,58.269c-0.2,0.041-0.401,0.081-0.604,0.109c-0.508,0.07-1.022,0.107-1.534,0.128c-0.514,0.021-1.027,0.021-1.542,0.007\r\n\t\tc-0.257-0.007-0.516-0.02-0.774-0.039c-0.261-0.021-0.517-0.044-0.79-0.094l0.285-0.448c0.085,0.095,0.191,0.201,0.293,0.296\r\n\t\tc0.104,0.098,0.212,0.19,0.324,0.277c0.223,0.175,0.458,0.333,0.703,0.465c0.488,0.265,1.02,0.419,1.536,0.402\r\n\t\tc0.517-0.016,1.01-0.203,1.442-0.512c0.217-0.154,0.419-0.335,0.608-0.532C166.857,58.31,166.874,58.288,166.892,58.269\"/>\r\n                <path fill=\"#274571\" d=\"M151.353,81.894c0.649,1.624,3.931,2.482,5.806,1.657c-0.183,3.036-0.519,4.053-1.375,5.045\r\n\t\tc-1.128,1.308-4.386,2.468-5.391,0.358L151.353,81.894z\"/>\r\n                <path fill=\"#457AB9\" d=\"M151.245,82.309c0.661,1.472,4.004,2.247,5.914,1.503c-0.186,2.747-0.563,3.596-1.401,4.564\r\n\t\tc-1.057,1.22-4.466,2.232-5.49,0.324L151.245,82.309z\"/>\r\n                <g>\r\n                    <path fill=\"#F3D332\" d=\"M152.488,89.318h-0.054l0.002-0.214h0.051c0.186,0,0.379-0.015,0.576-0.044l0.03,0.212\r\n\t\t\tC152.888,89.304,152.684,89.318,152.488,89.318z M151.771,89.243c-0.234-0.054-0.446-0.137-0.63-0.244l0.109-0.186\r\n\t\t\tc0.165,0.098,0.356,0.171,0.569,0.22L151.771,89.243z M153.739,89.132l-0.061-0.206c0.207-0.062,0.404-0.137,0.588-0.223\r\n\t\t\tl0.091,0.195C154.164,88.987,153.956,89.066,153.739,89.132z M154.931,88.558l-0.13-0.172c0.154-0.114,0.274-0.234,0.359-0.357\r\n\t\t\tl0.059-0.085l0.176,0.124l-0.059,0.084C155.237,88.292,155.101,88.429,154.931,88.558z M150.633,88.542\r\n\t\t\tc-0.034-0.046-0.064-0.093-0.093-0.144l-0.019-0.033l0.085-0.517l0.212,0.034l-0.073,0.441c0.019,0.032,0.04,0.062,0.062,0.092\r\n\t\t\tL150.633,88.542z M155.754,87.523l-0.186-0.11c0.11-0.186,0.203-0.369,0.281-0.562l0.199,0.083\r\n\t\t\tC155.965,87.135,155.87,87.328,155.754,87.523z M150.921,87.247l-0.211-0.034l0.104-0.637l0.212,0.034L150.921,87.247z\r\n\t\t\t M156.257,86.31l-0.207-0.056c0.05-0.191,0.096-0.398,0.135-0.62l0.211,0.037C156.357,85.897,156.311,86.112,156.257,86.31z\r\n\t\t\t M151.13,85.975l-0.212-0.036l0.104-0.637l0.212,0.035L151.13,85.975z M156.485,85.024l-0.213-0.021\r\n\t\t\tc0.016-0.142,0.029-0.29,0.041-0.447l-0.04-0.12c0.039-0.013,0.078-0.026,0.116-0.04l0.156-0.058l-0.012,0.166\r\n\t\t\tC156.519,84.688,156.503,84.861,156.485,85.024z M154.394,84.896c-0.217-0.008-0.438-0.026-0.653-0.055l0.028-0.213\r\n\t\t\tc0.209,0.027,0.421,0.045,0.632,0.053L154.394,84.896z M155.05,84.885l-0.016-0.215c0.215-0.015,0.426-0.041,0.628-0.078\r\n\t\t\tl0.039,0.21C155.493,84.841,155.273,84.868,155.05,84.885z M153.096,84.725c-0.217-0.053-0.429-0.116-0.63-0.188l0.073-0.201\r\n\t\t\tc0.192,0.069,0.396,0.129,0.606,0.18L153.096,84.725z M151.338,84.7l-0.212-0.034l0.104-0.636l0.212,0.033L151.338,84.7z\r\n\t\t\t M151.863,84.271c-0.207-0.108-0.394-0.229-0.559-0.359l0.134-0.169c0.153,0.123,0.33,0.236,0.524,0.339L151.863,84.271z\"/>\r\n                </g>\r\n                <path fill=\"#274571\" d=\"M178.229,81.894c-0.649,1.624-3.931,2.482-5.806,1.657c0.183,3.036,0.519,4.053,1.376,5.045\r\n\t\tc1.127,1.308,4.385,2.468,5.39,0.358L178.229,81.894z\"/>\r\n                <path fill=\"#457AB9\" d=\"M178.337,82.309c-0.662,1.472-4.005,2.247-5.914,1.503c0.186,2.747,0.562,3.596,1.401,4.564\r\n\t\tc1.057,1.22,4.466,2.232,5.49,0.324L178.337,82.309z\"/>\r\n                <g>\r\n                    <path fill=\"#F3D332\" d=\"M177.092,89.318c-0.195,0-0.399-0.015-0.604-0.046l0.031-0.212c0.194,0.029,0.388,0.044,0.573,0.044\r\n\t\t\tc0,0,0.001,0,0.002,0h0.051l0.002,0.214h-0.054C177.093,89.318,177.092,89.318,177.092,89.318z M177.811,89.243l-0.047-0.21\r\n\t\t\tc0.212-0.049,0.403-0.122,0.568-0.22l0.109,0.186C178.257,89.107,178.045,89.189,177.811,89.243z M175.843,89.132\r\n\t\t\tc-0.216-0.065-0.425-0.145-0.619-0.233l0.091-0.195c0.184,0.086,0.381,0.159,0.588,0.223L175.843,89.132z M174.652,88.558\r\n\t\t\tc-0.171-0.129-0.308-0.266-0.407-0.406l-0.059-0.084l0.176-0.122l0.059,0.083c0.085,0.123,0.207,0.243,0.359,0.357L174.652,88.558\r\n\t\t\tz M178.95,88.542l-0.174-0.126c0.021-0.03,0.042-0.061,0.061-0.092l-0.071-0.441l0.211-0.035l0.085,0.518l-0.019,0.033\r\n\t\t\tC179.013,88.449,178.983,88.496,178.95,88.542z M173.829,87.523c-0.115-0.195-0.212-0.389-0.295-0.589l0.199-0.083\r\n\t\t\tc0.079,0.192,0.17,0.376,0.281,0.562L173.829,87.523z M178.66,87.247l-0.104-0.637l0.212-0.034l0.104,0.637L178.66,87.247z\r\n\t\t\t M173.325,86.31c-0.053-0.195-0.099-0.412-0.139-0.639l0.212-0.037c0.038,0.222,0.083,0.43,0.133,0.62L173.325,86.31z\r\n\t\t\t M178.452,85.975l-0.104-0.638l0.212-0.035l0.105,0.637L178.452,85.975z M173.096,85.024c-0.018-0.163-0.034-0.336-0.046-0.521\r\n\t\t\tl-0.011-0.165l0.155,0.057c0.038,0.014,0.077,0.027,0.116,0.04l-0.04,0.12c0.012,0.157,0.025,0.306,0.041,0.447L173.096,85.024z\r\n\t\t\t M175.188,84.896l-0.007-0.215c0.21-0.008,0.423-0.025,0.632-0.053l0.027,0.213C175.625,84.87,175.405,84.889,175.188,84.896z\r\n\t\t\t M174.533,84.885c-0.224-0.017-0.443-0.044-0.652-0.083l0.039-0.21c0.202,0.037,0.413,0.063,0.628,0.078L174.533,84.885z\r\n\t\t\t M176.486,84.725l-0.05-0.21c0.209-0.051,0.414-0.11,0.606-0.18l0.072,0.201C176.916,84.608,176.705,84.672,176.486,84.725z\r\n\t\t\t M178.246,84.7l-0.105-0.637l0.212-0.035l0.104,0.638L178.246,84.7z M177.72,84.271l-0.101-0.19\r\n\t\t\tc0.194-0.102,0.372-0.215,0.525-0.338l0.133,0.169C178.114,84.042,177.926,84.163,177.72,84.271z\"/>\r\n                </g>\r\n                <path fill=\"#274571\" d=\"M154.655,63.62c0.182-0.545,1.271-0.518,1.574-0.12c0.428,0.562,2.09,4.634,2.445,6.318\r\n\t\tc0.276,1.307-1.375,1.457-1.558,0.106C156.958,68.745,155.361,64.475,154.655,63.62\"/>\r\n                <path fill=\"#00FFFF\" d=\"M154.367,63.478c0.173-0.547,1.448-0.546,1.758-0.152c0.437,0.555,2.152,4.597,2.533,6.276\r\n\t\tc0.296,1.302-1.22,1.45-1.555,0.131C156.812,68.582,155.086,64.32,154.367,63.478\"/>\r\n                <path fill=\"#0071BC\" d=\"M158.548,69.799c0,0.319-0.259,0.578-0.579,0.578c-0.32,0-0.58-0.259-0.58-0.578\r\n\t\tc0-0.32,0.259-0.579,0.58-0.579C158.289,69.22,158.548,69.479,158.548,69.799\"/>\r\n                <path fill=\"#274571\" d=\"M174.926,63.62c-0.182-0.545-1.27-0.518-1.573-0.12c-0.427,0.562-2.09,4.634-2.445,6.318\r\n\t\tc-0.276,1.307,1.375,1.457,1.558,0.106C172.625,68.745,174.221,64.475,174.926,63.62\"/>\r\n                <path fill=\"#00FFFF\" d=\"M175.215,63.478c-0.173-0.547-1.45-0.546-1.759-0.152c-0.436,0.555-2.151,4.597-2.532,6.276\r\n\t\tc-0.295,1.302,1.221,1.45,1.555,0.131C172.771,68.582,174.496,64.32,175.215,63.478\"/>\r\n                <path fill=\"#0071BC\" d=\"M171.034,69.799c0,0.319,0.259,0.578,0.58,0.578c0.319,0,0.579-0.259,0.579-0.578\r\n\t\tc0-0.32-0.259-0.579-0.579-0.579C171.293,69.22,171.034,69.479,171.034,69.799\"/>\r\n                <path fill=\"#00FFFF\" d=\"M165.848,41.756h-2.184c-2.085,0-3.776,1.69-3.776,3.775v3.16c0,0.185,0.149,0.332,0.333,0.332h9.07\r\n\t\tc0.184,0,0.332-0.147,0.332-0.332v-3.16C169.624,43.446,167.934,41.756,165.848,41.756\"/>\r\n                <g class=\"goButton button\">\r\n                    <path fill=\"#9DC44D\" class='background' d=\"M174.857,117.131c0,5.559-4.507,10.065-10.066,10.065c-5.561,0-10.067-4.507-10.067-10.065\r\n\t\t\tc0-5.56,4.507-10.066,10.067-10.066C170.35,107.064,174.857,111.571,174.857,117.131\"/>\r\n                    <path fill=\"#FFFFFF\" d=\"M161.697,113.534c-0.59-0.157-1.183-0.044-1.777,0.343c-0.595,0.385-1.088,0.965-1.481,1.734\r\n\t\t\tc-0.387,0.732-0.572,1.486-0.556,2.262c0.016,0.775,0.248,1.391,0.696,1.848c0.299,0.299,0.594,0.456,0.885,0.473\r\n\t\t\tc0.261,0.007,0.528-0.086,0.804-0.284c0.283-0.196,0.546-0.468,0.791-0.813c0.236-0.338,0.433-0.696,0.59-1.075l0.414-1.005\r\n\t\t\tl0.046-0.129l-0.59,0.178c-0.59,0.188-1.181,0.39-1.771,0.603c-0.133,0.054-0.266,0.05-0.395-0.013\r\n\t\t\tc-0.13-0.062-0.221-0.16-0.272-0.295c-0.05-0.134-0.045-0.266,0.018-0.395c0.063-0.131,0.161-0.219,0.295-0.268\r\n\t\t\tc0.599-0.228,1.201-0.437,1.807-0.624c0.44-0.134,0.794-0.229,1.062-0.284c0.173-0.04,0.315-0.063,0.426-0.071\r\n\t\t\tc0.087-0.008,0.162-0.008,0.225,0c0.142,0.024,0.255,0.074,0.342,0.153c0.11,0.096,0.169,0.212,0.177,0.355v0.105\r\n\t\t\tc-0.008,0.016-0.012,0.035-0.012,0.059c-0.007,0.009-0.012,0.021-0.012,0.036c-0.008,0.009-0.011,0.019-0.011,0.036l-0.024,0.07\r\n\t\t\tl-0.094,0.213l-0.26,0.649l-0.401,1.026c-0.189,0.441-0.433,0.873-0.732,1.299c-0.299,0.425-0.637,0.767-1.016,1.027\r\n\t\t\tc-0.473,0.338-0.956,0.5-1.453,0.483c-0.55-0.031-1.073-0.291-1.57-0.779c-0.449-0.448-0.744-0.991-0.886-1.629\r\n\t\t\tc-0.149-0.639-0.169-1.268-0.059-1.89c0.11-0.614,0.315-1.211,0.614-1.794c0.228-0.44,0.492-0.834,0.791-1.181\r\n\t\t\tc0.299-0.36,0.644-0.677,1.033-0.944c0.39-0.268,0.801-0.44,1.233-0.52c0.441-0.086,0.91-0.071,1.405,0.048\r\n\t\t\tc0.133,0.031,0.235,0.11,0.307,0.236c0.07,0.126,0.088,0.257,0.054,0.396c-0.036,0.137-0.117,0.242-0.243,0.313\r\n\t\t\tC161.972,113.559,161.838,113.574,161.697,113.534\"/>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M159.485,121.57c-0.026,0-0.051,0-0.078-0.001c-0.641-0.037-1.243-0.331-1.796-0.875\r\n\t\t\t\tc-0.495-0.496-0.823-1.1-0.978-1.797c-0.159-0.677-0.18-1.359-0.062-2.022c0.116-0.645,0.333-1.281,0.646-1.891\r\n\t\t\t\tc0.239-0.462,0.521-0.881,0.836-1.245c0.312-0.378,0.683-0.719,1.097-1.003c0.428-0.293,0.887-0.485,1.365-0.573\r\n\t\t\t\tc0.475-0.094,1.003-0.077,1.543,0.051c0.225,0.055,0.406,0.191,0.523,0.4c0.114,0.2,0.143,0.423,0.085,0.644\r\n\t\t\t\tc-0.057,0.226-0.196,0.407-0.402,0.523c-0.204,0.113-0.431,0.142-0.658,0.077c-0.483-0.128-0.993-0.031-1.503,0.302\r\n\t\t\t\tc-0.541,0.351-1,0.891-1.365,1.604c-0.358,0.682-0.533,1.388-0.518,2.101c0.015,0.693,0.21,1.223,0.6,1.619\r\n\t\t\t\tc0.235,0.235,0.459,0.36,0.664,0.372h0.012c0.177,0,0.372-0.074,0.576-0.222c0.253-0.175,0.492-0.421,0.712-0.734\r\n\t\t\t\tc0.219-0.315,0.406-0.655,0.555-1.01l0.196-0.477c-0.55,0.177-1.112,0.367-1.666,0.567c-0.219,0.088-0.451,0.081-0.663-0.023\r\n\t\t\t\tc-0.207-0.1-0.359-0.265-0.44-0.478c-0.084-0.221-0.075-0.45,0.029-0.664c0.102-0.209,0.271-0.36,0.487-0.437\r\n\t\t\t\tc0.592-0.227,1.207-0.439,1.818-0.63c0.45-0.136,0.817-0.234,1.095-0.292c0.186-0.043,0.341-0.066,0.469-0.076\r\n\t\t\t\tc0.101-0.009,0.206-0.009,0.289,0.002c0.221,0.036,0.393,0.115,0.527,0.238c0.173,0.147,0.275,0.352,0.288,0.585l0.001,0.205\r\n\t\t\t\tl-0.013,0.024v0.097l-0.011,0.012v0.02l-0.042,0.043l-0.023,0.062l-0.093,0.214l-0.255,0.638l-0.4,1.024\r\n\t\t\t\tc-0.201,0.47-0.459,0.928-0.77,1.37c-0.322,0.457-0.691,0.829-1.101,1.111C160.559,121.385,160.027,121.57,159.485,121.57z\r\n\t\t\t\t M161.151,112.778c-0.175,0-0.346,0.016-0.511,0.048c-0.389,0.071-0.759,0.227-1.108,0.468c-0.362,0.248-0.686,0.545-0.963,0.88\r\n\t\t\t\tc-0.286,0.331-0.537,0.706-0.752,1.121c-0.282,0.548-0.478,1.12-0.582,1.699c-0.102,0.572-0.082,1.162,0.056,1.752\r\n\t\t\t\tc0.128,0.575,0.395,1.066,0.795,1.468c0.438,0.431,0.88,0.654,1.352,0.681c0.01,0,0.028,0.001,0.046,0.001h0.001\r\n\t\t\t\tc0.403,0,0.793-0.139,1.189-0.422c0.348-0.239,0.662-0.557,0.936-0.947c0.284-0.403,0.52-0.82,0.698-1.237l0.657-1.668\r\n\t\t\t\tl0.101-0.235c0.005-0.023,0.012-0.046,0.02-0.068c0.001-0.005,0.003-0.012,0.005-0.017c0.001-0.007,0.002-0.013,0.003-0.019\r\n\t\t\t\tv-0.045c-0.003-0.045-0.021-0.076-0.059-0.11c-0.045-0.039-0.103-0.063-0.179-0.075c-0.011-0.002-0.08-0.003-0.139,0.002\r\n\t\t\t\tc-0.098,0.008-0.224,0.028-0.38,0.065c-0.265,0.054-0.611,0.146-1.04,0.277c-0.595,0.185-1.195,0.393-1.784,0.617\r\n\t\t\t\tc-0.058,0.021-0.088,0.048-0.112,0.098c-0.023,0.047-0.024,0.081-0.006,0.127c0.021,0.054,0.052,0.087,0.104,0.112\r\n\t\t\t\tc0.045,0.021,0.075,0.021,0.12,0.005l0.013-0.007c0.591-0.212,1.19-0.416,1.783-0.605l1.241-0.372l-0.278,0.762l-0.418,1.017\r\n\t\t\t\tc-0.167,0.4-0.377,0.782-0.625,1.139c-0.268,0.379-0.562,0.681-0.876,0.898c-0.318,0.228-0.645,0.345-0.965,0.345l-0.04-0.001\r\n\t\t\t\tc-0.384-0.021-0.756-0.212-1.114-0.57c-0.511-0.521-0.777-1.221-0.795-2.081c-0.017-0.828,0.183-1.645,0.594-2.425\r\n\t\t\t\tc0.417-0.816,0.955-1.444,1.596-1.86c0.672-0.437,1.368-0.566,2.047-0.385c0.066,0.018,0.102,0.013,0.15-0.017\r\n\t\t\t\tc0.045-0.025,0.068-0.054,0.081-0.103c0.014-0.054,0.007-0.096-0.021-0.146c-0.028-0.051-0.056-0.065-0.09-0.073\r\n\t\t\t\tC161.643,112.809,161.39,112.778,161.151,112.778z\"/>\r\n                    </g>\r\n                    <path fill=\"#FFFFFF\" d=\"M166.228,112.602c0.079-0.119,0.184-0.192,0.318-0.225c0.504-0.118,0.925-0.118,1.264,0\r\n\t\t\tc0.236,0.08,0.575,0.289,1.016,0.627c0.739,0.574,1.265,1.302,1.576,2.184c0.311,0.881,0.362,1.78,0.154,2.697\r\n\t\t\tc-0.209,0.917-0.664,1.694-1.364,2.331c-0.252,0.236-0.549,0.441-0.892,0.613c-0.342,0.174-0.678,0.272-1.008,0.297\r\n\t\t\tc-1.22,0.078-2.166-0.297-2.833-1.122c-0.583-0.716-0.862-1.636-0.839-2.764c0.017-0.613,0.123-1.218,0.319-1.811\r\n\t\t\tc0.196-0.594,0.494-1.148,0.892-1.665C165.226,113.25,165.692,112.861,166.228,112.602 M167.089,113.369\r\n\t\t\tc-0.7,0.212-1.275,0.692-1.723,1.44c-0.449,0.747-0.685,1.566-0.708,2.455c-0.016,0.865,0.184,1.559,0.602,2.078\r\n\t\t\tc0.449,0.552,1.102,0.799,1.96,0.744c0.189-0.017,0.401-0.083,0.638-0.201c0.235-0.117,0.444-0.26,0.626-0.425\r\n\t\t\tc0.543-0.496,0.895-1.1,1.057-1.813c0.162-0.712,0.122-1.415-0.119-2.108c-0.241-0.69-0.651-1.263-1.233-1.711\r\n\t\t\tc-0.346-0.268-0.583-0.425-0.709-0.473c-0.087-0.022-0.185-0.034-0.295-0.034C167.152,113.345,167.121,113.361,167.089,113.369\"/>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M166.978,121.473c-1.172,0-2.109-0.422-2.783-1.257c-0.631-0.775-0.939-1.779-0.914-2.982\r\n\t\t\t\tc0.017-0.645,0.13-1.287,0.336-1.91c0.208-0.627,0.526-1.221,0.944-1.765c0.41-0.531,0.895-0.942,1.444-1.223\r\n\t\t\t\tc0.121-0.146,0.279-0.244,0.464-0.288c0.565-0.132,1.053-0.129,1.452,0.011c0.27,0.089,0.633,0.312,1.109,0.677\r\n\t\t\t\tc0.79,0.614,1.358,1.4,1.689,2.34c0.331,0.938,0.387,1.909,0.164,2.884c-0.223,0.981-0.715,1.825-1.465,2.507\r\n\t\t\t\tc-0.271,0.254-0.597,0.479-0.966,0.666c-0.381,0.192-0.764,0.304-1.137,0.331C167.199,121.469,167.087,121.473,166.978,121.473z\r\n\t\t\t\t M167.239,112.625c-0.183,0-0.391,0.028-0.616,0.08c-0.05,0.012-0.084,0.036-0.115,0.082l-0.05,0.078l-0.083,0.04\r\n\t\t\t\tc-0.485,0.235-0.916,0.595-1.279,1.064c-0.373,0.483-0.654,1.011-0.838,1.566c-0.186,0.559-0.287,1.136-0.301,1.714\r\n\t\t\t\tc-0.023,1.037,0.234,1.892,0.763,2.541c0.602,0.744,1.438,1.07,2.55,0.999c0.281-0.021,0.578-0.108,0.879-0.261\r\n\t\t\t\tc0.311-0.157,0.585-0.346,0.813-0.559c0.648-0.591,1.073-1.316,1.265-2.162c0.193-0.849,0.145-1.693-0.143-2.509\r\n\t\t\t\tc-0.287-0.815-0.78-1.499-1.464-2.03c-0.509-0.39-0.778-0.527-0.916-0.572C167.566,112.648,167.412,112.625,167.239,112.625z\r\n\t\t\t\t M166.99,120.432L166.99,120.432c-0.85,0-1.52-0.295-1.992-0.875c-0.467-0.584-0.695-1.354-0.679-2.298\r\n\t\t\t\tc0.025-0.946,0.28-1.828,0.757-2.624c0.489-0.816,1.133-1.351,1.912-1.588l0.079-0.056l0.117-0.008\r\n\t\t\t\tc0.139,0,0.268,0.017,0.383,0.048l0.03,0.01c0.11,0.043,0.301,0.138,0.796,0.521c0.632,0.487,1.085,1.115,1.347,1.868\r\n\t\t\t\tc0.259,0.749,0.302,1.521,0.128,2.292c-0.176,0.778-0.566,1.446-1.159,1.987c-0.204,0.186-0.44,0.347-0.701,0.478\r\n\t\t\t\tc-0.278,0.139-0.527,0.217-0.761,0.235C167.155,120.43,167.072,120.432,166.99,120.432z M167.182,113.693\r\n\t\t\t\tc-0.621,0.19-1.121,0.612-1.526,1.289c-0.417,0.694-0.639,1.464-0.661,2.291c-0.015,0.778,0.163,1.404,0.527,1.857\r\n\t\t\t\tc0.342,0.421,0.823,0.626,1.468,0.626l0,0c0.067,0,0.137-0.002,0.208-0.007c0.138-0.012,0.311-0.067,0.507-0.165\r\n\t\t\t\tc0.207-0.104,0.392-0.23,0.549-0.374c0.496-0.451,0.808-0.987,0.955-1.638c0.147-0.646,0.11-1.293-0.107-1.922\r\n\t\t\t\tc-0.217-0.627-0.595-1.149-1.121-1.556c-0.402-0.31-0.558-0.395-0.609-0.418c-0.031-0.007-0.067-0.013-0.105-0.017\r\n\t\t\t\tC167.239,113.675,167.21,113.686,167.182,113.693z\"/>\r\n                    </g>\r\n                    <path fill=\"#FFFFFF\" d=\"M172.421,112.602c0.079,0.604,0.128,1.298,0.148,2.077c0.019,0.779,0.021,1.384,0.006,1.813\r\n\t\t\tc-0.017,0.429-0.044,1.108-0.083,2.037c-0.008,0.141-0.065,0.262-0.171,0.36c-0.107,0.098-0.231,0.143-0.372,0.136\r\n\t\t\tc-0.142-0.008-0.261-0.065-0.36-0.172c-0.099-0.106-0.144-0.23-0.135-0.371c0.038-0.913,0.066-1.586,0.082-2.019\r\n\t\t\tc0.016-0.435,0.014-1.019-0.005-1.753c-0.02-0.736-0.069-1.393-0.148-1.967c-0.016-0.142,0.02-0.269,0.106-0.384\r\n\t\t\tc0.087-0.114,0.201-0.181,0.342-0.2c0.142-0.02,0.27,0.014,0.383,0.1C172.329,112.346,172.397,112.461,172.421,112.602\r\n\t\t\t M172.338,119.898c0.103,0.102,0.154,0.224,0.154,0.366c0,0.141-0.051,0.263-0.154,0.365c-0.102,0.102-0.224,0.153-0.365,0.153\r\n\t\t\tc-0.142,0-0.264-0.052-0.366-0.153c-0.103-0.103-0.153-0.225-0.153-0.365c0-0.143,0.05-0.265,0.153-0.366\r\n\t\t\tc0.102-0.103,0.224-0.154,0.366-0.154C172.115,119.744,172.237,119.796,172.338,119.898\"/>\r\n                    <g>\r\n                        <path fill=\"#FFFFFF\" d=\"M171.973,121.12c-0.231,0-0.44-0.087-0.605-0.252c-0.165-0.165-0.252-0.373-0.252-0.604\r\n\t\t\t\tc0-0.231,0.087-0.44,0.253-0.606c0.165-0.165,0.373-0.252,0.604-0.252c0.23,0,0.439,0.087,0.605,0.252\r\n\t\t\t\tc0.164,0.166,0.252,0.375,0.252,0.606c0,0.229-0.088,0.438-0.252,0.604C172.413,121.033,172.203,121.12,171.973,121.12z\r\n\t\t\t\t M171.973,120.082c-0.052,0-0.088,0.015-0.127,0.054c-0.04,0.039-0.054,0.076-0.054,0.129s0.015,0.087,0.053,0.127\r\n\t\t\t\tc0.04,0.039,0.076,0.055,0.128,0.055c0.052,0,0.088-0.016,0.127-0.055c0.039-0.039,0.055-0.077,0.055-0.127\r\n\t\t\t\tc0-0.053-0.016-0.09-0.055-0.129C172.061,120.097,172.024,120.082,171.973,120.082z M171.981,119.362\r\n\t\t\t\tc-0.017,0-0.034-0.001-0.05-0.001c-0.228-0.013-0.432-0.108-0.589-0.279c-0.161-0.173-0.238-0.388-0.225-0.62\r\n\t\t\t\tc0.039-0.907,0.066-1.579,0.082-2.012c0.016-0.422,0.014-1.005-0.006-1.732c-0.019-0.72-0.067-1.368-0.144-1.93\r\n\t\t\t\tc-0.027-0.233,0.032-0.45,0.171-0.633c0.14-0.184,0.335-0.3,0.565-0.331c0.237-0.031,0.447,0.025,0.634,0.167\r\n\t\t\t\tc0.182,0.137,0.297,0.329,0.335,0.554c0.082,0.628,0.132,1.339,0.152,2.126c0.019,0.781,0.022,1.397,0.005,1.832\r\n\t\t\t\tc-0.016,0.43-0.043,1.11-0.082,2.039c-0.014,0.232-0.109,0.437-0.28,0.594C172.391,119.283,172.194,119.362,171.981,119.362z\r\n\t\t\t\t M171.908,112.49c-0.009,0-0.02,0.001-0.03,0.002c-0.053,0.009-0.087,0.028-0.12,0.07c-0.035,0.046-0.046,0.087-0.04,0.143\r\n\t\t\t\tc0.08,0.577,0.13,1.251,0.149,1.995c0.02,0.741,0.022,1.339,0.006,1.774c-0.016,0.434-0.044,1.107-0.083,2.021\r\n\t\t\t\tc-0.002,0.054,0.01,0.089,0.046,0.127c0.039,0.043,0.078,0.062,0.131,0.063l0.014,0.002c0.031,0,0.066-0.007,0.11-0.048\r\n\t\t\t\tc0.043-0.039,0.061-0.077,0.064-0.132c0.039-0.923,0.066-1.601,0.082-2.029c0.016-0.42,0.014-1.024-0.005-1.792\r\n\t\t\t\tc-0.02-0.763-0.068-1.45-0.145-2.042c-0.008-0.045-0.03-0.083-0.077-0.117C171.977,112.502,171.947,112.49,171.908,112.49z\"/>\r\n                    </g>\r\n                </g>\r\n            </g>\r\n        </svg>\r\n\r\n\r\n        <svg class='endScreen' style=\"display:none;\">\r\n            <g id=\"Layer_2\">\r\n            </g>\r\n            <g id=\"Layer_1\">\r\n                <path fill=\"#9DC44D\" d=\"M190.001,97.03c0,13.93-11.292,25.222-25.222,25.222s-25.222-11.292-25.222-25.222\r\n\t\tc0-13.929,11.292-25.222,25.222-25.222S190.001,83.101,190.001,97.03\"/>\r\n                <path fill=\"#303D8A\" d=\"M158.854,83.181l-5.227,2.95c-1.371,0.813-1.649,2.648,1.278,3.972c2.927,1.324,6.597,0.976,6.597,0.976\r\n\t\tl1.045-8.061L158.854,83.181z\"/>\r\n                <path fill=\"#74A636\" d=\"M190.001,97.03c0-0.243-0.012-0.483-0.019-0.724L168.87,74.022v0.263l0.524,47.538\r\n\t\tC181.119,119.654,190.001,109.383,190.001,97.03z\"/>\r\n                <path fill=\"#F3D332\" d=\"M182.57,105.68c-1.62-1.839-6.855-1.432-7.303-2.942l-5.486-23.945c-0.816-3.841-8.27-3.841-9.167,0\r\n\t\tl-5.487,23.945c-0.322,0.992-1.247,1.664-2.29,1.664l-3.72-0.375c-2.333,0-4.378,5.418-2.491,6.789l-0.004,3.711\r\n\t\tc4.588,4.759,11.024,7.725,18.156,7.725c8.926,0,16.763-4.641,21.246-11.638L182.57,105.68z\"/>\r\n                <path fill=\"#457AB9\" d=\"M164.779,122.252c0.311,0,0.62-0.012,0.928-0.023l-0.51-12.167l-11.198-0.096\r\n\t\tc-0.589-0.005-1.039,0.516-0.96,1.1c0.308,2.283,0.249,5.621,0.117,8.347C156.635,121.223,160.586,122.252,164.779,122.252z\"/>\r\n                <path fill=\"#457AB9\" d=\"M164.779,122.252c4.525,0,8.768-1.198,12.44-3.284c-0.116-2.638-0.154-5.743,0.137-7.903\r\n\t\tc0.079-0.584-0.371-1.104-0.96-1.1l-11.199,0.096l-0.511,12.188C164.717,122.25,164.748,122.252,164.779,122.252z\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M159.028,88.22h-1.169c-0.612,0-1.109-0.497-1.109-1.109s0.497-1.109,1.109-1.109h1.169\"/>\r\n                <path fill=\"#CDB42C\" d=\"M157.732,87.431c0-0.396,0.45-0.716,1.004-0.716c0.377,0,0.705,0.148,0.876,0.367\r\n\t\tc-0.021-0.448-0.536-0.807-1.169-0.807c-0.647,0-1.171,0.374-1.171,0.835c0,0.332,0.272,0.618,0.665,0.752\r\n\t\tC157.809,87.743,157.732,87.594,157.732,87.431\"/>\r\n                <path fill=\"#F3D332\"\r\n                      d=\"M171.353,88.22h1.169c0.613,0,1.109-0.497,1.109-1.109s-0.497-1.109-1.109-1.109h-1.169\"/>\r\n                <path fill=\"#CDB42C\" d=\"M172.648,87.431c0-0.396-0.449-0.716-1.003-0.716c-0.377,0-0.705,0.148-0.877,0.367\r\n\t\tc0.021-0.448,0.536-0.807,1.169-0.807c0.647,0,1.171,0.374,1.171,0.835c0,0.332-0.272,0.618-0.665,0.752\r\n\t\tC172.571,87.743,172.648,87.594,172.648,87.431\"/>\r\n                <path fill=\"#F3D332\" d=\"M153.871,115.774c-0.013-1.562-0.089-2.859-0.226-3.856c-0.008-0.056-0.011-0.111-0.011-0.166\r\n\t\tc0-0.591,0.438-1.096,1.021-1.175l0.067,0.495c-0.336,0.045-0.589,0.338-0.589,0.679c0,0.033,0.002,0.066,0.007,0.099\r\n\t\tc0.14,1.018,0.217,2.337,0.23,3.92L153.871,115.774z\"/>\r\n                <path fill=\"#F3D332\" d=\"M175.987,111.192c-0.115-0.083-0.251-0.126-0.395-0.126c0,0-0.001,0-0.002,0h-4.791v-0.5h4.791\r\n\t\tc0.236,0.026,0.487,0.075,0.689,0.221L175.987,111.192z\"/>\r\n                <rect x=\"160.06\" y=\"110.566\" fill=\"#F3D332\" width=\"5.37\" height=\"0.5\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M165.425,89.905c0.179,1.559-0.964,2.891-2.554,2.973c-1.589,0.083-3.022-1.113-3.201-2.673\r\n\t\tc-0.179-1.559,0.964-2.891,2.554-2.973C163.813,87.149,165.246,88.346,165.425,89.905\"/>\r\n                <path fill=\"#232951\" d=\"M160.246,87.256c0,0,0.035-0.063,0.107-0.173c0.036-0.056,0.084-0.12,0.141-0.191\r\n\t\tc0.06-0.07,0.128-0.149,0.21-0.229c0.165-0.158,0.38-0.33,0.648-0.455c0.264-0.132,0.581-0.213,0.898-0.234\r\n\t\tc0.067-0.009,0.163-0.006,0.243-0.009c0.081,0.002,0.161,0.002,0.241,0.01c0.16,0.01,0.316,0.04,0.461,0.088\r\n\t\tc0.289,0.099,0.525,0.264,0.699,0.426c0.087,0.081,0.159,0.164,0.219,0.239c0.059,0.076,0.104,0.146,0.139,0.206\r\n\t\tc0.035,0.059,0.057,0.11,0.072,0.144c0.015,0.034,0.022,0.053,0.022,0.053l-0.042,0.04c0,0-0.075-0.03-0.193-0.085\r\n\t\tc-0.12-0.054-0.282-0.133-0.474-0.213c-0.095-0.042-0.197-0.082-0.304-0.125c-0.108-0.038-0.218-0.083-0.334-0.12\r\n\t\tc-0.114-0.043-0.233-0.087-0.357-0.123c-0.062-0.02-0.125-0.033-0.19-0.047c-0.065-0.01-0.117-0.021-0.195-0.024\r\n\t\tc-0.269-0.019-0.536,0.017-0.782,0.089c-0.124,0.035-0.238,0.083-0.347,0.134c-0.109,0.049-0.206,0.109-0.295,0.166\r\n\t\tc-0.088,0.059-0.166,0.118-0.234,0.174c-0.065,0.057-0.123,0.108-0.167,0.151c-0.092,0.087-0.141,0.144-0.141,0.144L160.246,87.256\r\n\t\tz\"/>\r\n                <path fill=\"#232951\" d=\"M170.104,87.291c0,0-0.05-0.056-0.141-0.144c-0.045-0.043-0.103-0.094-0.168-0.151\r\n\t\tc-0.067-0.056-0.145-0.115-0.233-0.174c-0.089-0.057-0.187-0.117-0.295-0.166c-0.108-0.05-0.224-0.099-0.347-0.134\r\n\t\tc-0.246-0.072-0.513-0.107-0.782-0.088c-0.079,0.003-0.13,0.014-0.195,0.024c-0.065,0.014-0.129,0.027-0.191,0.047\r\n\t\tc-0.125,0.037-0.243,0.08-0.357,0.123c-0.116,0.038-0.226,0.083-0.334,0.12c-0.106,0.042-0.209,0.083-0.304,0.125\r\n\t\tc-0.191,0.08-0.354,0.159-0.474,0.213c-0.118,0.055-0.193,0.085-0.193,0.085l-0.041-0.04c0,0,0.008-0.019,0.022-0.053\r\n\t\tc0.015-0.034,0.037-0.084,0.072-0.144c0.034-0.06,0.08-0.13,0.139-0.206c0.06-0.075,0.131-0.158,0.218-0.239\r\n\t\tc0.173-0.163,0.41-0.327,0.699-0.426c0.145-0.048,0.301-0.078,0.461-0.088c0.08-0.007,0.161-0.007,0.241-0.009\r\n\t\tc0.081,0.003,0.175,0,0.243,0.009c0.317,0.021,0.634,0.102,0.897,0.234c0.268,0.125,0.483,0.296,0.648,0.455\r\n\t\tc0.083,0.08,0.151,0.158,0.21,0.229c0.057,0.072,0.105,0.136,0.141,0.191c0.073,0.109,0.108,0.173,0.108,0.173L170.104,87.291z\"/>\r\n                <path fill=\"#FFFFFF\" d=\"M164.97,89.905c-0.179,1.559,0.965,2.891,2.554,2.973c1.589,0.083,3.023-1.113,3.202-2.673\r\n\t\tc0.179-1.559-0.965-2.891-2.554-2.973C166.582,87.149,165.149,88.346,164.97,89.905\"/>\r\n                <path fill=\"#232951\" d=\"M164.479,89.83c0,0.779-0.631,1.41-1.41,1.41c-0.779,0-1.41-0.631-1.41-1.41c0-0.778,0.631-1.41,1.41-1.41\r\n\t\tC163.848,88.42,164.479,89.051,164.479,89.83\"/>\r\n                <path fill=\"#232951\" d=\"M168.814,89.83c0,0.779-0.631,1.41-1.41,1.41s-1.41-0.631-1.41-1.41c0-0.778,0.631-1.41,1.41-1.41\r\n\t\tS168.814,89.051,168.814,89.83\"/>\r\n                <path fill=\"#FFFFFF\"\r\n                      d=\"M169.308,96.033c-4.194,5.393-8.353,0.141-8.353,0.141C162.362,96.508,167.347,96.835,169.308,96.033\"/>\r\n                <path fill=\"#D27C1D\" d=\"M170.614,95.597l-0.753,0.879l-0.202,0.236l-0.23,0.254c-0.154,0.161-0.311,0.32-0.477,0.472\r\n\t\tc-0.167,0.151-0.337,0.299-0.52,0.437c-0.179,0.14-0.37,0.269-0.565,0.391c-0.394,0.241-0.823,0.439-1.277,0.572\r\n\t\tc-0.454,0.13-0.932,0.194-1.403,0.177c-0.472-0.017-0.934-0.108-1.367-0.257c-0.434-0.147-0.84-0.35-1.216-0.585\r\n\t\tc-0.377-0.236-0.726-0.504-1.049-0.796c-0.162-0.146-0.318-0.298-0.468-0.457c-0.151-0.161-0.289-0.315-0.436-0.505l-0.721-0.933\r\n\t\tl1.115,0.315c0.309,0.087,0.651,0.152,0.99,0.21c0.34,0.057,0.685,0.106,1.03,0.148c0.69,0.084,1.386,0.146,2.083,0.183\r\n\t\tc0.697,0.036,1.396,0.049,2.094,0.018c0.349-0.017,0.697-0.043,1.043-0.091c0.173-0.024,0.346-0.052,0.516-0.091\r\n\t\tc0.172-0.035,0.34-0.084,0.506-0.14L170.614,95.597z M168.092,96.397c-0.276,0.058-0.553,0.112-0.833,0.151\r\n\t\tc-0.701,0.097-1.407,0.149-2.114,0.177c-0.708,0.029-1.416,0.03-2.125,0.009c-0.355-0.011-0.71-0.028-1.067-0.055\r\n\t\tc-0.358-0.028-0.711-0.06-1.088-0.129l0.394-0.618c0.116,0.13,0.262,0.277,0.403,0.408c0.144,0.133,0.292,0.261,0.446,0.382\r\n\t\tc0.307,0.243,0.631,0.459,0.968,0.641c0.337,0.181,0.688,0.327,1.044,0.422c0.356,0.096,0.718,0.142,1.073,0.131\r\n\t\tc0.712-0.021,1.392-0.28,1.987-0.705c0.149-0.107,0.294-0.219,0.434-0.343c0.141-0.121,0.274-0.254,0.405-0.389\r\n\t\tC168.044,96.454,168.067,96.424,168.092,96.397\"/>\r\n                <path fill=\"#274571\" d=\"M150.944,104.632c0.25-0.75,1.75-0.713,2.168-0.165c0.59,0.774,3.167,5.524,3.657,7.845\r\n\t\tc0.379,1.8-1.895,2.007-2.146,0.146C154.403,110.834,151.917,105.809,150.944,104.632\"/>\r\n                <path fill=\"#457AB9\" d=\"M150.546,104.435c0.238-0.753,1.997-0.751,2.424-0.209c0.602,0.765,3.252,5.474,3.777,7.788\r\n\t\tc0.407,1.794-1.683,1.999-2.144,0.179C154.202,110.608,151.538,105.597,150.546,104.435\"/>\r\n                <path fill=\"#F3D332\" d=\"M156.595,112.285c0,0.441-0.357,0.798-0.798,0.798c-0.44,0-0.798-0.357-0.798-0.798\r\n\t\tc0-0.44,0.357-0.798,0.798-0.798C156.237,111.487,156.595,111.845,156.595,112.285\"/>\r\n                <path fill=\"#274571\" d=\"M179.45,104.632c-0.25-0.75-1.75-0.713-2.167-0.165c-0.59,0.774-3.167,5.524-3.657,7.845\r\n\t\tc-0.379,1.8,1.895,2.007,2.146,0.146C175.992,110.834,178.478,105.809,179.45,104.632\"/>\r\n                <path fill=\"#457AB9\" d=\"M179.848,104.435c-0.238-0.753-1.997-0.751-2.423-0.209c-0.602,0.765-3.252,5.474-3.777,7.788\r\n\t\tc-0.407,1.794,1.683,1.999,2.144,0.179C176.193,110.608,178.857,105.597,179.848,104.435\"/>\r\n                <path fill=\"#F3D332\" d=\"M173.8,112.285c0,0.441,0.357,0.798,0.798,0.798s0.798-0.357,0.798-0.798c0-0.44-0.357-0.798-0.798-0.798\r\n\t\tS173.8,111.845,173.8,112.285\"/>\r\n                <path fill=\"#457AB9\" d=\"M166.654,73.645h-3.01c-2.873,0-5.202,2.329-5.202,5.202v4.355c0,0.252,0.205,0.458,0.458,0.458h12.499\r\n\t\tc0.253,0,0.458-0.205,0.458-0.458v-4.355C171.856,75.974,169.527,73.645,166.654,73.645\"/>\r\n                <path fill=\"#232951\" d=\"M151.262,117.021c0.895,2.296,0.772,4.488-0.273,4.896c-1.046,0.408-2.619-1.123-3.514-3.419\r\n\t\ts-0.773-4.488,0.273-4.896S150.367,114.726,151.262,117.021\"/>\r\n                <path fill=\"#F3D332\" d=\"M164.27,121.759c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS164.27,119.77,164.27,121.759\"/>\r\n                <svg class=\"button playAgain\">\r\n                    <path fill=\"white\" class='background' d=\"M160.788,186.008c1.998,0,2.738,0.238,3.337,0.653c0.17,0.118,0.657,0.572,1.631,1.48\r\n\t\tc1,0.932,1.192,1.139,1.631,1.279c0.08,0.026,1.156,0.353,2.007-0.226c0.328-0.222,0.777-0.685,1.004-2.208\r\n\t\tc0.384-2.579-0.396-4.687-0.552-5.094c-0.222-0.578-1.723-4.495-3.689-4.441c-0.483,0.013-1.134,0.27-1.606,0.552\r\n\t\tc-0.61,0.366-0.779,0.691-1.204,1.029c-0.457,0.363-1.437,0.753-2.56,0.753s-2.104-0.39-2.56-0.753\r\n\t\tc-0.425-0.337-0.594-0.663-1.205-1.029c-0.471-0.282-1.123-0.539-1.605-0.552c-1.967-0.054-3.468,3.863-3.689,4.441\r\n\t\tc-0.156,0.407-0.936,2.515-0.552,5.094c0.226,1.523,0.676,1.986,1.003,2.208c0.852,0.579,1.928,0.251,2.007,0.226\r\n\t\tc0.439-0.14,0.632-0.347,1.631-1.279c0.974-0.909,1.46-1.363,1.631-1.48C158.05,186.246,158.79,186.008,160.788,186.008\"/>\r\n                    <g>\r\n                        <path fill=\"#1D2A48\" d=\"M154.183,185.667c-0.283,0-0.513-0.229-0.513-0.513v-3.062c0-0.283,0.229-0.513,0.513-0.513\r\n\t\t\ts0.513,0.229,0.513,0.513v3.062C154.696,185.437,154.466,185.667,154.183,185.667z\"/>\r\n                    </g>\r\n                    <g>\r\n                        <path fill=\"#1D2A48\" d=\"M155.714,184.136h-3.062c-0.283,0-0.513-0.229-0.513-0.513s0.229-0.513,0.513-0.513h3.062\r\n\t\t\tc0.283,0,0.513,0.229,0.513,0.513S155.997,184.136,155.714,184.136z\"/>\r\n                    </g>\r\n                    <g>\r\n                        <path fill=\"#1D2A48\" d=\"M162.153,184.122h-2.9c-0.275,0-0.499-0.224-0.499-0.499c0-0.276,0.224-0.499,0.499-0.499h2.9\r\n\t\t\tc0.276,0,0.499,0.223,0.499,0.499C162.652,183.898,162.429,184.122,162.153,184.122z\"/>\r\n                    </g>\r\n                    <path fill=\"#1D2A48\" d=\"M168.549,182.595c0,0.356-0.289,0.645-0.645,0.645s-0.645-0.289-0.645-0.645s0.289-0.645,0.645-0.645\r\n\t\tS168.549,182.239,168.549,182.595\"/>\r\n                    <path fill=\"#1D2A48\" d=\"M166.924,182.595c0,0.356-0.289,0.645-0.645,0.645s-0.645-0.289-0.645-0.645s0.289-0.645,0.645-0.645\r\n\t\tS166.924,182.239,166.924,182.595\"/>\r\n                    <path fill=\"#1D2A48\" d=\"M169.029,184.651c0,0.356-0.289,0.645-0.645,0.645c-0.356,0-0.645-0.289-0.645-0.645\r\n\t\ts0.288-0.645,0.645-0.645C168.741,184.006,169.029,184.295,169.029,184.651\"/>\r\n                    <path fill=\"#1D2A48\" d=\"M167.404,184.651c0,0.356-0.289,0.645-0.645,0.645s-0.645-0.289-0.645-0.645s0.289-0.645,0.645-0.645\r\n\t\tS167.404,184.295,167.404,184.651\"/>\r\n                </svg>\r\n                <path fill=\"#F3D332\" d=\"M176.031,116.223v0.07c0,1.003,0.026,2.104,0.073,3.272c0.164-0.083,0.329-0.165,0.491-0.251\r\n\t\tc-0.041-1.075-0.064-2.091-0.064-3.021v-0.07H176.031z\"/>\r\n                <path fill=\"#F3D332\" d=\"M148.945,104.097c-2.147,0.237-4.76,2.275-6.078,5.418c2.007,3.516,4.834,6.5,8.223,8.695\r\n\t\tc0.126-1.582,0.101-3.268-0.069-4.802C150.439,108.139,151.962,103.763,148.945,104.097z\"/>\r\n                <path fill=\"#232951\" d=\"M158.573,113.25l-0.146,0.034c-2.028,0.47-3.611-0.895-4.081-2.923l-3.173-11.69\r\n\t\tc-0.47-2.028,0.793-4.052,2.82-4.521l0.146-0.034c2.027-0.47,4.052,0.793,4.521,2.821l2.23,11.909\r\n\t\tC161.361,110.872,160.601,112.78,158.573,113.25\"/>\r\n                <path fill=\"#F3D332\" d=\"M158.317,112.478L158.317,112.478c-1.824,0.422-3.646-0.713-4.068-2.538l-2.538-10.952\r\n\t\tc-0.422-1.824,0.713-3.646,2.538-4.068c1.824-0.423,3.646,0.713,4.068,2.538l2.537,10.951\r\n\t\tC161.278,110.233,160.142,112.055,158.317,112.478\"/>\r\n                <path fill=\"#232951\" d=\"M156.051,106.463c3.809,0,3.514,2.193,3.708,5.933l0.71,6.255c0.197,3.764,2.434,6.789-1.002,7.585\r\n\t\tl-2.189,0.507c-3.437,0.796-6.086-2.567-7.664-5.986l-2.543-6.227c-1.234-3.303,1.627-8.015,5.155-8.058L156.051,106.463z\"/>\r\n                <path fill=\"#232951\" d=\"M150.961,117.021c0.895,2.296,0.772,4.488-0.273,4.896c-1.046,0.408-2.619-1.123-3.514-3.419\r\n\t\ts-0.773-4.488,0.273-4.896S150.066,114.726,150.961,117.021\"/>\r\n                <path fill=\"#F3D332\" d=\"M151.627,116.861c0.895,2.296,0.772,4.487-0.273,4.895c-1.046,0.408-2.619-1.123-3.514-3.419\r\n\t\ts-0.773-4.487,0.273-4.895S150.732,114.565,151.627,116.861\"/>\r\n                <path fill=\"#232951\" d=\"M163.965,110.376c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS163.965,108.386,163.965,110.376\"/>\r\n                <path fill=\"#F3D332\" d=\"M160.07,126.236l-2.189,0.507c-3.437,0.796-6.086-2.567-7.664-5.986l-2.542-6.227\r\n\t\tc-1.234-3.303,1.894-7.578,4.781-7.664l4.003-0.394c2.888-0.01,5.072,0.82,6.319,2.139c0.689,0.729-1.893,3.551-1.833,4.693\r\n\t\tl-0.172,5.346c0.08,1.53,3.562,2.694,3.287,3.967C163.664,124.441,162.109,125.764,160.07,126.236\"/>\r\n                <path fill=\"#F3D332\" d=\"M163.664,110.979c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS163.664,108.989,163.664,110.979\"/>\r\n                <path fill=\"#F3D332\" d=\"M165.133,116.908c0,1.99-1.613,3.603-3.603,3.603s-3.603-1.613-3.603-3.603s1.613-3.603,3.603-3.603\r\n\t\tS165.133,114.918,165.133,116.908\"/>\r\n            </g>\r\n        </svg>\r\n    </svg>"

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(39);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(41)(content, options);
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
/* 34 */
/***/ (function(module, exports) {

module.exports = [[{"id":"boite_8_","rect":{"x":"6.95","y":"16.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.123","height":"0.874"}},{"id":"boite_1_","rect":{"x":"3.1","y":"4.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.191","height":"0.875"}},{"id":"boite_2_","rect":{"x":"11","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10.011","height":"0.875"}},{"id":"boite_12_","rect":{"x":"28.95","y":"8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1.001","height":"9.006"}},{"id":"boite_4_","rect":{"x":"2","y":"7","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1.001","height":"11.025"}},{"id":"boite_3_","rect":{"x":"21.45","y":"3.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.19","height":"0.874"}},{"id":"boite_6_","rect":{"x":"7","y":"8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.123","height":"0.874"}},{"id":"boite_7_","rect":{"x":"14.2","y":"9.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1.003","height":"7.022"}},{"id":"boite_5_","rect":{"x":"5.85","y":"9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"0.999","height":"6.994"}},{"id":"boite_11_","rect":{"x":"19.9","y":"14.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.04","height":"1.187"}},{"id":"boite_9_","rect":{"x":"18.9","y":"9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.935"}},{"id":"boite_10_","rect":{"x":"19.9","y":"8.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.048","height":"0.999"}},{"id":"boite","rect":{"x":"24.95","y":"8.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"0.998","height":"4.946"}},{"id":"badGuy","rect":{"x":"30","y":"18","width":"1","height":"1"}}],[{"id":"Layer_18","rect":{"x":"30.95","y":"2.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"11.05"}},{"id":"Layer_17","rect":{"x":"22.1","y":"10.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"Layer_16","rect":{"x":"20.95","y":"2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"Layer_15","rect":{"x":"21.85","y":"18.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.851"}},{"id":"Layer_14","rect":{"x":"12.1","y":"6.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7","height":"1"}},{"id":"Layer_13","rect":{"x":"11.9","y":"2.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"Layer_12","rect":{"x":"1.85","y":"2.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"Layer_11","rect":{"x":"0.95","y":"6.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"Layer_10","rect":{"x":"11.85","y":"13.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.851"}},{"id":"Layer_9","rect":{"x":"10.9","y":"7.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"Layer_8","rect":{"x":"19.05","y":"7.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"Layer_7","rect":{"x":"2.95","y":"9.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"Layer_6","rect":{"x":"1.05","y":"17.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"Layer_5","rect":{"x":"12.95","y":"17.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.199"}},{"id":"badGuy","rect":{"x":"27","y":"15","fill-rule":"evenodd","clip-rule":"evenodd","width":"1.05","height":"1"}}],[{"id":"boite","rect":{"x":"21.05","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_1_","rect":{"x":"22.25","y":"11.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"10.65","height":"1.2"}},{"id":"boite_2_","rect":{"x":"24.25","y":"13.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.7","height":"1.2"}},{"id":"boite_3_","rect":{"x":"23.2","y":"14.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_4_","rect":{"x":"24.2","y":"17.45","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.899","height":"1"}},{"id":"boite_5_","rect":{"x":"29.95","y":"14.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_6_","rect":{"x":"21.05","y":"1.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_7_","rect":{"x":"22.05","y":"9","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.7","height":"1.2"}},{"id":"boite_8_","rect":{"x":"25","y":"3","width":"5.7","height":"1.2"}},{"id":"boite_9_","rect":{"x":"23.95","y":"3.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_10_","rect":{"x":"24.95","y":"7.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.899","height":"1"}},{"id":"boite_11_","rect":{"x":"30.9","y":"4.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_12_","rect":{"x":"22.25","y":"0.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.7","height":"1.2"}},{"id":"boite_13_","rect":{"x":"9.1","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_14_","rect":{"x":"2","y":"11","-fill":"#FF0000","width":"6.8","height":"1.2"}},{"id":"boite_15_","rect":{"x":"4","y":"13","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"3.05","height":"1.2"}},{"id":"boite_16_","rect":{"x":"3.1","y":"14.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"3.8"}},{"id":"boite_17_","rect":{"x":"4.25","y":"18.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.65","height":"1"}},{"id":"boite_18_","rect":{"x":"7","y":"14.3","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.8"}},{"id":"boite_19_","rect":{"x":"1.15","y":"1.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_20_","rect":{"x":"-0.35","y":"9.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"10.2","height":"1.2"}},{"id":"boite_21_","rect":{"x":"4.1","y":"2.9","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.7","height":"1.2"}},{"id":"boite_22_","rect":{"x":"3.05","y":"4","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_23_","rect":{"x":"4.05","y":"7.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.9","height":"1"}},{"id":"boite_24_","rect":{"x":"9.8","y":"3.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_25_","rect":{"x":"2.35","y":"0.8","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"16.55","height":"1.2"}},{"id":"boite_26_","rect":{"x":"1.1","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_27_","rect":{"x":"19.05","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"8.05"}},{"id":"boite_28_","rect":{"x":"12.05","y":"10.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"6.8","height":"1.2"}},{"id":"boite_29_","rect":{"x":"14.5","y":"13.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.55","height":"1.2"}},{"id":"boite_30_","rect":{"x":"13.45","y":"14.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_31_","rect":{"x":"14.45","y":"17.45","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.649","height":"1"}},{"id":"boite_32_","rect":{"x":"17.15","y":"14.3","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"3.3"}},{"id":"boite_33_","rect":{"x":"11.25","y":"12.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_34_","rect":{"x":"19.1","y":"0.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"10.1"}},{"id":"boite_35_","rect":{"x":"17.15","y":"3.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_36_","rect":{"x":"13.95","y":"3.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"badGuy","rect":{"x":"3","y":"12","width":"1","height":"1"}},{"id":"badGuy","rect":{"x":"23","y":"3","width":"1","height":"1"}},{"id":"badGuy","rect":{"x":"22","y":"12","width":"1","height":"1"}}],[{"rect":{"x":"26.85","y":"17.05","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"1.05","height":"1.05"},"id":"badGuy"},{"rect":{"x":"4.1","y":"17.05","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"1.05","height":"1.05"},"id":"badGuy"},{"rect":{"x":"13","y":"8.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"0.996","height":"3.23"},"id":"boite"},{"rect":{"x":"13.95","y":"7.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1.991","height":"1.17"},"id":"boite_7_"},{"rect":{"x":"15.85","y":"8.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"0.996","height":"2.173"},"id":"boite_8_"},{"rect":{"x":"14.2","y":"11.95","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"5","height":"1"},"id":"boite_10_"},{"rect":{"x":"26.85","y":"2","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"1.05","height":"1.05"},"id":"badGuy_2_"},{"rect":{"x":"19","y":"7.05","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"0.995","height":"4.845"},"id":"boite_6_"}],[{"id":"boite","rect":{"x":"8.75","y":"17.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"14.5","height":"0.851"}},{"id":"boite_1_","rect":{"x":"21.25","y":"5.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_2_","rect":{"x":"12","y":"4.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.45","height":"0.85"}},{"id":"boite_3_","rect":{"x":"11.1","y":"6.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_4_","rect":{"x":"12","y":"14.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9.45","height":"0.85"}},{"id":"boite_5_","rect":{"x":"10","y":"2.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"13.05","height":"0.85"}},{"id":"boite_6_","rect":{"x":"8.95","y":"2.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"13.149"}},{"id":"boite_7_","rect":{"x":"23","y":"4.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"13.15"}},{"id":"boite_8_","rect":{"x":"7","y":"2.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"17.15"}},{"id":"boite_9_","rect":{"x":"8.15","y":"19","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"15.85","height":"1.1"}},{"id":"boite_10_","rect":{"x":"25.05","y":"1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"17.15"}},{"id":"boite_11_","rect":{"x":"9.15","y":"0.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"15.85","height":"0.85"}},{"id":"boite_12_","rect":{"x":"14.35","y":"6","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.1","height":"1.2"}},{"id":"boite_13_","rect":{"x":"13","y":"7.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.85"}},{"id":"badGuy","rect":{"x":"29.1","y":"14","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.9","height":"1"}},{"id":"boite_14_","rect":{"x":"19.1","y":"8.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.7"}},{"id":"boite_15_","rect":{"x":"14.2","y":"12.85","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.1","height":"1.2"}},{"id":"badGuy_1_","rect":{"x":"2","y":"13.1","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.9","height":"1"}}],[{"id":"boite","rect":{"x":"12.15","y":"3.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"5","y":"11.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.1","height":"0.85"}},{"id":"boite_2_","rect":{"x":"9.9","y":"11.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.3","height":"0.851"}},{"id":"boite_3_","rect":{"x":"22.05","y":"10.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.95","height":"0.85"}},{"id":"boite_4_","rect":{"x":"5","y":"17","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"4.9","height":"0.85"}},{"id":"boite_5_","rect":{"x":"12","y":"14.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_6_","rect":{"x":"17.95","y":"8.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.85"}},{"id":"boite_7_","rect":{"x":"12","y":"13.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"0.85"}},{"id":"boite_8_","rect":{"x":"12","y":"16","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_9_","rect":{"x":"12","y":"11.85","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.851"}},{"id":"boite_10_","rect":{"x":"11.05","y":"6","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"1.9"}},{"id":"boite_11_","rect":{"x":"11.05","y":"5.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_12_","rect":{"x":"11.05","y":"4.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_13_","rect":{"x":"19.05","y":"4.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_14_","rect":{"x":"19.05","y":"5.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_15_","rect":{"x":"19.05","y":"6.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_16_","rect":{"x":"24.9","y":"10.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.3","height":"0.85"}},{"id":"boite_17_","rect":{"x":"26.25","y":"17","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_18_","rect":{"x":"25.05","y":"17.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.851"}},{"id":"boite_19_","rect":{"x":"22.2","y":"17.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.899","height":"0.851"}},{"id":"boite_20_","rect":{"x":"10","y":"17","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"2.1","height":"0.85"}},{"id":"boite_21_","rect":{"x":"12","y":"12.9","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_22_","rect":{"x":"11.9","y":"8.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"3.3","height":"0.85"}},{"id":"boite_23_","rect":{"x":"14.9","y":"8.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"3.3","height":"0.85"}},{"id":"boite_24_","rect":{"x":"20.85","y":"15.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"boite_25_","rect":{"x":"20.95","y":"14.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.25","height":"0.85"}},{"id":"boite_26_","rect":{"x":"20.9","y":"16.25","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.85"}},{"id":"boite_27_","rect":{"x":"20.85","y":"12.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.851"}},{"id":"boite_28_","rect":{"x":"20.9","y":"13.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.85"}},{"id":"boite_29_","rect":{"x":"20.9","y":"11.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.149","height":"0.851"}},{"id":"boite_30_","rect":{"x":"19.05","y":"7.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1.15","height":"0.85"}},{"id":"badGuy","rect":{"x":"29.95","y":"17.95","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.899","height":"0.899"}},{"id":"boite_31_","rect":{"x":"27.1","y":"11.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_32_","rect":{"x":"3.9","y":"12","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}},{"id":"badGuy_1_","rect":{"x":"3","y":"18.25","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.9","height":"0.9"}}],[{"rect":{"x":"4.4","y":"11.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"7.1","height":"0.851"},"id":"boite"},{"rect":{"x":"20.85","y":"12.8","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"8.2","height":"0.851"},"id":"boite_1_"},{"rect":{"x":"4.15","y":"3","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"9","height":"0.85"},"id":"boite_2_"},{"rect":{"x":"4.2","y":"16.05","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"24.649","height":"0.851"},"id":"boite_3_"},{"rect":{"x":"20","y":"5.75","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"7"},"id":"boite_4_"},{"rect":{"x":"3.2","y":"4","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"7.95"},"id":"boite_5_"},{"rect":{"x":"29.05","y":"3.8","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"9"},"id":"boite_6_"},{"rect":{"x":"13.2","y":"3.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"10"},"id":"boite_7_"},{"rect":{"x":"17.95","y":"3.75","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"11.05"},"id":"boite_8_"},{"rect":{"x":"18.9","y":"2.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"10","height":"0.85"},"id":"boite_9_"},{"rect":{"x":"12.25","y":"17.85","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"9","height":"0.851"},"id":"boite_10_"},{"rect":{"x":"20.05","y":"17","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"7.101","height":"0.85"},"id":"boite_11_"},{"rect":{"x":"1.1","y":"1.05","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"8.2","height":"0.85"},"id":"boite_12_"},{"rect":{"x":"23.65","y":"1.1","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"8.199","height":"0.85"},"id":"boite_13_"},{"rect":{"x":"24","y":"8","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"0.9","height":"0.9"},"id":"badGuy"},{"rect":{"x":"11.45","y":"5.9","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"5.95"},"id":"boite_14_"},{"rect":{"x":"5.45","y":"5.95","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"4.95"},"id":"boite_15_"},{"rect":{"x":"27.1","y":"6","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"1","height":"4.95"},"id":"boite_16_"},{"rect":{"x":"6.4","y":"4.65","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"5.05","height":"1.2"},"id":"boite_17_"},{"rect":{"x":"7.35","y":"16.8","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"6","height":"1.15"},"id":"boite_18_"},{"rect":{"x":"21.15","y":"4.6","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"6","height":"1.2"},"id":"boite_19_"},{"rect":{"x":"8","y":"8.1","_fill-rule":"evenodd","_clip-rule":"evenodd","width":"0.9","height":"0.9"},"id":"badGuy_1_"},{"rect":{"x":"14.4","y":"18.65","_fill-rule":"evenodd","_clip-rule":"evenodd","_fill":"#FF0000","width":"5.05","height":"1.199"},"id":"boite_20_"}],[{"id":"boite","rect":{"x":"23.9","y":"9.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"2","y":"18.35","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9","height":"0.851"}},{"id":"boite_2_","rect":{"x":"1.15","y":"1.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_3_","rect":{"x":"0.9","y":"10.7","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7.95"}},{"id":"boite_4_","rect":{"x":"31","y":"2.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_5_","rect":{"x":"14.05","y":"1.1","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_6_","rect":{"x":"2.1","y":"1.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_7_","rect":{"x":"13.95","y":"18.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.851"}},{"id":"boite_8_","rect":{"x":"21.05","y":"9.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_9_","rect":{"x":"23.95","y":"1.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_10_","rect":{"x":"13","y":"1.85","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_11_","rect":{"x":"2.1","y":"10.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_12_","rect":{"x":"30.85","y":"10.05","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"7.95"}},{"id":"badGuy","rect":{"x":"27.15","y":"5.05","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.949","height":"0.95"}},{"id":"boite_13_","rect":{"x":"25.95","y":"17.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_14_","rect":{"x":"14.1","y":"8.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_15_","rect":{"x":"10.9","y":"2.15","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_16_","rect":{"x":"23","y":"2.2","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}},{"id":"badGuy_1_","rect":{"x":"5.6","y":"14.35","-fill-rule":"evenodd","-clip-rule":"evenodd","width":"0.95","height":"0.95"}},{"id":"boite_17_","rect":{"x":"13.15","y":"12.95","-fill-rule":"evenodd","-clip-rule":"evenodd","-fill":"#FF0000","width":"1","height":"4.95"}}],[{"id":"boite","rect":{"x":"4.85","y":"10.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"21.3","y":"11.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_2_","rect":{"x":"20.15","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_3_","rect":{"y":"1","x":2,"fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_4_","rect":{"x":"24.8","y":"1.25","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_5_","rect":{"x":"13.5","y":"17.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.851"}},{"id":"badGuy","rect":{"x":"24.45","y":"7.2","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.85","height":"0.85"}},{"id":"boite_6_","rect":{"x":"11.9","y":"4.25","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_7_","rect":{"x":"5.9","y":"4.3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_8_","rect":{"x":"27.1","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_9_","rect":{"x":"6.85","y":"3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_10_","rect":{"x":"19.05","y":"15.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.199"}},{"id":"badGuy_1_","rect":{"x":"9.05","y":"7.1","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.85","height":"0.85"}},{"id":"boite_11_","rect":{"x":"9.45","y":"15.75","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_12_","rect":{"x":"26.75","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_13_","rect":{"x":"26.75","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_14_","rect":{"x":"1.5","y":"12","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.15"}},{"id":"boite_15_","rect":{"x":"1.5","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_16_","rect":{"x":"1.5","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.9","height":"1.149"}},{"id":"boite_17_","rect":{"x":"21.15","y":"2.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_18_","rect":{"x":"23.75","y":"17","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_19_","rect":{"x":"4.9","y":"17.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}}],[{"id":"boite","rect":{"x":"10.15","y":"3.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"20.05","y":"1.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_2_","rect":{"x":"8.05","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_3_","rect":{"x":"3.9","y":"11.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_4_","rect":{"x":"17.85","y":"15.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"11","height":"0.851"}},{"id":"boite_5_","rect":{"x":"7.95","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_6_","rect":{"x":"18.9","y":"2.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7.95"}},{"id":"boite_7_","rect":{"x":"31.25","y":"4.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_8_","rect":{"x":"21.2","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_9_","rect":{"x":"20.05","y":"1.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_10_","rect":{"x":"21.9","y":"2.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_11_","rect":{"x":"17.25","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_12_","rect":{"x":"0.9","y":"11.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_13_","rect":{"x":"28.95","y":"5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_14_","rect":{"x":"7.05","y":"18.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_15_","rect":{"x":"2.85","y":"12.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_16_","rect":{"x":"19.05","y":"17.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_17_","rect":{"x":"9.05","y":"0.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"badGuy","rect":{"x":"25.15","y":"7.15","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.899","height":"0.9"}},{"id":"boite_18_","rect":{"x":"1","y":"6.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_19_","rect":{"x":"6.15","y":"0.7","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_20_","rect":{"x":"5.95","y":"13","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_21_","rect":{"x":"10.05","y":"4.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_22_","rect":{"x":"1.9","y":"8.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_23_","rect":{"x":"15.05","y":"6.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_24_","rect":{"x":"22","y":"11.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_25_","rect":{"x":"30","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.949"}},{"id":"badGuy_1_","rect":{"x":"24","y":"19.1","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.9","height":"0.9"}}],[{"id":"boite","rect":{"x":"10.15","y":"3.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"6.2","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.85"}},{"id":"boite_2_","rect":{"x":"3.95","y":"18","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_3_","rect":{"x":"3.9","y":"11.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_4_","rect":{"x":"7.95","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_5_","rect":{"x":"30.95","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_6_","rect":{"x":"21.2","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_7_","rect":{"x":"21.9","y":"2.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_8_","rect":{"x":"19.05","y":"0.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"10"}},{"id":"boite_9_","rect":{"x":"0.95","y":"10.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_10_","rect":{"x":"28.95","y":"5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_11_","rect":{"x":"14.95","y":"6.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_12_","rect":{"x":"19.15","y":"14.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_13_","rect":{"x":"15.9","y":"16.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.851"}},{"id":"boite_14_","rect":{"x":"16.9","y":"5.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_15_","rect":{"x":"9.05","y":"0.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"badGuy","rect":{"x":"24.55","y":"8.6","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.95","height":"0.95"}},{"id":"boite_16_","rect":{"x":"1","y":"6.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_17_","rect":{"x":"6","y":"1.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_18_","rect":{"x":"2.9","y":"12.25","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_19_","rect":{"x":"9.95","y":"4.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_20_","rect":{"x":"23.2","y":"5.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.8","height":"1.2"}},{"id":"boite_21_","rect":{"x":"0.05","y":"3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_22_","rect":{"x":"1.9","y":"8.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_23_","rect":{"x":"27.05","y":"6.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_24_","rect":{"x":"21.15","y":"11.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.199"}},{"id":"badGuy_1_","rect":{"x":"21.85","y":"18","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.95","height":"0.95"}},{"id":"boite_25_","rect":{"x":"28.15","y":"15.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.95"}},{"id":"boite_27_","rect":{"x":"14.15","y":"14","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"badGuy_2_","rect":{"x":"9.75","y":"15.3","fill-rule":"evenodd","clip-rule":"evenodd","width":"0.95","height":"0.95"}}],[{"id":"boite","rect":{"x":"14.95","y":"2.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.85"}},{"id":"boite_1_","rect":{"x":"5.9","y":"9.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_2_","rect":{"x":"22.9","y":"5.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.899","height":"0.85"}},{"id":"boite_3_","rect":{"x":"4.95","y":"7.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_4_","rect":{"x":"7.85","y":"11.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.2","height":"0.851"}},{"id":"boite_5_","rect":{"x":"23.05","y":"1.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.9","height":"0.85"}},{"id":"boite_6_","rect":{"x":"0.75","y":"1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"14.3","height":"1"}},{"id":"boite_7_","rect":{"x":"0.05","y":"11.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.1","height":"0.851"}},{"id":"boite_8_","rect":{"x":"15.1","y":"8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_9_","rect":{"x":"22.25","y":"3.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.9","height":"0.85"}},{"id":"boite_10_","rect":{"x":"23.95","y":"9.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_11_","rect":{"x":"14.1","y":"4.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.1","height":"0.85"}},{"id":"boite_12_","rect":{"x":"21.75","y":"11.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.95","height":"0.851"}},{"id":"boite_13_","rect":{"x":"0.05","y":"13.15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"8.1","height":"0.85"}},{"id":"boite_14_","rect":{"x":"8.9","y":"14.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6.1","height":"0.851"}},{"id":"boite_15_","rect":{"x":"16","y":"13.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.9","height":"0.851"}},{"id":"boite_16_","rect":{"x":"7.95","y":"16","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.899","height":"0.85"}},{"id":"boite_17_","rect":{"x":"0.15","y":"18","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9.95","height":"0.85"}},{"id":"boite_18_","rect":{"x":"15.15","y":"0.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_19_","rect":{"x":"15.15","y":"5.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"7.8","height":"1.2"}},{"id":"boite_20_","rect":{"x":"0.95","y":"2.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"11","height":"1.2"}},{"id":"boite_21_","rect":{"y":"7.85","x":0,"fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"5.05","height":"1.2"}},{"id":"boite_22_","rect":{"x":"0.1","y":"5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"13.35","height":"1"}},{"id":"boite_23_","rect":{"x":"16.05","y":"9.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"badGuy","rect":{"x":"15","y":"16","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"badGuy_1_","rect":{"x":"30","y":"4.05","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_24_","rect":{"x":"25.05","y":"6.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6.8","height":"1.2"}},{"id":"boite_25_","rect":{"x":"27.15","y":"13.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6","height":"1.2"}},{"id":"boite_26_","rect":{"x":"0.95","y":"14.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"6.95","height":"1.2"}},{"id":"boite_27_","rect":{"x":"19","y":"15","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"14.05","height":"1.2"}},{"id":"boite_28_","rect":{"x":"17.85","y":"17.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"12.7","height":"0.9"}}],[{"id":"boite","rect":{"x":"10.85","y":"2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_1_","rect":{"x":"30.05","y":"0.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7.95"}},{"id":"boite_2_","rect":{"x":"14.95","y":"1.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"11.05"}},{"id":"boite_3_","rect":{"x":"19.05","y":"12.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_4_","rect":{"x":"18.95","y":"0.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"9"}},{"id":"boite_5_","rect":{"x":"1.9","y":"10.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"9","height":"0.85"}},{"id":"boite_6_","rect":{"x":"21.05","y":"10.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"10","height":"0.85"}},{"id":"boite_7_","rect":{"x":"10.85","y":"12.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"7"}},{"id":"boite_8_","rect":{"x":"2.85","y":"3.75","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.05"}},{"id":"boite_9_","rect":{"x":"15.1","y":"13.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"badGuy","rect":{"x":"4.55","y":"4.15","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_10_","rect":{"x":"4.8","y":"5.5","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.3"}},{"id":"boite_11_","rect":{"x":"3.8","y":"2.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2","height":"1.15"}},{"id":"boite_12_","rect":{"x":"5.7","y":"3.75","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"2.15"}},{"id":"boite_13_","rect":{"x":"4.05","y":"7.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.7","height":"1.15"}},{"id":"boite_14_","rect":{"x":"29.05","y":"14","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.05"}},{"id":"badGuy_1_","rect":{"x":"27.75","y":"14.35","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_15_","rect":{"x":"26.9","y":"15.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.1"}},{"id":"boite_16_","rect":{"x":"26.95","y":"13","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2.1","height":"1.15"}},{"id":"boite_17_","rect":{"x":"25.95","y":"14.05","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"2.15"}},{"id":"boite_18_","rect":{"x":"25.1","y":"18.1","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.851","height":"1.15"}},{"id":"boite_19_","rect":{"x":"7.65","y":"2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"5.95"}},{"id":"boite_20_","rect":{"x":"22.05","y":"4.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"2.9"}},{"id":"badGuy_2_","rect":{"x":"23.5","y":"5.55","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_21_","rect":{"x":"25.05","y":"5.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.65"}},{"id":"boite_22_","rect":{"x":"23","y":"4","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2.2","height":"1.3"}},{"id":"boite_23_","rect":{"x":"23.35","y":"7.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"3.7","height":"1.15"}},{"id":"boite_24_","rect":{"x":"27.05","y":"3","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.85"}},{"id":"boite_25_","rect":{"x":"7.05","y":"14.8","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"3.05"}},{"id":"badGuy_3_","rect":{"x":"5.45","y":"15.7","fill-rule":"evenodd","clip-rule":"evenodd","width":"1","height":"1"}},{"id":"boite_26_","rect":{"x":"3.85","y":"14.95","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"1.3"}},{"id":"boite_27_","rect":{"x":"4.7","y":"13.9","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"2.2","height":"1.3"}},{"id":"boite_28_","rect":{"x":"3.05","y":"17.85","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"4.05","height":"1.15"}},{"id":"boite_29_","rect":{"x":"2","y":"13.2","fill-rule":"evenodd","clip-rule":"evenodd","fill":"#FF0000","width":"1","height":"4.75"}}]]

/***/ }),
/* 35 */
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
/* 36 */
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
/* 37 */
/***/ (function(module, exports) {

/**
 * Created by Jean-Baptiste on 29/04/2017.
 * @module
 * @description Utility function to handle colors
 */


module.exports = {
    /**
     * Applies a "multiply" - filter
     * @param {number} hex - The input color in hexadecimal format
     * @param {number} percent_dec - The multiply modifier in decimal form (<1 = darker, >1 = brighter)
     */
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
        rgb_array.forEach(function (element) {
            result_array.push(Math.round(Number(element) * percent_dec));
        });
        return rgbToRGBA(result_array);
    }
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Created by Jean-Baptiste on 2/20/2017.
 */

__webpack_require__(33);
__webpack_require__(20);
__webpack_require__(21);

/**
 * @module
 * @description The core of the application. Manages the game framework:
 * - Fetches the necessary ressources before launching the game.
 * - Launches a new level when all goodies are collected.
 * - Stops the game when the user has lost all is lives.
 */

var svgContent = __webpack_require__(32),
    svg_xml = (new DOMParser().parseFromString(svgContent, "application/xml")),
    svg_xml = document.importNode(svg_xml.documentElement, true),
    app_el = document.getElementById('linguagoApplication');

app_el.innerHTML = '';
app_el.appendChild(svg_xml);

__webpack_require__(31);

var
    languageChoice = __webpack_require__(29),
    Labels = __webpack_require__(4),
    getParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    setLabels = function () {
        var
            scoreLabel_el = document.querySelector('#linguagoApplication .scoreLabel'),
            levelLabel_el = document.querySelector('#linguagoApplication .levelLabel');
        scoreLabel_el.textContent = Labels.getLabel('score');
        levelLabel_el.textContent = Labels.getLabel('level');
    },
    pageLanguage_str = getParameterByName("lang");
if (String(pageLanguage_str) === 'undefined') {
    pageLanguage_str = 'en';
}

languageChoice.registerLanguage(pageLanguage_str);
Labels.fetchLabels(pageLanguage_str, function () {
    Labels.fetchLanguages(pageLanguage_str, function () {
        console.log("loaded");
        var
            Obstacle = __webpack_require__(26),
            Goodie = __webpack_require__(25),
            BadGuy = __webpack_require__(24),
            PlayerAvatar = __webpack_require__(14),
            Config = __webpack_require__(0),
            LevelOverPopup = __webpack_require__(30),
            QuestionPopup = __webpack_require__(15),
            GameOverPopup = __webpack_require__(28),
            IntervalManager = __webpack_require__(7),
            ScoreManager = __webpack_require__(8),
            Timer = __webpack_require__(23),
            LiveManager = __webpack_require__(9),
            PauseManager = __webpack_require__(2),
            LevelCounter = __webpack_require__(22),
            playSound = __webpack_require__(5),
            ObjectlistManager = __webpack_require__(3),
            LevelsManager = __webpack_require__(27),
            Languages = __webpack_require__(13),
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
        app_el.querySelector('.homeButton').addEventListener('mousedown', function (evt) {
            evt.stopPropagation();
        });
        LiveManager.onLivesLost = function () {
            togglePauseButton(false);
            QuestionPopup.remove();
            PauseManager.playing = true;
            IntervalManager.clearAll();
            ObjectlistManager.cleanAll();
            GameOverPopup(newGame);
        };
        Goodie.onCollected = function () {
            console.log("All Goodies collected");
            togglePauseButton(false);
            ScoreManager.add(Timer.remaining);
            LevelOverPopup(function () {
                    if (level_num % 4 === 0) {
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(40)(undefined);
// imports


// module
exports.push([module.i, "\r\n\r\n@keyframes fade {\r\n    0% {\r\n        opacity: 0;\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes wipeFromRight_kf {\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate(-15px, 0);\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        transform: translate(0, 0);\r\n    }\r\n}\r\n\r\n@keyframes wipeFromLeft_kf  {\r\n    0% {\r\n        opacity: 0;\r\n        transform: translate(15px, 0);\r\n    }\r\n    100% {\r\n        opacity: 1;\r\n        transform: translate(0, 0);\r\n    }\r\n}\r\n\r\n.wipeFromRight {\r\n    animation: wipeFromRight_kf .5s;\r\n}\r\n\r\n.wipeFromLeft {\r\n    animation: wipeFromLeft_kf .5s;\r\n}\r\n\r\nhtml, body {\r\n    position: fixed;\r\n    height: 100%;\r\n    width: 100%\r\n}\r\n\r\nbody {\r\n    margin: 0;\r\n    touch-action: none;\r\n    height: 99%;\r\n    background-color: #0071c0;\r\n\r\n}\r\n\r\n#linguagoApplication .languageChoice_popup .button[aria-disabled=true] {\r\n    pointer-events: none;\r\n    opacity: .8;\r\n}\r\n\r\n\r\n#linguagoApplication .pauseButton {\r\n    pointer-events: none;\r\n}\r\n#linguagoApplication.playing .pauseButton {\r\n    pointer-events:auto;\r\n}\r\n\r\n\r\n#linguagoApplication {\r\n    height: 100%;\r\n    width: 100%;\r\n    font-family: \"AppFont\", Geneva, Verdana, sans-serif;\r\n}\r\n\r\n#linguagoApplication *:focus {\r\n    outline: none;\r\n}\r\n\r\n#linguagoApplication .button {\r\n    cursor: pointer;\r\n    display: block;\r\n}\r\n\r\n#linguagoApplication .button:focus .background {\r\n    stroke:white;\r\n    stroke-width: .5px;\r\n}\r\n\r\n#linguagoApplication .button:focus .background {\r\n    opacity: .9;\r\n}\r\n\r\n#linguagoApplication .button[aria-selected='true'] .background {\r\n    fill:#f05a28;\r\n}\r\n\r\n.question_popup ul {\r\n    font-family: \"AppFont\", Geneva, Verdana, sans-serif !important;\r\n    list-style-type: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n.question_popup ul li {\r\nmargin:0;\r\n}\r\n\r\n#linguagoApplication svg {\r\n    user-select: none;\r\n    background: #0071c0;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n#linguagoApplication #background {\r\n    fill: #0071c0;\r\n}\r\n\r\n.question_popup {\r\n    width:170px;\r\n    position: absolute;\r\n    min-height:80px;\r\n    background-color: #ffffff;\r\n    padding: 0;\r\n    user-select:none;\r\n}\r\n\r\n.pauseButtonTriggered .question_popup  .answer  {\r\n    pointer-events: none;\r\n}\r\n\r\n\r\n.question_popup .question_title, .question_popup .answer {\r\n    font-size: 1em;\r\n    padding: 0 20px;\r\n    color: #0071bc;\r\n    display: block;\r\n    font-family: AppFont, Sans-Serif;\r\n}\r\n\r\n\r\n.question_popup .question_title {\r\n    margin-top: 20px;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.question_popup {\r\n    border-radius: 30px;\r\n    padding-bottom: 30px;\r\n    border:1px solid #ffffff;\r\n    line-height: 15px;\r\n    font-size: 15px;\r\n}\r\n\r\n.question_popup:before {\r\n    content: ' ';\r\n\r\n    position: absolute;\r\n    display: block;\r\n    height: 50px;\r\n    width: 27px;\r\n    z-index: 1;\r\n    top: 40%;\r\n    background-size: 100%;\r\n    background-image: url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2016.0.3%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3C%21DOCTYPE%20svg%20PUBLIC%20%22-//W3C//DTD%20SVG%201.1//EN%22%20%22http%3A//www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd%22%3E%0A%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%09%20width%3D%2257.992px%22%20height%3D%22103.504px%22%20viewBox%3D%220%200%2057.992%20103.504%22%20enable-background%3D%22new%200%200%2057.992%20103.504%22%0A%09%20xml%3Aspace%3D%22preserve%22%3E%0A%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M57.166%2C0C51.855%2C22.842%2C32.707%2C44.544%2C1.79%2C25.105c0%2C32.864%2C46.357%2C36.039%2C55.375%2C74.989V0z%22/%3E%0A%3C/svg%3E%0A);\r\n}\r\n\r\n.question_popup:focus {\r\n    outline:none;\r\n}\r\n\r\n.question_popup.top:before {\r\n    top: 20px;\r\n}\r\n\r\n.question_popup .answers {\r\n    position:relative;\r\n    z-index: 10;\r\n}\r\n\r\n.question_popup.bottom:before {\r\n    top:auto;\r\n    bottom: 20px;\r\n}\r\n\r\n.question_popup.wipeFromRight:before {\r\n    left: -23px;\r\n}\r\n\r\n.question_popup.wipeFromLeft:before {\r\n\r\n    transform: scaleX(-1);\r\n    right: -26px;\r\n}\r\n\r\n.question_popup .answer {\r\n    cursor: pointer;\r\n    background: white;\r\n    border: 1px solid lightGrey;\r\n    border-left:none;\r\n    border-right:none;\r\n    margin:-1px 0 0 0;\r\n    text-align: left;\r\n    width: 100%;\r\n    animation: fade 1s;\r\n    transition: background .2s;\r\n}\r\n\r\n.question_popup .answer:hover, .question_popup .answer:focus {\r\n    color: white;\r\n    background: #0071bc;\r\n}\r\n\r\n#linguagoApplication .gameover_popup {\r\n    min-width: 200px;\r\n    top: 100px;\r\n    left: 100px;\r\n}\r\n\r\n\r\n.answer:focus,\r\n.answer:hover {\r\n    background-color: #0071bc;\r\n}\r\n\r\n#linguagoApplication .live_icon {\r\n    fill: 'red'\r\n}", ""]);

// exports


/***/ }),
/* 40 */
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
/* 41 */
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

var	fixUrls = __webpack_require__(42);

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
	var target = getElement(options.insertInto)

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
	if (style.parentNode === null) return false;
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
/* 42 */
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