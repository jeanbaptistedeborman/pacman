/**
 * Created by Jean-Baptiste on 10/04/2017.
 */
/**
 * Created by Jean-Baptiste on 28/02/2017.
 */
var list = {},
    ArrayUtils = require('../../game/utils/arrayutils'),
    getList = function (listId_str) {
        var result_array = list[listId_str];
        if (result_array) {
            return list[listId_str];
        } else {
            throw (new Error('List "' + listId_str + '" not found'));
        }
    },
    createList = function (id_str, array) {
        if (!array) {
            array = [];
        }
        list[id_str] = array;
        return list[id_str];
    };

module.exports = {
    createList: createList,
    getList: getList,
    pushItem: function (listId_str, item_obj) {
        getList(listId_str).push(item_obj);
    },
    removeItem: function (listId_str, item_obj) {
        console.log ("BEFORE REMOVAL : ", getList(listId_str));
        createList(listId_str, ArrayUtils.remove(getList(listId_str), item_obj));
        console.log ("AFTER REMOVAL : ", getList(listId_str));
    }
};

