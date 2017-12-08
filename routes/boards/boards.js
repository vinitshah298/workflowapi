"use strict";

const express = require('express');
const hat = require('hat');
const util = require('util');
var router = express.Router({mergeParams: true});

var WorkFlow = require('../../models/workflow');
var utils = require('../../common/utils');

router.post('/', createBoard);
router.get('/:id', getBoard);
router.get('/:id/lists', getLists);
router.get('/:id/cards', getCards);
router.delete('/:id', deleteBoard);
router.patch('/:id', updateBoardName);

// Route to create board
function createBoard(req, res) {
    var username = req.body.username;
    var boardName = req.body.board_name;

    utils.getWorkflow(req, function(error, workflow) {
        if(error) {
            if(error.message === "Internal server error") {
                res.status(500);
                return res.json(error);
            }
            res.status(400);
            return res.json(error)
        }

        if(!workflow) {
            var board = {
                id: hat(),
                name: boardName
            };

            var workflow = new WorkFlow({});
            workflow.id = hat();
            workflow.username = username;
            workflow.boards.push(board);

            workflow.save(function(error) {
                if(error) {
                    console.log("Error in saving document");
                    console.log("Error => " + util.inspect(error));
                    res.status(500);
                    return res.json({
                        status: "error",
                        message: "Internal server error"
                    });
                }

                console.log(username + " created board: " + boardName);
                res.status(201);
                return res.json({
                    status: "success",
                    message: "Board created",
                    data: board
                });
            });
            return;
        }

        var board = {
            id: hat(),
            name: boardName
        };
        workflow.boards.push(board);
        workflow.save(function(error) {
            if(error) {
                console.log("Error in saving document");
                console.log("Error => " + util.inspect(error));
                res.status(500);
                return res.json({
                    status: "error",
                    message: "Internal server error"
                });
            }

            console.log(username + " created board: " + boardName);
            res.status(200);
            return res.json({
                status: "success",
                message: "Board created",
                data: board
            });
        });
    });
}

function getBoard(req, res) {
    var boardId = req.params.id;
    var username = req.query.username;
    var requestedBoard = null;

    utils.getWorkflow(req, function(error, workflow) {
        if(error) {
            if(error.message === "Internal server error") {
                res.status(500);
                return res.json(error);
            }
            res.status(400);
            return res.json(error)
        }

        if(!workflow) {
            console.log("No workflows saved for " + username);
            res.status(400);
            return res.json({
                status: "error",
                message: "No workflows found for " + username,
                data: {}
            });
        }

        workflow.boards.forEach(function(board) {
            if(board.id === boardId) {
                requestedBoard = board;
            }
        });

        if(requestedBoard) {
            console.log("Board with id " + boardId + " found");
            res.status(200);
            return res.json({
                status: "success",
                message: "Board found",
                data: requestedBoard
            });
        }

        console.log("No board with id " + boardId);
        res.status(400);
        return res.json({
            status: "error",
            message: "No board found for id " + boardId
        });
    });
}

function getLists(req, res) {
    var boardId = req.params.id;
    var username = req.query.username;
    var requestedBoard = null;
    var lists = [];

    utils.getWorkflow(req, function(error, workflow) {
        if(error) {
            if(error.message === "Internal server error") {
                res.status(500);
                return res.json(error);
            }
            res.status(400);
            return res.json(error)
        }

        if(!workflow) {
            console.log("No workflows saved for " + username);
            res.status(400);
            return res.json({
                status: "error",
                message: "No workflows saved for " + username,
                data: {}
            });
        }

        workflow.boards.forEach(function(board) {
            if(board.id === boardId) {
                requestedBoard = board;
            }
        });

        if(requestedBoard) {
            requestedBoard.lists.forEach(function(list) {
                lists.push(list.name);
            });
            console.log("Lists in board : " + lists);
            res.status(200);
            return res.json({
                status: "success",
                message: "Lists in board",
                data: {lists}
            });
        }

        console.log("No board with id " + boardId);
        res.status(400);
        return res.json({
            status: "success",
            message: "No board found for id " + boardId
        });
    });
}

