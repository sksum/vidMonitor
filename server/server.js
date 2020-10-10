const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io =  socketIo(server);

const rooms = {};
const tests = {};
const invils = {};

io.sockets.on("connection", socket => {
    console.log(`connected: ${socket.id} `)

    socket.on("Invil=>Server:letsInitialize",(id) => {
        console.log(`making new test :${id} + socket.id of invil = ${socket.id}`)
        tests[id] = [socket.id];
        invils[id] = socket.id;
    })

    socket.on("Stud=>Server:letsInitialize",(id) => {
        console.log(` Student socket.id : ${socket.id} entered exam room- ${id}`)
        if (tests[id]) {
            tests[id].push(socket.id);
            const invil = invils[id];
            socket.emit("Server=>Stud:invilFound", invil);
            socket.to(invil).emit("Server=>Invil:newStudent", socket.id);
            
        }   
    })


});
server.listen(8000 ,() => {console.log("server.js running")});
