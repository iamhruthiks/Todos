import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

// featch all the users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// featch all the todos with optinal sorting and filtering
export const fetchAllTodos = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/todos?${queryParams}`);
    return response.data.todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

// featch a todo by id
export const fetchTodoById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todo details:", error);
    return null;
  }
};

// creating a new todo
export const createTodo = async (todoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    return null;
  }
};

// update a todo by id
export const updateTodo = async (id, updatedData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/todos/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
};

// delete a todo
export const deleteTodo = async (id, userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/todos/${id}`, {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return null;
  }
};

// adding a note to todo
export const addNoteToTodo = async (id, noteData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/todos/${id}/notes`,
      noteData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding note to todo:", error);
    return null;
  }
};

// exporting the the todos
export const exportTodos = async (format) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/todos/export?format=${format}`,
      {
        responseType: format === "csv" ? "blob" : "json",
      }
    );

    let blob;
    if (format === "csv") {
      blob = new Blob([response.data], { type: "text/csv" });
    } else {
      const jsonString = JSON.stringify(response.data, null, 2);
      blob = new Blob([jsonString], { type: "application/json" });
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error exporting todos:", error);
  }
};
