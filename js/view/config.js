/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
var configs_obj = {
    stage: {
        gridSize:10,
        position: {
            x: 0,
            y: 0,
            width: 400,
            height: 300
        },
        dom_el: document.querySelector('#app_js')
    },
    playerAvatar: {
        position: {
            x: 0,
            y: 0,
            width: 10,
            height: 10
        },
        dom_el: document.querySelector('#player')
    },
    obstacle : {
        position: {
            x: undefined,
            y:undefined,
            width:10,
            height:10
        },
        dom_el:undefined,
    }
};


module.exports = function (id_str) {
    var result_obj = configs_obj[id_str];
    if (result_obj) {
        return JSON.parse(JSON.stringify(result_obj));
    } else {
        throw (new Error("No config found for id : " + id_str));
    }
};
