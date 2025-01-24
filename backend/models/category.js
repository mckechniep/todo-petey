import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;