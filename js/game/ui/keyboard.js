/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var pressedKey_str,
    lastPressedKey_str,
    body_el = document.getElementsByTagName('body')[0];

body_el.onkeydown = function (evt) {
    console.log('key :', evt);
    lastPressedKey_str = pressedKey_str = evt.key;
};
body_el.onkeyup = function () {
    pressedKey_str = null;
};
module.exports = {
    get pressedKey() {
        return pressedKey_str;
    },
    get lastPressedKey() {
        return lastPressedKey_str;
    }
};