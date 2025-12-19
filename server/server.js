// server.js (updated)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'; // <-- Import user routes
import applicationRoutes from './routes/application.js';
import courseRoutes from './routes/course.js';
import departmentRoutes from './routes/department.js'; // <-- Import department routes
import gpaRoutes from './routes/gpa.js';
import chatRoutes from './routes/chat.js';
import requestRoutes from './routes/requests.js';


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const apiRouter = express.Router();

// Define routes on the API router
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/departments', departmentRoutes);
apiRouter.use('/gpa', gpaRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/requests', requestRoutes);

// Mount the API router
app.use('/api', apiRouter); // Standard API path
app.use('/', apiRouter);    // Fallback for requests without /api prefix

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

// Only listen if not running in a Vercel serverless environment (where export is used)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;