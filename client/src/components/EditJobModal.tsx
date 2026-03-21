import type { Job } from "../types/Job"
import { useState, useEffect } from "react";
import { useUpdateJob } from "../hooks/useUpdateJob";

type Props = {
    job: Job;
    onClose: () => void;
    onSave: (updatedJob: Job) => void;
}

export default function EditJobModal({job, onClose, onSave }: Props){
    const [form, setForm] = useState({...job, notes: job.notes || ""});
    const { updateJob, loading, error, setError } = useUpdateJob();

    const buttonStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
    const saveButton = `${buttonStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed !bg-blue-600`
    const cancelButton = `${buttonStyles} bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-gray-400 active:scale-95 !bg-white`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const updated = await updateJob(form);
            onSave(updated);
            onClose();
        } catch (error) {
            console.error(error);
        }

        
    }

    useEffect(() => {
        setForm({...job, notes: job.notes || ""})
    }, [job]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [onClose, loading]);

    return(
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
                if (!loading) onClose();
            }}
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

                    {error && (
                        <div className="flex justify-between items-center bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm">
                            <span>{error}</span>
                            <button 
                                className="cursor-pointer" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setError(null);
                                }}>X</button>
                        </div>
                    )

                    }

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