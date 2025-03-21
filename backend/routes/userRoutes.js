import express from "express";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Retrieves all users in the DB.
 *     responses:
 *       200:
 *         description: Successfully retrieved all users!
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60f7186c8e4f4b6d2e7345"
 *                   username:
 *                     type: string
 *                     example: "hruthik"
 *                   email:
 *                     type: string
 *                     example: "hruthik@gmail.com"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.get("/", getUsers);

export default router;
