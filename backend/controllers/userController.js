import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email");
    res.status(200).json(users);
  } catch (error) {
    console.error("error fetching users:", error);
    res.status(500).json({ message: "internal server error" });
  }
};
