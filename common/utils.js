"use strict";

const util = require('util');
var WorkFlow = require('../models/workflow');

var utils = {
    getWorkflow: function getWorkflow(req, callback) {
        var username = req.body.username || req.query.username
                        || req.params.username || "";

        if(username === "") {
            console.log("No username in the request");
            return callback({
                status: "error",
                message: "No username",
                data: {}
            });
        }

        WorkFlow.findOne({username: username}, function(error, workflow) {
            if(error) {
                console.log("Error in finding document");
                console.log("Error => " + util.inspect(error));
                return callback({
                    status: "error",
                    message: "Internal server error",
                    data: {}
                });
            }

            callback(error, workflow);
        });
    }
};

module.exports = utils;
