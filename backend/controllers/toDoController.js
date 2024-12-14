import ToDo from "../models/toDo.js";
import User from "../models/user.js";

export const createToDo = async (req, res) => {
  try {
    const { title, description, category, completed } = req.body;
    const userId = req.user.id; // get userId from verified token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
    const userId = req.user.id; // get userId from the verified token

    const todos = await ToDo.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "ToDos retrieved succsesfully",
      todos: todos,
    });
  } catch (error) {
    console.error("Error fetching ToDos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getToDoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const todo = await ToDo.findOne({ _id: id, user: userId });

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
  const { id } = req.params; //getting the To-Do ID, as we use to find toDo by ID in DB
  const { title, description, category, completed } = req.body;
  const userId = req.user.id; //User ID from token

  try {
    const todo = await ToDo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "ToDo not found" });
    }

    /* todo.user refers to MongoDB ObjectID (the field in my schema)
        that links the ToDo to the user who owns it, toString converts it to a 
        string for comparison with userId, which is extracted from JWT token*/
    if (todo.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this ToDo" });
    }

    const updatedToDo = await ToDo.findByIdAndUpdate(
      id,
      { title, description, category, completed },
      { new: true }
    );

    res.status(200).json(updatedToDo);
  } catch (error) {
    console.error("Error editing ToDo:", error);
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
