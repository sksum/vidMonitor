const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io =  socket(server);

const rooms = {};

io.sockets.on("connection", socket => {
    console.log(`connected: ${socket.id} `)



});