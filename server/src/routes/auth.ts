import { Router } from 'express';
import { pool } from '../db/index';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config';

const router = Router();

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email`,
            [email, hashedPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.status(201).json({ 
            token,
            user: {
                id: user.id,
                email: user.email
            }
         });
    } catch (err: any) {

        if (err.code === '23505') {
            return res.status(400).json({ error: "User already in use" });
        }

        console.error(err);
        res.status(500).json({ error: "Failed to register user" });
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )

        const user = result.rows[0];

        if(!user) {
            return res.status(400).json({ error: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch) {
            return res.status(400).json({ error: "Invalid credentials"});
        }

        const token = jwt.sign(
            { userId: user.id},
            JWT_SECRET,
            { expiresIn: "1d"}
        )

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to login"});
    }
})

export default router;