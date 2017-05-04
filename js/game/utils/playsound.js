/**
 * Created by Jean-Baptiste on 04/05/2017.
 */
module.exports = function (filename_str){
    var audio = new Audio (filename_str);
    audio.play ();
};