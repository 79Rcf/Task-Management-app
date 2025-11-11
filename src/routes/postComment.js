import express from "express";
import  { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();


router.get("/:id/comments", async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);
        if (post.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = await pool.query(
            `SELECT c.id, c.content, c.created_at, u.username 
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );

        res.json({
            postId,
            totalComments: comments.rows.length,
            comments: comments.rows
        });
    } catch (err) {
        console.error("COMMENTS FETCH ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



router.post("/:id/comments", verifyToken, async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id; // from JWT token

    if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Comment content is required" });
    }

    try {
        // Check if post exists
        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);
        if (post.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Insert comment
        const newComment = await pool.query(
            `INSERT INTO comments (post_id, user_id, content) 
             VALUES ($1, $2, $3) 
             RETURNING id, content, created_at`,
            [postId, userId, content]
        );

        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment.rows[0]
        });
    } catch (err) {
        console.error("COMMENT ADD ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
