import api from './axios';

export const cyclesApi = {
  getCurrent: () => api.get('/cycles/current'),
  getById: (cycleId) => api.get(`/cycles/${cycleId}`),
  getGroupCycles: (groupId, params) =>
    api.get(`/groups/${groupId}/cycles`, { params }),
  create: (groupId) => api.post(`/groups/${groupId}/cycles`),
  confirmPayout: (cycleId) =>
    api.patch(`/cycles/${cycleId}/confirm-payout`),
  contribute: (cycleId, amount) =>
    api.post(`/cycles/${cycleId}/contributions`, { amount }),
};
