/**
 * Created by Jean-Baptiste on 10/04/2017.
 * @module
 * @description Keeps a list of all objects currently displayed in the game, sorted by kind ("badGuy", "Goodie",  "playerAvatar") .
 */
var list_obj = {disabled: []},
    ArrayUtils = require('../../game/utils/arrayutils'),
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

