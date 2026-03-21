import { useState } from "react";
import type { Job } from "../types/Job";

type UseUpdateJobReturn = {
    updateJob: (job: Job) => Promise<Job>;
    loading: boolean;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useUpdateJob(): UseUpdateJobReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateJob = async (job: Job): Promise<Job>=> {
        setLoading(true);
        setError(null);

        try{
            const res = await fetch(`http://localhost:5000/jobs/${job.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(job),
            });

            if(!res.ok) {
                throw new Error("Failed to update job");
            }

            const data = await res.json();
            return data;
        } catch (err: any) {
            setError(err.message || "Failed to update job");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateJob, loading, error, setError };
}