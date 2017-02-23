/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
"use strict";
var
    position_point = null,
    app_el = document.getElementById('app_js'),
    stopListening = function () {
        app_el.removeEventListener("mousemove", mouseMove);
        position_point = null;
    },
    mouseMove = function (evt) {
        console.log('mouseMove');
        position_point = {x: evt.clientX, y: evt.clientY};
    },
    mouseDown = function (evt) {
        app_el.addEventListener("mousemove", mouseMove);
        position_point = {x: evt.clientX, y: evt.clientY};
    };
app_el.addEventListener("mouseleave", stopListening);
app_el.addEventListener("mousedown", mouseDown);
app_el.addEventListener("mouseup", stopListening);

module.exports = {
    get position() {
        return position_point;
    }
};