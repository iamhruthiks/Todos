import Todo from "../models/todosModel.js";

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
