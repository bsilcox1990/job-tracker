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
        <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
            <input
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
            />

            <input
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
            />

            <button 
                type="submit"
                className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Add Job
            </button>
        </form>
    )
}