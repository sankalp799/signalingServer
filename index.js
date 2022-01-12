let SignalServer = {};
const express = require('express')
let app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.sockets.on("connection", socket => {
    console.log(`[SOCKET_CONNECTION] SOCKET CONNECTED WITH ID: ${socket.id}`);
    socket.on('room:join', (roomId) => {
        console.log(`[SOCKET_CONN_ROOM] ${socket.id} joined ${roomId}`);
        socket.join(roomId);
        io.to(socket.id).emit('joined');
        console.log(`[SOCKET] SOCKET_CONNECTED ID: ${socket.id} TO ROOM: ${roomId}`);
        /*********
        io.sockets.adapter.rooms.get(roomId).forEach(client => console.log(`Client ${client} joined ${roomId}`));
        */
        socket.on('rtc:call', (room, username) => {
            socket.to(room).emit('rtc:call', socket.id, username);
            console.log(`[SOCKET_BROADCASTER] RTCPeerConnection Call Request by id: ${socket.id} with USERNAME: ${username}`);
            console.log(`[RTC] ${socket.id} calling...`);
        });

        socket.on('rtc:offer', (data) => {
            io.to(data.to).emit('rtc:offer', socket.id, data.sdp, data.username);
            console.log(`[SOCKET_BROADCASTER] RTCPeerConnection Offer by id: ${socket.id} with USERNAME: ${data.username}`);
            console.log(`[RTC] ${socket.id} offering connection to: ${data.to}`);
        })

        socket.on('rtc:answer', (data) => {
            io.to(data.to).emit('rtc:answer', socket.id, data.sdp);
            console.log(`[SOCKET_BROADCASTER] RTCPeerConnection Answer by id: ${socket.id} with USERNAME: ${data.username}`);
            console.log(`[RTC] ${socket.id} Answer's the call`);
        })

        socket.on('rtc:candidate', (data) => {
            socket.to(data.to).emit('rtc:candidate', {
                candidate: data.candidate,
                from: socket.id,
            });
            console.log(`[SOCKET_BROADCASTER] Passing RTC:Candidate From: ${socket.id} To: ${data.to}`);
            console.log(`[WET_RTC:ICE] ${socket.id} RTC:Peer:Candidate Sharing... `);
        })

        socket.on('leave', (room) => {
            io.to(room).emit('user:left', socket.id);
            console.log(`[SOCKET] ${id} LEFT`);
            console.log(`[RTC_CONN] RTC:PEER:CONNECTION TERMINATED BY ${socket.id}`)
        })

        socket.on('disconnect', () => {
            console.log(`[SOCET_CONNECTION] TERMINATED.`);
        })
    })
});


function init() {
    httpServer.listen(3000, err => !err ? console.log('listening...', '\n', '[SOCKET] WEB_RTC_SIGNALING SERVICE READY AND LAUNCHED ON PORT 3000') : console.error(err));
}

module.exports = init;