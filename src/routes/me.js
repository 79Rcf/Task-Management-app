import express from "express";
import  { pool } from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {

    try { 
    const result = await pool.query("SELECT ID, username, email FROM users WHERE id = $1", [req.user.id]);

    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json({ user: result.rows[0] });
     } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
     }
});

export default router;