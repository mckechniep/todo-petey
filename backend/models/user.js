import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    todos: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ToDo"
        }
    ],
});

const User = mongoose.model('User', userSchema);
export default User;