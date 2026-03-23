import { useState, useEffect } from "react";
import type { Job } from "../types/Job";

export default function useJobs() {
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