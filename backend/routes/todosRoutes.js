import express from "express";
import { getTodos } from "../controllers/todosController.js";
import { getUserTodos } from "../controllers/todosController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Todos
 *     description: Todos management and user-specific todos
 */

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     description: Fetches all todos, supporting filtering and sorting.
 *     parameters:
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter todos assigned to a specific user.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by tags (comma-separated values).
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         required: false
 *         description: Filter by priority.
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       priority:
 *                         type: string
 *                       assignedUsers:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", getTodos);

/**
 * @swagger
 * /api/todos/user-todos:
 *   get:
 *     summary: Get todos created by a specific user
 *     tags: [Todos]
 *     description: Fetches todos created by a specific user
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the user whose todos should be fetched
 *     responses:
 *       200:
 *         description: Successfully retrieved todos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *       400:
 *         description: User query parameter is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/user-todos", getUserTodos);

export default router;
