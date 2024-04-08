const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
// const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatController");
const {  authMiddleware } = require("../middleware/authMiddleware");

app.post("/accesschat",authMiddleware, accessChat);
app.get("/fetchchats",authMiddleware, fetchChats);
app.post("/chat/group",authMiddleware, createGroupChat);
app.put("/chat/rename",authMiddleware, renameGroup);
app.put("/chat/groupremove",authMiddleware, removeFromGroup);
app.put("/chat/groupadd",authMiddleware, addToGroup);

module.exports = app;