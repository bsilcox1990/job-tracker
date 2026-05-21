export const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        }
    });

    const data = await res.json();

    if (!res.ok) {
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.reload();
        }
        throw new Error(data.error || "Request failed");
    }

    return data;
};