function getCards(req, res) {
    var boardId = req.params.id;
    var username = req.query.username;
    var requestedBoard = null;
    var cards = [];

    utils.getWorkflow(req, function(error, workflow) {
        if(error) {
            if(error.message === "Internal server error") {
                res.status(500);
                return res.json(error);
            }
            res.status(400);
            return res.json(error)
        }

        if(!workflow) {
            console.log("No workflows saved for " + username);
            res.status(400);
            return res.json({
                status: "error",
                message: "No workflows saved for " + username,
                data: {}
            });
        }

        workflow.boards.forEach(function(board) {
            if(board.id === boardId) {
                requestedBoard = board;
            }
        });

        if(requestedBoard) {
            requestedBoard.lists.forEach(function(list) {
                list.cards.forEach(function(card) {
                    cards.push(card);
                });
            });
            console.log("Cards in board : " + cards);
            res.status(200);
            return res.json({
                status: "success",
                message: "Cards in board",
                data: {cards}
            });
        }

        console.log("No board with id " + boardId);
        res.status(400);
        return res.json({
            status: "success",
            message: "No board found for id " + boardId
        });
    });
}

function deleteBoard(req, res) {
    var boardId = req.params.id;
    var username = req.body.username;
    var boardDeleted = null;

    utils.getWorkflow(req, function(error, workflow) {
        if(error) {
            if(error.message === "Internal server error") {
                res.status(500);
                return res.json(error);
            }
            res.status(400);
            return res.json(error)
        }

        if(!workflow) {
            console.log("No workflows saved for " + username);
            res.status(400);
            return res.json({
                status: "error",
                message: "No workflows saved for " + username,
                data: {}
            });
        }

        workflow.boards.forEach(function(board, index) {
            if(board.id === boardId) {
                workflow.boards.splice(index, 1);
                boardDeleted = true;
            }
        });

        if(!boardDeleted) {
            console.log("No board with id " + boardId);
            res.status(400);
            return res.json({
                status: "error",
                message: "No No board with id " + boardId,
                data: {}
            });
        }

        workflow.save(function(error) {
            if(error) {
                console.log("Error in saving updated document");
                console.log("Error => " + util.inspect(error));
                res.status(500);
                return res.json({
                    status: "error",
                    message: "Internal server error"
                });
            }

            console.log("Deleted board from the workflow");
            res.status(200);
            return res.json({
                status: "success",
                message: "Board deleted"
            });
        });
    });
}

function updateBoardName(req, res) {
    var boardId = req.params.id;
    var username = req.body.username;
    var boardName = req.body.board_name;
    var boardUpdated = null;

    utils.getWorkflow(req, function(error, workflow) {
        if(error) {
            if(error.message === "Internal server error") {
                res.status(500);
                return res.json(error);
            }
            res.status(400);
            return res.json(error)
        }

        if(!workflow) {
            console.log("No workflows saved for " + username);
            res.status(400);
            return res.json({
                status: "error",
                message: "No workflows saved for " + username,
                data: {}
            });
        }

        workflow.boards.forEach(function(board, index) {
            if(board.id === boardId) {
                board.name = boardName;
                boardUpdated = true;
            }
        });

        if(!boardUpdated) {
            console.log("No board with id " + boardId);
            res.status(400);
            return res.json({
                status: "error",
                message: "No board with id " + boardId,
                data: {}
            });
        }

        workflow.save(function(error) {
            if(error) {
                console.log("Error in saving updated document");
                console.log("Error => " + util.inspect(error));
                res.status(500);
                return res.json({
                    status: "error",
                    message: "Internal server error"
                });
            }

            console.log("Updated board name");
            res.status(200);
            return res.json({
                status: "success",
                message: "Updated board name"
            });
        });
    });
}

module.exports = router;
