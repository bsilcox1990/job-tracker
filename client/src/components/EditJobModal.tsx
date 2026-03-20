import type { Job } from "../types/Job"
import { useState, useEffect } from "react";

type Props = {
    job: Job;
    onClose: () => void;
    onSave: (updatedJob: Job) => void;
    loading: boolean;
}

export default function EditJobModal({job, onClose, onSave, loading}: Props){
    const [form, setForm] = useState({...job, notes: job.notes || ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async () => {
        const res = await fetch(`http://localhost:5000/jobs/${job.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        onSave(data);
        onClose();
    }

    useEffect(() => {
        setForm({...job, notes: job.notes || ""})
    }, [job]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    return(
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onKeyDown={(e) => { if(e.key === "Enter") { handleSubmit() }}}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn space-y-3"
                onClick={(e) => e.stopPropagation()}
            >

                <h2 className="text-xl font-semibold mb-4">Edit Job</h2>

                <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    placeholder="Company"
                />
                <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    placeholder="Role"
                />
                <textarea 
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    placeholder="Notes"
                />
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                </select>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        disabled={loading} 
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}