import express from "express";
import { pool } from "../config/db.js";   
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = "supersecretkey";

router.post("/", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
      // check user in DB
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const user = result.rows[0];
  
      // 🔍 DEBUG LOGS START HERE
      console.log("Plain password (from request):", password);
      console.log("Hashed password (from DB):", user.password);
  
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch);
      // 🔍 DEBUG LOGS END HERE
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
  
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
  
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
export default router;