export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

export function getId(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value._id || value.id || null;
}

export function isGroupCreator(group, userId) {
  return getId(group?.createdBy) === userId;
}

export function isActiveMember(group, userId) {
  return group?.members?.some(
    (m) => getId(m.user) === userId && m.isActive !== false
  );
}

export function getActiveMembers(group) {
  return group?.members?.filter((m) => m.isActive !== false) || [];
}

export function getContributionProgress(cycle) {
  if (!cycle?.memberCount) return 0;
  return Math.round((cycle.contributorCount / cycle.memberCount) * 100);
}
