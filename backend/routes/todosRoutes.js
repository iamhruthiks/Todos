import express from "express";
import { getTodos } from "../controllers/todosController.js";
import { getTodoById } from "../controllers/todosController.js";
import { createTodo } from "../controllers/todosController.js";
import { updateTodo } from "../controllers/todosController.js";
import { deleteTodo } from "../controllers/todosController.js";
import { addNoteToTodo } from "../controllers/todosController.js";
import { exportTodos } from "../controllers/todosController.js";

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
 *         name: user
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter todos created by a specific user.
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
 * /api/todos/export:
 *   get:
 *     summary: Export all todos
 *     tags:
 *       - Todos
 *     description: Exports all todos in JSON or CSV format.
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *         required: false
 *         description: |
 *           The export format (default: JSON).
 *     responses:
 *       200:
 *         description: Successfully exported todos
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
 *                       description:
 *                         type: string
 *                       priority:
 *                         type: string
 *                       completed:
 *                         type: boolean
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       assignedUsers:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/export", exportTodos);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a specific todo by id
 *     tags: [Todos]
 *     description: Fetches a single todo by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo to fetch.
 *     responses:
 *       200:
 *         description: Successfully retrieved the todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 assignedUsers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 notes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                       date:
 *                         type: string
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getTodoById);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     description: Creates a new todo and associates it with the current user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the todo.
 *               description:
 *                 type: string
 *                 description: A description of the todo.
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Priority level of the todo.
 *                 example: "high"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the todo.
 *                 example: ["work", "urgent"]
 *               assignedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of usernames assigned to this todo.
 *                 example: ["hruthik", "alice"]
 *               notes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Note content.
 *                       example: "Remember to add validation"
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: Date of the note (YYYY-MM-DD format).
 *                       example: "2025-03-25"
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the todo.
 *                 example: "67dcfef8d3093b0a3e0c53a1"
 *     responses:
 *       201:
 *         description: Successfully created todo
 *       400:
 *         description: Missing required fields or invalid assigned users
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/", createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update an existing todo
 *     tags:
 *       - Todos
 *     description: Allows partial updates to a todo but does not allow modifying notes.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Task Title"
 *               description:
 *                 type: string
 *                 example: "Updated task description"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               completed:
 *                 type: boolean
 *                 example: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["urgent", "work"]
 *               assignedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["@hruthik", "@alice"]
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the request.
 *                 example: "67dcfef8d3093b0a3e0c53a1"
 *     responses:
 *       200:
 *         description: Successfully updated the todo
 *       400:
 *         description: Missing required fields or invalid request
 *       403:
 *         description: User is not authorized to edit this todo
 *       404:
 *         description: Todo or user not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags:
 *       - Todos
 *     description: Deletes a todo while ensuring only the creator can delete it.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo to delete.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user making the request.
 *                 example: "67dcfef8d3093b0a3e0c53a1"
 *     responses:
 *       200:
 *         description: Successfully deleted the todo
 *       400:
 *         description: Invalid todo ID or userId
 *       403:
 *         description: User is not authorized to delete this todo
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteTodo);

/**
 * @swagger
 * /api/todos/{id}/notes:
 *   post:
 *     summary: Add a note to a specific todo
 *     tags:
 *       - Todos
 *     description: Adds a note to a specific todo.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the todo to add a note to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - date
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Remember to review the code"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-26"
 *     responses:
 *       201:
 *         description: Successfully added the note
 *       400:
 *         description: Missing content or date
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/notes", addNoteToTodo);

export default router;
