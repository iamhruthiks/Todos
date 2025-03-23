import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const fetchAllTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/todos`);
    return response.data.todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};
