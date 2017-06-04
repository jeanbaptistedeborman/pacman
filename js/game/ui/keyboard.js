/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
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