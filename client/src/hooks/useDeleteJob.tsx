import { useState } from "react";

type UseDeleteJobReturn = {
    deleteJob: (id: number) => Promise<void>;
    deletingId: number | null;
}

type UseDeleteJobProps = {
    onSuccess?: () => void;
}

export default function useDeleteJob({ onSuccess }: UseDeleteJobProps = {}): UseDeleteJobReturn {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const deleteJob = async (id: number) => {
        setDeletingId(id);

        try {
            const res = await fetch(`http://localhost:5000/jobs/${id}`, {
                method: "DELETE",
            });

            if(!res.ok) throw new Error("Failed to delete job");

            onSuccess?.();
        } finally {
            setDeletingId(null);
        }
    };

    return { deleteJob, deletingId};
}