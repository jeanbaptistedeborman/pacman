/**
 * Created by Jean-Baptiste on 11/04/2017.
 */
var
    updateView = function (level_num) {
        var
            text_text = document.getElementById('level');
        text_text.textContent = level_num;
    };
module.exports = {
    set: function (num) {
        updateView(num);
    }
};


