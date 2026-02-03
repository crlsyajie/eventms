import api from '../api/axios';

const authService = {
  login: (creds) => api.post('/auth/login', creds).then((r) => r.data),
  register: (data) => api.post('/auth/register', data).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export default authService;
