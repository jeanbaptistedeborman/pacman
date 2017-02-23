/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
var configs_obj = {
    stage: {
        position: {
            x: 0,
            y: 0,
            width: 400,
            height: 200
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
    }
};
module.exports = function (id_str) {
    var result_obj = configs_obj[id_str];
    if (result_obj) {
        return result_obj;
    } else {
        throw (new Error("No config found for id : " + id_str));
    }
};
