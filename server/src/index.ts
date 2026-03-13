import express from "express";
import cors from "cors";
import { initDB } from "./db/init";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Job Tracker API running");
})

const PORT = 5000;

async function startServer(){
    await initDB()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}

startServer();