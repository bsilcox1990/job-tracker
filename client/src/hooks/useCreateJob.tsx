import { useState } from "react";
import type { NewJob, Job } from "../types/Job";
import { apiFetch } from "../helpers/api";

type UseCreateJobProps = {
    onSuccess?: () => void;
}

export default function useCreateJob({ onSuccess }: UseCreateJobProps = {}) {
    const [loading, setLoading ] = useState(false);

    const createJob = async (job: NewJob): Promise<Job> => {
        setLoading(true);

        try {
            const data = await apiFetch("/jobs", {
                method: "POST",
                body: JSON.stringify(job),
            });

            onSuccess?.();

            return data;
        } finally {
            setLoading(false);
        }
    };

    return { createJob, loading};
 }