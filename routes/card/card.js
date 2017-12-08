"use strict";

const express = require('express');
const hat = require('hat');
const util = require('util');
const router = express.Router({mergeParams: true});

const WorkFlow = require('../../models/workflow');
var utils = require('../../common/utils');

router.post('/', createCard);
router.get('/:id', getCard);

// Route to create card
function createCard(req, res) {
    const username = req.body.username;
    const boardId = req.body.board_id;
    const listId = req.body.list_id;
    const cardName = req.body.card_name;

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

        const card = {
            id: hat(),
            text: cardName
        };

        workflow.boards.forEach(function(board) {
            if(board.id === boardId) {
                board.lists.forEach(function(list) {
                    if(list.id === listId) {
                        list.cards.push(card);
                    }
                });
            }
        });

        workflow.save(function(error) {
            if(error) {
                console.log("Error in saving document");
                console.log("Error => " + util.inspect(error));
                res.status(500);
                return res.json({});
            }
            console.log(username + " created card " + cardName);
            res.status(200);
            return res.json({});
        });
    });
}

function getCard() {
    
}
module.exports = router;
