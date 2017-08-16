/**
 * Created by Jean-Baptiste on 04/05/2017.
 * @module
 * @descrition Preloads, loads, caches and plays the sounds used in the application.
 * @param fileName_str {string} - The name of the file, without the folder path and ".mp3" extension
 * @param forceNewAudio_bool {boolean} - Forces the app to load the sound again -even if the sound was already cached (allows sounds overlaps).
 */

"use strict";
var
    FOLDER_STR = 'dist_linguago/sounds/',
    cache = {},
    loadSound = function (name_str, doNotUseCache_bool) {
        var audio = doNotUseCache_bool ? null : cache[name_str];
        if (!audio) {
            audio = new Audio(FOLDER_STR + name_str + '.mp3');
            if (!cache[name_str]) {
                cache[name_str] = audio;
            }
        }
        return audio;
    },
    preload_array = ["bon_1", "bon_2", "question", "mauvais_1", "mauvais_2"];
preload_array.forEach(function (name_str) {
    loadSound(name_str);
});

module.exports = function (filename_str, forceNewAudio_bool) {
    var audio = loadSound(filename_str, forceNewAudio_bool);
    audio.play();
};