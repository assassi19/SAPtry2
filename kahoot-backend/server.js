const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
//changes below here...

const cors = require('cors');
const app = express();

// Use CORS middleware
app.use(cors());

// Alternatively, if you want to specify the allowed origin:
app.use(cors({
  origin: 'http://localhost:3000'  // Allow requests from localhost:3000
}));

// Your existing routes go here...

app.listen(3001, () => {
   console.log('Server is running on port 3001');
});


//changes above here...
const server = http.createServer(app);
const io = new Server(server);

let players = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', (playerName) => {
        playerName = playerName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        players.push({ id: socket.id, name: playerName, score: 0 });
        io.emit('playersUpdate', players);
    });

    socket.on('submitAnswer', (data) => {
        const player = players.find((p) => p.id === socket.id);
        if (player) {
            player.score += data.score;
            io.emit('playersUpdate', players);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        players = players.filter((player) => player.id !== socket.id);
        io.emit('playersUpdate', players);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
