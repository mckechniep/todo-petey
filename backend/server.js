import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/userRoutes.js";
import toDoRouter from "./routes/toDoRoutes.js";


// Load environment variables 
dotenv.config(); // reads .env file, converts key-value pairs into JS environment variables, adds these variables to process.env, a global Node.js object

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // enables cross-origin resource sharing
app.use(express.json()); //  parses incoming JSON requests


app.use('/api/users', usersRouter)
app.use('/api/todos', toDoRouter);

const MONGO_URI = process.env.MONGO_URI;


// Connecting to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Connection error:', err));


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});