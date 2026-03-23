import { useState } from "react";

export default function useDeleteJob() {
    const [loading, setLoading] = useState(false);

    const deleteJob = async (id: number) => {
        setLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/jobs/${id}`, {
                method: "DELETE",
            });

            if(!res.ok) throw new Error("Failed to delete job");
        } finally {
            setLoading(false);
        }
    };

    return { deleteJob, loading};
}