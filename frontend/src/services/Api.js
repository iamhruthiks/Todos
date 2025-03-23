import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

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
