import api from '../api/axios';

const registrationService = {
  list: () => api.get('/registrations/').then((r) => r.data).catch(() => []),
  create: (payload) => api.post('/registrations/', payload).then((r) => r.data),
  get: (id) => api.get(`/registrations/${id}/`).then((r) => r.data),
};

export default registrationService;
