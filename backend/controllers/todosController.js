import mongoose from "mongoose";
import Todo from "../models/todosModel.js";
import User from "../models/userModel.js";
import { Parser } from "json2csv";

// getting all the todos
export const getTodos = async (req, res) => {
  try {
    const {
      user,
      sortBy = "createdAt",
      order = "asc",
      tags,
      priority,
      assignedTo,
    } = req.query;

    let query = {};

    if (user) {
      const userData = await User.findOne({ username: user });
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      query.userId = userData._id;
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }
    if (priority) {
      query.priority = priority;
    }
    if (assignedTo) {
      const assignedUsersArray = assignedTo.split(",");
      query.assignedUsers = { $in: assignedUsersArray };
    }

    const todos = await Todo.find(query)
      .populate("userId", "username")
      .sort({
        [sortBy]: order === "asc" ? 1 : -1,
      });
    res.status(200).json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getting a todo by id
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id).populate("userId", "username");

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
      return res.status(400).json({ message: "Invalid userId format" });
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

// updating a todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userId,
      title,
      description,
      priority,
      tags,
      assignedUsers,
      completed,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID format" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this todo" });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (priority !== undefined) todo.priority = priority;
    if (tags !== undefined) todo.tags = tags;
    if (assignedUsers !== undefined) todo.assignedUsers = assignedUsers;
    if (completed !== undefined) todo.completed = completed;

    todo.updatedAt = new Date();

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// deleting a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this todo" });
    }

    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// adding the notes to todo
export const addNoteToTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, date } = req.body;

    if (!content || !date) {
      return res.status(400).json({ message: "Content and date are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid todo ID format" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.notes.push({ content, date });
    const updatedTodo = await todo.save();

    res.status(201).json(updatedTodo);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exporting the todos
export const exportTodos = async (req, res) => {
  try {
    const { format = "json" } = req.query;
    const todos = await Todo.find();

    if (format === "csv") {
      const fields = [
        "title",
        "description",
        "priority",
        "completed",
        "tags",
        "assignedUsers",
        "createdAt",
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(todos);

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="todos_export.csv"'
      );
      res.setHeader("Content-Type", "text/csv");
      return res.status(200).send(csv);
    }

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="todos_export.json"'
    );
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error exporting todos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
