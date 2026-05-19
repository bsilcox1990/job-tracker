import { useState } from "react";
import { apiFetch } from "../helpers/api";

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
            await apiFetch(`/jobs/${id}`, {
                method: "DELETE",
            });

            onSuccess?.();
        } finally {
            setDeletingId(null);
        }
    };

    return { deleteJob, deletingId};
}