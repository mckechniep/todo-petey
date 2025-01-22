import api from './api';

export const getEntries = async (page = 1, limit = 10) => {
    const token = localStorage.getItem("token");
    const res = await api.get("/journal", {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}`},
    });
    return res.data;
};

export const getEntryById = async (id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const newEntry = async (entry) => {
    const token = localStorage.getItem("token");
    const res = await api.post("/journal", entry, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const editEntry = async (id, updatedEntry) => {
    const token = localStorage.getItem("token");
    const res = await api.put(`/journal/${id}`, updatedEntry, {
        headers: { Authorization: `Bearer ${token}`},
    });
    return res.data;
};

export const deleteEntry = async (idOrIds) => {
    const token = localStorage.getItem("token");
    const isArray = Array.isArray(idOrIds);

    if (isArray) {
        // Bulk delete: Send IDs in the body
        const res = await api.delete('/journal/bulk-delete', {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids: idOrIds }, // Pass IDs array in the body
        });
        return res.data;
    } else {
        // Single delete: Use ID in the URL
        const res = await api.delete(`/journal/${idOrIds}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    }
};

