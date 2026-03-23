import { useState } from "react";
import type { NewJob, Job } from "../types/Job";

export default function useCreateJob() {
    const [loading, setLoading ] = useState(false);

    const createJob = async (job: NewJob): Promise<Job> => {
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(job),
            })

            if(!res.ok) throw new Error("Failed to create job");

            return await res.json();
        } finally {
            setLoading(false);
        }
    };

    return { createJob, loading};
 }