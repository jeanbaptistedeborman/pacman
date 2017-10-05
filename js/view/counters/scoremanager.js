/**
 * Created by Jean-Baptiste on 11/04/2017.
 * @module
 * @description This component manages the display of the score of the user
 */
var sha1 = require('js-sha1'),
    Labels = require('../../datatransform/labels'),
    Backend = require('../../configAPI');

var

    score_num = 0,
    display = function (score_num) {
        var display_text = document.getElementById('score');
        display_text.textContent = score_num;
    };
    display (0);

module.exports = {
    /**
     * The score of the player
     * @readonly
     * @type number
     *
     */
    get score() {
        return score_num;
    },
    /**
     * Resets the score to 0
     *
     */
    reset: function () {
        score_num = 0;
        display (score_num);
    },
    /**
     * Add points to the score
      * @param {Number} num - The number of points to add.
     */
    add:function (num) {
       score_num += num;
       display (score_num);
    },
    /**
     * Adds 1 point to the score.
     */
    increment: function () {
        display(++score_num);
    },

    // Return the secret, must be hidden
    getSecret: function () { // This need to be hidden
        return "lBg9Gu4sitMcH8HqcyGR"; //TODO: not harcode it?
    },

    // Return client iD
    getClientID: function () {
        return "k_client2";
    },

    // return hashed value
    // Remember: Check http, https if there is error
    injectHashValue: function (url) {
        var url = url;
        var hash = sha1(url+module.exports.getSecret());
        return hash;
    },

    /**
     * API call to retrieve tour rank from your current score
      * @param {Number} score - The current score
      * @callback succ_callback
      * @callback err_callback
     */
    getRank: function (score, succ_callback, err_callback) {
        if ((typeof score != "number") || (!(score >= 0))) {
            return err_callback();
        }
        //Start fetching
        var xhr = new XMLHttpRequest();
        xhr.open("GET", Backend.baseURL+"/current_score/2/" + score, true);
        xhr.setRequestHeader("Client-id", module.exports.getClientID());
        xhr.setRequestHeader("Hash-value", module.exports.injectHashValue(Backend.baseURL2+"/current_score/2/" + score.toString())); //Why https is removed?
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                //Error value
                var ret = -1;
                var tot = -1

                //Parse
                var response = null;
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (error) {
                    return err_callback();
                }
                if ((response) && (response.data) && (response.status)) {
                    ret = parseInt(response.data.position);
                    tot = parseInt(response.data.total_scores)+1;
                } else {
                    ret = parseInt(response.data.position);
                    tot = parseInt(response.data.total_scores)+1;
                    return succ_callback(ret, tot);
                }

                return succ_callback(ret, tot);
            }
        }
        xhr.send();
    },

    /**
     * API call to post your score
      * @param {Number} score - The current score
      * @param {String} name - Nickname
      * @callback succ_callback
      * @callback err_callback
     */
    postScore: function (score, name,  succ_callback, err_callback) {
        //Fail for bad input
        if ((typeof score != "number") || (!(score >= 0))) {
            return err_callback();
        }
        if (typeof name != "string") {
            return err_callback();
        }
        if ((name == "") || (name == "__________")) {
            name = "0";
        }

        //Start fetching
        var xhr = new XMLHttpRequest();
        xhr.open("GET", Backend.baseURL+"/send_score/2/" + score + "/" + name, true);
        xhr.setRequestHeader("Client-id", module.exports.getClientID());
        xhr.setRequestHeader("Hash-value", module.exports.injectHashValue(Backend.baseURL2+"/send_score/2/" + score + "/" + name)); //Why https is removed?
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                //Parse
                var response = null;
                try {
                    response = JSON.parse(xhr.responseText);
                } catch (error) {
                    return err_callback();
                }
                if ((response) && (response.status)) {
                    return succ_callback();
                } else {
                    return err_callback();
                }
            }
        }
        xhr.send();
    },

    /**
     * Prompt a basic Dialog box for the user to enter his nickname
      * @param {Number} score - The current score
      * @callback succ_callback
      * @callback err_callback
      * @callback cancel_callback
     */
    promptScore: function(score, succ_callback, err_callback, cancel_callback) { //cancel callback?
        var promptVal = prompt(Labels.getLabel('enter_name_hof'), "");

        if (promptVal && promptVal != null) {
            module.exports.postScore(score, promptVal, succ_callback, err_callback);
        } else {
            return cancel_callback();
        }
    }

};

