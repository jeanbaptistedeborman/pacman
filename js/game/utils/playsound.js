/**
 * Created by Jean-Baptiste on 04/05/2017.
 */

var FOLDER_STR = 'sounds/';
module.exports = function ( filename_str){
    var audio = new Audio (FOLDER_STR + filename_str + '.mp3');
    audio.play ();
};