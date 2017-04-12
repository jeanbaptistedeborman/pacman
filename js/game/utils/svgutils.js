/**
 * Created by Jean-Baptiste on 2/22/2017.
 */
"use strict";
var PointConversion = {
    SVGToPoint: function (SVGPoint) {
        return {x: SVGPoint.x, y: SVGPoint.y};
    },
    pointToSVG: function (svg_el, point) {
        var svg_point = svg_el.createSVGPoint();
        svg_point.x = point.x;
        svg_point.y = point.y;
        return svg_point;
    }
};
module.exports = {
    /**
     *
     * Source: https://msdn.microsoft.com/en-us/library/hh535760(v=vs.85).aspx
     * @param {Point} point
     * @param dom_svg
     * @returns {SVGPoint}
     */
    convertCoordinateFromDOMToSVG: function (dom_svg, point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, point),
            converted_point = svg_point.matrixTransform(CTM.inverse());
        return PointConversion.SVGToPoint(converted_point);
    },
    convertCoordinateFromSVGToDOM: function (dom_svg, svgCoordinate_point) {
        var
            CTM = dom_svg.getScreenCTM(),
            svg_point = PointConversion.pointToSVG(dom_svg, svgCoordinate_point),
            converted_point = svg_point.matrixTransform(CTM);
        return PointConversion.SVGToPoint(converted_point);
    },
    createElement: function (svgTagName_str, params_obj) {
        var el = document.createElementNS("http://www.w3.org/2000/svg", svgTagName_str);
        for (var n in params_obj) {
                el.setAttribute(n,  params_obj[n]);
        }
        return el;
    }
};



