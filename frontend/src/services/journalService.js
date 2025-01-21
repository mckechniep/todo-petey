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

export const deleteEntry = async (id) => {
    const token = localStorage.getItem("token");
    const res = await api.delete(`/journal/${id}`, {
        headers: { Authorization: `Bearer ${token}`},
    });
    return res.data;
};