/**
 * Created by Jean-Baptiste on 06/05/2017.
 */
var playing_bool = true;

module.exports = {
    set playing   (boolean) {
        if (boolean === undefined) {
            playing_bool = !playing_bool;
        } else {
            playing_bool = boolean;
        }
    },
    get playing () {
        return playing_bool;
    }
};
