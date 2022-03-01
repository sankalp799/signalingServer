const cors = require('cors');
const ytdl = require('ytdl-core');
const express = require('express')
const request = require('request')
let app = express();
require('dotenv').config();
const httpServer = require('http').createServer(app);
const freddy = require('./cli');
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let rooms = {};

app.use(cors({
    origin: "*",
}));

app.use(express.json());
app.use('/music/:id', (req, res) => {
    try{
        console.log('request_id> ', req.params.id)
        const y_url = `https://www.youtube.com/watch?v=${req.params.id}`
        ytdl.getInfo(y_url)
            .then(data => {
                let gurl = data.formats[data.formats.length-1].url;
                req.pipe(request(gurl)).pipe(res);
            })
            .catch(e => {
                console.error(e)
                
            });
    }catch(e){
        console.log('router_music> ', e.message);
        res.status(404).send('not found');
    }
    
})

app.get('/', (req, res) => {
    res.status(200).send('welcome to dashoff signaling server');
})

io.sockets.on("connection", socket => {
    console.log(`[SOCKET_CONNECTION] SOCKET CONNECTED WITH ID: ${socket.id}`);
    socket.on('room:join', (roomId) => {
        console.log(`[SOCKET_CONN_ROOM] ${socket.id} joined ${roomId}`);
        socket.join(roomId);
        io.to(socket.id).emit('joined');
        console.log('count>>> ', io.sockets.adapter.rooms.get(roomId).size);
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

        socket.on('rtc:re-negotiate-media', (rid) => {
            socket.to(rid).emit('rtc:re-negotiate-req', socket.id);
        })

        socket.on('rtc:re-negotiate-media-offer', ({ to, username, sdp }) => {
            io.to(to).emit('rtc:re-negotiate-media-offer', socket.id, sdp, username);
            console.log(`[SOCKET_BROADCASTER] RTCPeerConnection Re-Negotiate-Media-Offer by id: ${socket.id} with USERNAME: ${username}`);
            console.log(`[RTC] ${socket.id} offering Nego-Media to: ${to}`);
        })

        socket.on('rtc:re-negotiate-media-answer', data => {
            io.to(data.to).emit('rtc:re-negotiate-media-answer', socket.id, data.sdp);
            console.log(`[SOCKET_BROADCASTER] RTCPeerConnection Answer by id: ${socket.id} with USERNAME: ${data.username}`);
            console.log(`[RTC] ${socket.id} Answer's the call`);
        })

        socket.on('leave', (room) => {
            io.to(room).emit('user:left', socket.id);
            console.log(`[SOCKET] ${socket.id} LEFT`);
            console.log(`[RTC_CONN] RTC:PEER:CONNECTION TERMINATED BY ${socket.id}`)
        })

        socket.on('disconnect', () => {
            console.log(`[SOCET_CONNECTION] TERMINATED.`);
        })

        /*******
        socket.on('music:req', (rid, name) => {
            // fetch yid by name
            // emit yURL
            ytdl.getInfo('https://www.youtube.com/watch?v=_78Aqz9Xhsw')
                .then(data => {
                    rooms[rid] = new Set();
                    io.to(rid).emit('music:data', {
                        request_initiator: socket.id,
                        data: { url: data.formats[data.formats.length - 1].url },
                    });
                })
                .catch(e => {
                    console.log(`[MUSIC_BOT] ERROR: ${e.message}`);
                })
        });
        ***/

        socket.on('freddy:music:all_set', (rid) => {
            rooms[rid].add(socket.id);
            if (rooms[rid].size >= io.sockets.adapter.rooms.get(rid).size) {
                io.to(rid).emit('freddy:music:play', true);
            }
        });

        socket.on('freddy', payload => {
            rooms[payload.rid] = new Set();
            freddy._input(payload, (data, _evt, _s) => {
                console.log(data, _evt, _s);
                switch (_s) {
                    case true:
                        io.to(payload.rid).emit(_evt, data);
                        break;

                    case false:
                        io.to(socket.id).emit(_evt, data);
                        break;
                }
            });
        })
    })
});


function init() {
    httpServer.listen(process.env.PORT || 3000, err => !err ? console.log('listening...', '\n', '[SOCKET] WEB_RTC_SIGNALING SERVICE READY AND LAUNCHED ON PORT 3000') : console.error(err));
    /*****
    freddy._input({line: '$play take on me --help'}, (data, evtName, _s) => {
        console.log(data, evtName, _s);
    });
    */
}

init();
