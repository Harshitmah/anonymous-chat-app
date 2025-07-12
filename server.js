const usersOnline = {}; // socket.id -> username

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'chat-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.post('/login', (req, res) => {
  const users = JSON.parse(fs.readFileSync('users.json'));
  const user = users.find(u => u.username === req.body.username);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user = user.username;
    return res.redirect('/chat');
  }
  res.send('Invalid credentials. <a href="/login">Try again</a>');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

app.post('/register', async (req, res) => {
  const users = JSON.parse(fs.readFileSync('users.json'));
  const existing = users.find(u => u.username === req.body.username);
  if (existing) return res.send('Username exists. <a href="/register">Try again</a>');

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  users.push({ username: req.body.username, password: hashedPassword });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  res.redirect('/login');
});

app.get('/chat', isAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

// New endpoint to get the logged-in username
app.get('/api/username', isAuthenticated, (req, res) => {
  res.json({ username: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// --- Socket.io logic for room-based chat and user management ---
io.on('connection', (socket) => {
  console.log('User connected');

  // Join a room
  socket.on('join room', (roomName) => {
    socket.join(roomName);
    socket.room = roomName;
  });

  // Register user and update user list in the room
  socket.on('register user', (username) => {
    usersOnline[socket.id] = username;
    if (socket.room) {
      io.to(socket.room).emit('user list', getUsersInRoom(socket.room));
      io.to(socket.room).emit('chat message', `🔔 ${username} joined`);
    }
  });

  // Group chat message
  socket.on('chat message', ({ room, message }) => {
    io.to(room).emit('chat message', message);
  });

  // Private chat message
  socket.on('private message', ({ to, message }) => {
    // Find the socket id for the recipient username
    const recipientId = Object.entries(usersOnline).find(([id, name]) => name === to)?.[0];
    if (recipientId) {
      socket.to(recipientId).emit('private message', {
        from: usersOnline[socket.id],
        message
      });
    }
  });

  // Group creation
  socket.on('create group', ({ group, members }) => {
    // Notify all members to join the group room
    Object.entries(usersOnline).forEach(([id, name]) => {
      if (members.includes(name)) {
        const s = io.sockets.sockets.get(id);
        if (s) {
          s.join(group);
          // Set the current room for the user if they are the creator
          if (name === usersOnline[socket.id]) {
            s.room = group;
          }
          s.emit('chat message', `${name === usersOnline[socket.id] ? 'You' : name} were added to group '${group}'`);
        }
      }
    });
    io.to(group).emit('user list', getUsersInRoom(group));
  });

  // Handle disconnects and update user list
  socket.on('disconnect', () => {
    const username = usersOnline[socket.id];
    const room = socket.room;
    delete usersOnline[socket.id];
    if (room) {
      io.to(room).emit('user list', getUsersInRoom(room));
      io.to(room).emit('chat message', `🔕 ${username} left`);
    }
  });
});

// Helper function to get users in a room
function getUsersInRoom(room) {
  return Object.entries(usersOnline)
    .filter(([id, _]) => {
      const s = io.sockets.sockets.get(id);
      return s && s.room === room;
    })
    .map(([_, username]) => username);
}


server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
