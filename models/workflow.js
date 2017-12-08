"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    id: {type: String},
    text: {type: String, required: true}
});

var listSchema = new Schema({
    id: {type: String},
    name: {type: String, required: true},
    cards: [cardSchema]
});

var boardSchema = new Schema({
    id: {type: String},
    name: {type: String, required: true},
    lists: [listSchema],
});

var workflowSchema = new Schema({
    username: {type: String, unique: true, required: true},
    boards: [boardSchema]
});

module.exports = mongoose.model('workflow', workflowSchema);
