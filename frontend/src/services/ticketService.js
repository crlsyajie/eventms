import api from '../api/axios';

const ticketService = {
  list: () => api.get('/tickets/').then((r) => r.data).catch(() => []),
  get: (id) => api.get(`/tickets/${id}/`).then((r) => r.data),
};

export default ticketService;
