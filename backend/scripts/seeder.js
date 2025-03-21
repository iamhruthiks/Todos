import "dotenv/config";
import User from "../models/userModel.js";
import Todo from "../models/todosModel.js";
import connectDB from "../config/db.js";

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing users and todos from DB
    await User.deleteMany();
    await Todo.deleteMany();

    // Sample users
    const users = await User.insertMany([
      { username: "hruthik", email: "hruthik@gmail.com" },
      { username: "colt", email: "colt@gmail.com" },
      { username: "mike", email: "mike@gmail.com" },
      { username: "alice", email: "alice@gmail.com" },
      { username: "charlie", email: "charlie@gmail.com" },
    ]);

    // Sample todos
    const todos = [
      {
        title: "Complete building the todos app",
        description: "Finish implementing all required features",
        priority: "high",
        completed: false,
        tags: ["work", "coding"],
        assignedUsers: ["@colt", "@mike"],
        notes: [
          { content: "Remember to add error handling", date: "2025-03-21" },
        ],
        userId: users[0]._id,
        createdAt: new Date("2025-03-18T12:00:00Z"),
      },
      {
        title: "Test the application",
        description: "Test the app with the required tools",
        priority: "medium",
        completed: false,
        tags: ["testing", "coding"],
        assignedUsers: ["@alice", "@charlie"],
        notes: [{ content: "Write Test cases", date: "2025-03-21" }],
        userId: users[1]._id,
        createdAt: new Date("2025-03-19T10:30:00Z"),
      },
      {
        title: "Deploy the application",
        description: "Deploy the application in AWS EC2 instance",
        priority: "low",
        completed: true,
        tags: ["deployment", "coding"],
        assignedUsers: ["@mike"],
        notes: [
          { content: "Create docker image for deployment", date: "2025-03-22" },
        ],
        userId: users[2]._id,
        createdAt: new Date("2025-03-20T08:15:00Z"),
      },
      {
        title: "Monitoring the application",
        description: "Add GA4 to monitor the application",
        priority: "high",
        completed: false,
        tags: ["monitoring"],
        assignedUsers: ["@charlie"],
        notes: [
          {
            content: "Implement GA4 for monitoring the application",
            date: "2025-03-23",
          },
        ],
        userId: users[3]._id,
        createdAt: new Date("2025-03-21T14:45:00Z"),
      },
      {
        title: "SEO",
        description: "Implement SEO",
        priority: "medium",
        completed: false,
        tags: ["SEO"],
        assignedUsers: ["@hruthik"],
        notes: [
          {
            content: "Add necessary meta tags and keywords for SEO",
            date: "2025-03-24",
          },
        ],
        userId: users[4]._id,
        createdAt: new Date("2025-03-22T16:30:00Z"),
      },
    ];

    // insert todos into DB
    await Todo.insertMany(todos);
    console.log("users and todos seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("error seeding data:", error);
    process.exit(1);
  }
};

seedData();
