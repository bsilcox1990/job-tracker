import { Pool } from "pg";

export const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "jobtracker"
})

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("DB connection error", err ))