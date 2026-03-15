import { useState } from "react";
import type { Job } from "../types/Job";

interface Props {
    onAdd: (job: Job) => void
}

export default function JobForm({onAdd}: Props){
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/jobs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                company,
                role,
                notes,
                status: "Applied"
            })
        });

        const newJob = await response.json();

        onAdd(newJob);
    
        setCompany("");
        setRole("");
        setNotes("");
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

            <input 
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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