/**
 * Created by Jean-Baptiste on 04/05/2017.
 */

var
    FOLDER_STR = 'sounds/',
    cache = {},
    loadSound = function (name_str) {
        var audio = cache[name_str];
        if (!audio) {
            audio = new Audio(FOLDER_STR + name_str + '.mp3');
            cache[name_str] = audio;
        }
        console.log (cache);
        return audio;
    },
    preload_array = ["bon_1", "bon_2", "question", "mauvais_1", "mauvais_2"];
preload_array.forEach(function (name_str) {
    loadSound(name_str);
});

module.exports = function (filename_str) {
    var audio = loadSound(filename_str);
    audio.play();
};