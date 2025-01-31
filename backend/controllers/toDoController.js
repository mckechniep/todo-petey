import ToDo from "../models/toDo.js";
import Category from "../models/category.js";
import mongoose from "mongoose";

export const createToDo = async (req, res) => {
  try {
    const { title, description, category, completed } = req.body;
    const userId = req.user.id; // get userId from verified token

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    //when saving to DB, explicitly mapping fields to db schema
    //validates our fields against the schema, protects against malicious code, and more
    //we are using these destructured fields instead of (req.body)
    const newToDo = new ToDo({
      title,
      description,
      category,
      completed,
      user: userId, //creates relationship between the todo and user in the DB
    });
    
    const savedToDo = await newToDo.save();
    res.status(201).json(savedToDo);
  } catch (error) {
    console.error("Error creating ToDo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getToDos = async (req, res) => {
  try {
    const userId = req.user._id; // req.user is set via middleware (verifyToken)

     // Find all todos associated with the logged-in user
    const todos = await ToDo.find({ user: userId }).populate("category", "title");

    if (!todos) {
      return res.status(404).json({ error: "No ToDos found for this user" });;
    }
    // return the todos array
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching ToDos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getToDoById = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user.id;

    const todo = await ToDo.findById(id).populate("category", "title");

    if (!todo) {
      return res.status(404).json({ error: "ToDo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching ToDo by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editToDo = async (req, res) => {
  const { id } = req.params; // ToDo ID
  const { title, description, category, completed } = req.body; // Fields to update
  const userId = req.user.id; // User ID from token

  try {
    // Find the ToDo by ID
    const todo = await ToDo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "ToDo not found" });
    }

    // Check if the user owns the ToDo
    if (todo.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this ToDo" });
    }

    // Validate the category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
    }

    // Update the ToDo
    const updatedToDo = await ToDo.findByIdAndUpdate(
      id,
      { title, description, category, completed },
      { new: true }
    ).populate("category"); // Populate category for the response

    res.status(200).json(updatedToDo);
  } catch (error) {
    console.error("Error editing ToDo:", error);

    // Handle invalid ObjectID errors (e.g., invalid ToDo or category ID)
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteToDo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const todo = await ToDo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "ToDo not found" });
    }

    if (todo.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this ToDo" });
    }

    const result = await ToDo.deleteOne({ _id: id });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: "ToDo successfully deleted" });
    } else {
      return res.status(500).json({ error: "Failed to delete ToDo" });
    }
  } catch (error) {
    console.error("Error deleting ToDo:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
