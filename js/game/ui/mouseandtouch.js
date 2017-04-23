/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";


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
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("touchMove", mouseMove);
        position_point = null;
    },
    mouseMove = function (evt) {
        evt.preventDefault();
        setCoordinates(evt);
    },
    mouseDown = function (evt) {
        evt.preventDefault();
        document.addEventListener("mousemove", mouseMove);
        setCoordinates(evt);
    };
document.addEventListener("mouseleave", stopListening);
document.addEventListener("touchmove", mouseMove);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("touchstart", mouseDown);
document.addEventListener("mouseup", stopListening);
document.addEventListener("touchend", stopListening);

module.exports = {
    get position() {
        return position_point;
    }
};