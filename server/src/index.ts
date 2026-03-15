import express from "express";
import cors from "cors";
import { initDB } from "./db/init";
import jobsRouter from "./routes/jobs";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/jobs", jobsRouter);

const PORT = 5000;

async function startServer(){
    await initDB()

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}

startServer();