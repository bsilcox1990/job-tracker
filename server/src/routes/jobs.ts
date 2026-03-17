import express from "express";
import { pool } from "../db/index";

const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const { company, role, status, notes } = req.body;

        const result = await pool.query(
            `INSERT INTO jobs (company, role, status, notes)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [company, role, status, notes]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create job"});
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM jobs ORDER BY date_applied DESC"
        );
        res.json(result.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({error: "Failed to fetch jobs"});
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    await pool.query("DELETE FROM jobs WHERE id = $1", [id]);

    res.json({ message: "Job deleted" });
})

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            "UPDATE jobs SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        res.json(result.rows[0]);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update job status" });
    }
})

export default router;