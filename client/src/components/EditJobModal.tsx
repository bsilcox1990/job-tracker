import type { Job } from "../types/Job"
import { useState, useEffect } from "react";

type Props = {
    job: Job;
    onClose: () => void;
    onSave: (updatedJob: Job) => void;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditJobModal({job, onClose, onSave, loading, setLoading}: Props){
    const [form, setForm] = useState({...job, notes: job.notes || ""});

    const buttonStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
    const saveButton = `${buttonStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed !bg-blue-600`
    const cancelButton = `${buttonStyles} bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-gray-400 active:scale-95 !bg-white`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
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
        } catch (error) {
            console.error("Failed to update job", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setForm({...job, notes: job.notes || ""})
    }, [job]);

    return(
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn space-y-3"
                onClick={(e) => e.stopPropagation()}
            >

                <form
                    onSubmit={handleSubmit}
                    className="space-y-3" 
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
                            type="button"
                            onClick={onClose}
                            className={cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={saveButton}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}