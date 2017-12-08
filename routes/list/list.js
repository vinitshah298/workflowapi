"use strict";

const express = require('express');
const hat = require('hat');
const util = require('util');
var router = express.Router({mergeParams: true});

var WorkFlow = require('../../models/workflow');
var utils = require('../../common/utils');

router.post('/', createList);
router.get('/:id', getList);

// Route to create list
function createList(req, res) {
    var username = req.body.username;
    var boardId = req.body.board_id;
    var listName = req.body.list_name;

    WorkFlow.findOne({username: username}, function(error, workflow) {
        if(error) {
            console.log("Error in finding document");
            console.log("Error => " + util.inspect(error));
            res.status(500);
            return res.json({});
        }

        if(!workflow) {
            console.log("No document exists for this username");
            console.log("User: " + username);
            res.status(400);
            return res.json({});
        }

        var list = {
            id: hat(),
            name: listName
        };

        workflow.boards.forEach(function(board) {
            if(board.id === boardId) {
                board.lists.push(list);
            }
        });

        workflow.save(function(error) {
            if(error) {
                console.log("Error in saving document");
                console.log("Error => " + util.inspect(error));
                res.status(500);
                return res.json({});
            }
            console.log(username + " created list " + listName);
            res.status(200);
            return res.json({});
        });
    });
}

function getList(req, res) {
    var username = req.query.username;
    var listId = req.params.id;
    var requestedList = null;

    WorkFlow.findOne({username: username}, function(error, workflow) {
        if(error) {
            console.log("Error in finding document");
            console.log("Error => " + util.inspect(error));
            res.status(500);
            return res.json({
                status: "error",
                message: "Internal server error"
            });
        }

        if(!workflow) {
            console.log("No workflows saved for " + username);
            res.status(400);
            return res.json({});
        }

        if(workflow) {
            workflow.boards.forEach(function(board) {
                board.lists.forEach(function(list) {
                    if(list.id === listId) {
                        requestedList = list;
                    }
                });
            });

            if(requestedList) {
                console.log("List with id " + listId + " found");
                res.status(200);
                return res.json({
                    status: "success",
                    message: "List found",
                    data: requestedList
                });
            }

            console.log("No list with id " + listId);
            res.status(400);
            return res.json({
                status: "error",
                message: "No list found for id " + listId
            });
        }
    });
}

module.exports = router;
