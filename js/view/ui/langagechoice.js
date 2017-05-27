/**
 * Created by Jean-Baptiste on 27/05/2017.
 */


var languages_array = require('../../data/languages.json'),
    SvgUtils =  require ('../../game/utils/svgutils'),
    choosenLanguages_array;

module.exports =  function ( ) {
    languages_array.forEach (function (element) {
        var button_str = languages_array.label,
            button_el = SvgUtils.createElement('svg'),
            button_text = SvgUtils.createElement('text');

        button_el.appendChild(button_text);
        button_el.addEventListener('click', function ()  {
            console.log (element);


        });

    });



};