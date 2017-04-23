/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";

var preventDefaults = function (evt) {
    evt.preventDefault();
};
document.addEventListener("touchMove", preventDefaults);
document.body.addEventListener("touchMove", preventDefaults);
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