import express from "express";
import  { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.delete("/:id", verifyToken, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;

    try {
        
        const comment = await pool.query("SELECT * FROM comments WHERE id = $1", [commentId]);

        if (comment.rows.length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        
        if (comment.rows[0].user_id !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        
        await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("COMMENT DELETE ERROR:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
