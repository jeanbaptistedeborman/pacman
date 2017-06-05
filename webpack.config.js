/**
 * Created by Jean-Baptiste on 03/06/2017.
 */
var path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: './js/index.js',

    output: {
        filename: 'linguago_bundle.js',
        path: path.resolve(__dirname, 'dist_linguago')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            }
        ]
    }
    /*,
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true
        })
    ]
    */
}
;