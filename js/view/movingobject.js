/**
 * Created by Jean-Baptiste on 2/21/2017.
 */
Configs = require ('./config.js');
module.exports =  function (configId_str) {
        var
            description_obj = Configs (configId_str);
            position_rect = description_obj.position;
            updateObjectPos = function (point) {
            for (var n in point) {
                position_rect[n]= point[n];
            }
            description_obj.dom_el.setAttribute("x", position_rect.x);
                description_obj.dom_el.setAttribute("x", position_rect.x);
        };
        return  {
            set pos(point) {
                updateObjectPos (point);
            }
        };
}
