    const express = require('express'); //api that handles peer to peer connection
    const app = express();
    const server = require('http').Server(app);
    const io = require('socket.io')(server);
    const { v4 : uuidv4 } = require('uuid'); //imports uuid library
    const { ExpressPeerServer } = require('peer'); //imports peer
    const peerServer = ExpressPeerServer(server, { //peerServer
        debug: true
    });
    app.set('view engine', 'ejs'); //parses ejs file for display 
    app.use(express.static('public')); //reference public folder

    app.use('/peerjs', peerServer); //references peer
    app.get('/',(req,res) => {
        res.redirect(`/${uuidv4()}`); //over here, we go to local host 3030 which automatically produces unique id, and it will auto redirect us to it
    })

    /*app.get('/',(req,res) => {
        res.render('room'); //renders room file
    })//what url are we living on? 

    FIRST ITERATION FOR ROOM TESTING*/

    app.get('/:room', (req, res) => {
        res.render('room', {roomId: req.params.room})
    })//room is a parameter

    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId) =>{
            //console.log("joined room")
            socket.join(roomId); //joins room from specific room id, we now have to tell that a user is connected
            socket.to(roomId).broadcast.emit('user-connected', userId);
            socket.on('message',message => { //listens for a message
                io.to(roomId).emit('createMessage', message) //sends input message to the room
            })
        })
    })//when we visit a site, we join a room. We inform the socket that we have joined the room. receives from socket.emit


    server.listen(process.env.PORT || 3030); //local host at 3030 or it can work on heroku server

    // server.listen(process.env.PORT || 3000);
    // app.listen(port_number);