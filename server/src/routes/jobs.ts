import express from "express";
import { pool } from "../db/index";

const router = express.Router();

router.post("/", async (req, res) => {
    try{
        const { company, role, status } = req.body;

        const result = await pool.query(
            `INSERT INTO jobs (company, role, status)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [company, role, status]
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

export default router;