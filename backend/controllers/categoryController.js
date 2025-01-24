import Category from "../models/category.js";

export const createCategory = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;
    

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const existingCategory = await Category.findOne({ title, user:  userId });
    if (existingCategory) {
        return res.status(409).json({ error: "Category already exists" });
    }

    const category = new Category({ title, user: userId })
    await category.save();

    res.status(201).json(category)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
};

export const getCategories = async (req, res) => {
    try {
        const userId = req.user.id; 

        const categories = await Category.find({ user: userId });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

export const editCategory = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        if (category.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this category" });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error editing ToDo:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        if (category.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this category" });
        }

        const result = await Category.deleteOne({ _id: id });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Category deleted" });
        } else {
            return res.status(500).json({ error: "Failed to delete Category" });
        }
    } catch (error) {
        console.error("Error deleting category", error);
        res.status(500).json({ error: "Internal server error" });
    }
};