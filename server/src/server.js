const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
// We will initialize socket.io here later

dotenv.config();

const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
require('./sockets/videoHandler')(io);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Angelina AI Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
