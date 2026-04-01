import { useState } from "react";
import type { NewJob, Job } from "../types/Job";

type UseCreateJobProps = {
    onSuccess?: () => void;
}

export default function useCreateJob({ onSuccess }: UseCreateJobProps = {}) {
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

            const data = await res.json();

            onSuccess?.();

            return data;
        } finally {
            setLoading(false);
        }
    };

    return { createJob, loading};
 }