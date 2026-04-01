import { useState } from "react";
import type { NewJob, Job } from "../types/Job";
import toast from "react-hot-toast";

interface Props {
    onCreate: (job: NewJob) => Promise<Job>;
    loading: boolean;
}

export default function JobForm({onCreate, loading}: Props){
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Creating job...");

        try {
            await onCreate({
                company,
                role,
                notes,
                status: "Applied"
        });

            toast.success("Job added!", {id: toastId});

            setCompany("");
            setRole("");
            setNotes("");

        } catch(error: any) {
            toast.error("Failed to add job", {id: toastId});
        }
    
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
                disabled={loading}
                className="!bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                {loading ? "Adding..." : "Add Job"}
            </button>
        </form>
    )
}