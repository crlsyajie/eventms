import api from '../api/axios';

const eventService = {
  list: () => api.get('/events').then((r) => r.data).catch(() => []),
  create: (payload) => api.post('/events', payload).then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
};

export default eventService;
