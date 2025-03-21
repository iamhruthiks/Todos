import mongoose from "mongoose";
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

// creating a todo
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, tags, assignedUsers, notes, userId } =
      req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let formattedAssignedUsers = [];
    if (assignedUsers && assignedUsers.length > 0) {
      const users = await User.find({ username: { $in: assignedUsers } });

      if (users.length !== assignedUsers.length) {
        return res
          .status(400)
          .json({ message: "One or more assigned users do not exist" });
      }

      formattedAssignedUsers = users.map((user) => `@${user.username}`);
    }

    const newTodo = new Todo({
      title,
      description: description || "",
      priority: priority || "low",
      completed: false,
      tags: tags || [],
      assignedUsers: formattedAssignedUsers,
      notes: notes || [],
      userId,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
