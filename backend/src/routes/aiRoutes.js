// backend/src/routes/aiRoutes.js

const express = require("express");
const router = express.Router();
const generateText = require("../controllers/aiController");

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-based event recommendations and chat
 */

/**
 * @swagger
 * /api/ai/query:
 *   post:
 *     summary: Generate AI event recommendations or answers
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Latest user message or question
 *               conversation:
 *                 type: array
 *                 description: Optional previous chat history
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     text:
 *                       type: string
 *           example:
 *             message: "Suggest events for this weekend in Helsinki suitable for families."
 *             conversation:
 *               - role: "user"
 *                 text: "I like outdoor events and concerts."
 *     responses:
 *       200:
 *         description: AI response with free text and optional structured data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: Natural-language answer from the AI
 *                 structured:
 *                   type: object
 *                   description: Optional structured recommendation data
 *             example:
 *               text: "Here are three family-friendly outdoor events in Helsinki this weekend..."
 *               structured:
 *                 events:
 *                   - id: "helsinki:event:123"
 *                     name: "Outdoor Family Concert"
 *                     date: "2025-12-13"
 *       400:
 *         description: Missing message in request body
 *       500:
 *         description: Failed to generate AI response
 */
router.post("/query", generateText);

module.exports = router;