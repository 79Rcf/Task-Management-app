import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import paginate from "express-paginate";

const router = express.Router();

// GET /posts - pagination
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || req.query.limit || 10;
        const offset = parseInt(req.query.offset) || 0;

        const [postsResult, countResult] = await Promise.all([
            pool.query("SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2", [limit, offset]),
            pool.query("SELECT COUNT(*) FROM posts")
        ]);

        const itemCount = parseInt(countResult.rows[0].count);
        const pageCount = Math.ceil(itemCount / limit);

        res.json({
            object: "list",
            has_more: paginate.hasNextPages(req)(pageCount),
            pageCount,
            itemCount,
            posts: postsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST /posts - create new post (auth required)
router.post("/", verifyToken, async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, title, content]
        );

        res.status(201).json({ message: "Post created", post: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
