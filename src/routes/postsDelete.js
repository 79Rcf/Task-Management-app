import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// DELETE /posts/:id - delete a post and its comments
router.delete("/:id", verifyToken, async (req, res) => {
    const postId = req.params.id;

    try {
        // Check if post exists and belongs to the user
        const existingPost = await pool.query(
            "SELECT * FROM posts WHERE id = $1 AND user_id = $2",
            [postId, req.user.id]
        );

        if (existingPost.rows.length === 0) {
            return res.status(404).json({ message: "Post not found or not owned by you" });
        }

        // Delete comments associated with the post
        await pool.query("DELETE FROM comments WHERE post_id = $1", [postId]);

        // Delete the post itself
        await pool.query("DELETE FROM posts WHERE id = $1", [postId]);

        res.json({ message: "Post and associated comments deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
