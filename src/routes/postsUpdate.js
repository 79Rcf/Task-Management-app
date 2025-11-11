import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUT /posts/:id - update a post (partial updates allowed)
router.put("/:id", verifyToken, async (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;

    try {
        // Check if post exists and belongs to user
        const existingPost = await pool.query(
            "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
            [postId, req.user.id]
        );

        if (existingPost.rows.length === 0) {
            return res.status(404).json({ message: "Post not found or not owned by you" });
        }

        // Build the update query dynamically (partial updates)
        const updatedTitle = title || existingPost.rows[0].title;
        const updatedContent = content || existingPost.rows[0].content;

        const updatedPost = await pool.query(
            "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [updatedTitle, updatedContent, postId]
        );

        res.json({ message: "Post updated successfully", post: updatedPost.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
