import api from './axios';

export const groupsApi = {
  create: (data) => api.post('/groups/create-group', data),
  getAll: (params) => api.get('/groups', { params }),
  getById: (groupId) => api.get(`/groups/${groupId}`),
  join: (inviteCode) => api.post('/groups/join', { inviteCode }),
  delete: (groupId) => api.delete(`/groups/${groupId}/delete`),
  createLeaveRequest: (groupId, reason) =>
    api.post(`/groups/${groupId}/leave-request`, { reason }),
  getLeaveRequests: (groupId) =>
    api.get(`/groups/${groupId}/leave-requests`),
  getMyLeaveRequest: (groupId) =>
    api.get(`/groups/${groupId}/leave-request`),
  approveLeaveRequest: (requestId) =>
    api.patch(`/groups/leave-requests/${requestId}/approve`),
};
