import Todo from "../models/todosModel.js";
import User from "../models/userModel.js";

// getting all the todos
export const getTodos = async (req, res) => {
  try {
    const {
      sortBy = "createdAt",
      order = "desc",
      tags,
      priority,
      assignedTo,
    } = req.query;

    // Build query based on filters
    let query = {}; // By default, fetch all todos

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (priority) {
      query.priority = priority;
    }

    if (assignedTo) {
      query.assignedUsers = { $in: [assignedTo] };
    }

    const todos = await Todo.find(query).sort({
      [sortBy]: order === "asc" ? 1 : -1,
    });

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getting todos for the specific user( todos which are created by the specific user)
export const getUserTodos = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res
        .status(400)
        .json({ message: "User query parameter is required" });
    }

    const userData = await User.findOne({ username: user });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const todos = await Todo.find({ userId: userData._id });

    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching user todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getting a todo by id
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
