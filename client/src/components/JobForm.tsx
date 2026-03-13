import { useState } from "react";
import type { Job } from "../types/Job";

interface Props {
    onAdd: (job: Job) => void
}

export default function JobForm({onAdd}: Props){
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newJob: Job = {
            id:crypto.randomUUID(),
            company,
            role,
            status: "Applied",
            dateApplied: new Date().toISOString(),
        }

        onAdd(newJob);
    
        setCompany("");
        setRole("");
    }


    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            <input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />

            <button type="submit">Add Job</button>
        </form>
    )
}