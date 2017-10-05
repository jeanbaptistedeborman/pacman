/**
 * Created by Lucas Arcuri on 05/11/2017.
 * @module
 * @description This is the configuration file where you set up the base URL of the API
 */

var baseURL = "https://dhc3.intrasoft-intl.com/timemachine/public/index.php/";
var baseURL2 = "http://dhc3.intrasoft-intl.com/timemachine/public/index.php/";


module.exports = {
    /**
     * The API base URL endpoint
     * @readonly
     * @type string
     *
     */
    get baseURL() {
        return baseURL;
    },

    /**
     * A second API base URL endpoint, in case of http / https issues during dev
     * @readonly
     * @type string
     *
     */
    get baseURL2() {
      return baseURL2;
    }


};

