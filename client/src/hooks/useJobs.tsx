import { useState, useEffect } from "react";
import type { Job } from "../types/Job";

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

        const res = await fetch("http://localhost:5000/jobs");
        const data = await res.json();

        setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return { jobs, loading, setJobs, fetchJobs };
}