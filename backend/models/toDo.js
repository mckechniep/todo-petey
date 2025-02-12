import mongoose from "mongoose";


const ToDoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "Enter a description here"},
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const ToDo = mongoose.model('ToDo', ToDoSchema);
export default ToDo;
