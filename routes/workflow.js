"use strict";

const express = require('express');
const hat = require('hat');
const util = require('util');
const router = express.Router({mergeParams: true});

const WorkFlow = require('../models/workflow');

router.use('/boards', require('./boards/boards.js'));
router.use('/list', require('./list/list.js'));
router.use('/card', require('./card/card.js'));

router.get('/:username', getAllNotes);

router.get('/', function(req, res) {
    res.end("Welcome the workflow API endpoint");
});

// Route to get all boards, lists, and cards of user
function getAllNotes(req, res) {
    var username = req.params.username;
    WorkFlow.findOne({username: username}, {_id: 0, __v: 0}, function(error, workflow) {
        if(error) {
            console.log("Error in finding document");
            console.log("Error => " + util.inspect(error));
            res.status(500);
            return res.json({});
        }

        if(!workflow) {
            console.log("No workflow saved for: " + username);
            res.status(200);
            return res.json({});
        }

        console.log("Retrieved notes for " + username);
        res.status(200);
        return res.json({notes: workflow});
    });
}

module.exports = router;
