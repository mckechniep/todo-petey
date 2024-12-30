import api from './api';

export const saveCalendarEvent = async (eventData) => {
    const token = localStorage.getItem("token");
    const res = await api.post('/calendar/events', eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    return res.data;
};

export const getCalendarEvents = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get('/calendar/events', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const updateCalendarEvent = async (id, eventData) => {
    const token = localStorage.getItem("token");
    const res = await api.put(`/calendar/events/${id}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const deleteCalendarEvent = async (id) => {
    const token = localStorage.getItem("token");
    const res = await api.delete(`/calendar/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}
