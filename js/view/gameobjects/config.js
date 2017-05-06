/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";

var app_obj = {
    dom_el: document.getElementById('linguagoApplication')
};
var stage_obj = {
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

console.log ("app_obj.dom_el : ", app_obj.dom_el);
var configs_obj = {
    app: app_obj,
    interface: {
        dom_el: app_obj.dom_el.querySelector('.interface')
    },
    stage: stage_obj,
    playerAvatar: {
        targetPosition: {
            x: undefined,
            y: undefined
        },
        position: {
            x: 0,
            y: 0,
            width: 10,
            height: 10
        },
        speed: 2.5,
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
