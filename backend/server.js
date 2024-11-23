const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/authRoutes'); // Correct import for auth routes
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

// Initialize the app and server
const app = express(); 
const server = http.createServer(app); // Create server instance
const io = new Server(server, {
    cors: {
        origin: '*', // You can modify this to restrict which domains can access the server
        methods: ['GET', 'POST']
    }
}); // Initialize socket.io with server

// Middleware
app.use(express.json()); // To parse JSON data in requests
app.use(cors()); // Enable CORS
app.use('/api/tasks', taskRoutes); // Register task routes
app.use('/api/auth', authRoutes); // Register auth routes after app is initialized

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io for real-time communication
io.on('connection', (socket) => {
    console.log('A user connected');

    // Event for client-side disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // You can add additional socket events here for specific task updates
    socket.on('sendReminder', (task) => {
        console.log('Reminder sent for task:', task);
        sendReminder(task);
    });
});

// Example reminder function to emit events to all connected clients
const sendReminder = (task) => {
    io.emit('reminder', task); // Send reminder to all connected clients
};

// Start server
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});

module.exports = { sendReminder }; // Export sendReminder function
