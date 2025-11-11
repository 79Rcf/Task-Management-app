import express from "express";
import  { pool } from "../config/db.js";

const router = express.Router();

// GET /posts/:id - fetch single post with comments
router.get("/:id", async (req, res) => {
    const postId = req.params.id;

    try {
        // Fetch post with its comments
        const postResult = await pool.query(
            `SELECT p.*, c.id AS comment_id, c.content AS comment_content, c.user_id AS comment_user_id, c.created_at AS comment_created_at
             FROM posts p
             LEFT JOIN comments c ON p.id = c.post_id
             WHERE p.id = $1`,
            [postId]
        );

        if (postResult.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Format response
        const postData = {
            id: postResult.rows[0].id,
            user_id: postResult.rows[0].user_id,
            title: postResult.rows[0].title,
            content: postResult.rows[0].content,
            created_at: postResult.rows[0].created_at,
            comments: postResult.rows
                .filter(r => r.comment_id)
                .map(r => ({
                    id: r.comment_id,
                    content: r.comment_content,
                    user_id: r.comment_user_id,
                    created_at: r.comment_created_at
                }))
        };

        res.json(postData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
