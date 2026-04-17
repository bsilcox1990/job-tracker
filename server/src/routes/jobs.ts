import express from "express";
import { pool } from "../db/index";
import { authMiddleware } from "../middleware/auth"

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try{
        const { company, role, status, notes } = req.body;

        const userId = (req as any).user.userId;

        const result = await pool.query(
            `INSERT INTO jobs (company, role, status, notes, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [company, role, status, notes, userId]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create job"});
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const result = await pool.query(
            "SELECT * FROM jobs WHERE user_id = $1 ORDER BY date_applied DESC",
            [userId]
        )
        res.json(result.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch jobs"});
    }
})

router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    await pool.query(
        "DELETE FROM jobs WHERE id = $1 AND user_id = $2", 
        [id, userId]);

    res.json({ message: "Job deleted" });
})

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { company, role, status, notes } = req.body;
        const userId = (req as any).user.userId;

        const result = await pool.query(
            `UPDATE jobs
            SET company=$1, role=$2, status=$3, notes=$4, updated_at=NOW()
            WHERE id=$5 ANd user_id=$6
            RETURNING *`,
            [company, role, status, notes ?? null, id, userId]
        );

        res.json(result.rows[0]);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update job status" });
    }
})

export default router;