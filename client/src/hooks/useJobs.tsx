import { useState, useEffect } from "react";
import type { Job } from "../types/Job";
import { apiFetch } from "../helpers/api";

type UseJobsReturn = {
    jobs: Job[];
    loading: boolean;
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    fetchJobs: () => Promise<void>;
}

export default function useJobs(): UseJobsReturn {
    const [jobs, setJobs] = useState<Job []>([]);
    const [loading, setLoading] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);

        try {
            const data = await apiFetch("/jobs");
            setJobs(data);
        } catch (err) {
            console.error(err);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchJobs();
    }, []);

    return { jobs, loading, setJobs, fetchJobs };
}