import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FiCopy,
  FiTrash2,
  FiLogOut,
  FiPlay,
  FiUsers,
  FiRefreshCw,
} from 'react-icons/fi';
import { groupsApi } from '../api/groups';
import { cyclesApi } from '../api/cycles';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal, { ModalActions } from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { PageLoader } from '../components/Loader';
import Alert from '../components/Alert';
import Badge from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import {
  formatCurrency,
  formatDate,
  getErrorMessage,
  getId,
  isGroupCreator,
  isActiveMember,
  getActiveMembers,
  getInitials,
} from '../utils/format';
import { FREQUENCY_LABELS } from '../utils/constants';

export default function GroupDetail() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [leaveRequest, setLeaveRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [copied, setCopied] = useState(false);

  const isCreator = String(getId(group?.createdBy)) === String(getId(user));
  const isMember = isActiveMember(group, getId(user));

  const fetchGroup = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await groupsApi.getById(groupId);
      setGroup(data.data.group);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    if (!group || !user) return;

    const loadRequests = async () => {
      try {
        const creatorMatch = String(getId(group.createdBy)) === String(getId(user));
        console.debug('GroupDetail: loadRequests', { groupId, creatorMatch, groupCreatedBy: getId(group.createdBy), userId: getId(user) });
        if (creatorMatch) {
          const reqRes = await groupsApi.getLeaveRequests(groupId);
          setLeaveRequests(reqRes.data.data.requests || []);
          } else if (isActiveMember(group, getId(user))) {
          const myReq = await groupsApi.getMyLeaveRequest(groupId);
          setLeaveRequest(myReq.data.data.leaveRequest || null);
        }
      } catch (err) {
        // Ignore individual request errors but surface if group fetch failed earlier
        // Set empty states to avoid indefinite loading
        setLeaveRequests([]);
        setLeaveRequest(null);
      }
    };

    loadRequests();
  }, [group, user, groupId]);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartCycle = async () => {
    setActionError('');
    setActionLoading(true);
    try {
      const { data } = await cyclesApi.create(groupId);
      navigate(`/groups/${groupId}/cycles/${data.data.cycle._id}`);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveRequest = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionLoading(true);
    try {
      await groupsApi.createLeaveRequest(groupId, leaveReason);
      setShowLeaveModal(false);
      setLeaveReason('');
      fetchGroup();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveLeave = async (requestId) => {
    setActionError('');
    setActionLoading(true);
    if (getId(group?.createdBy) !== getId(user)) {
      setActionError('Only the group creator can approve leave requests.');
      setActionLoading(false);
      return;
    }
    try {
      await groupsApi.approveLeaveRequest(requestId);
      fetchGroup();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await groupsApi.delete(groupId);
      navigate('/groups');
    } catch (err) {
      setActionError(getErrorMessage(err));
      setShowDeleteConfirm(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;
  if (!group) return null;

  const activeMembers = getActiveMembers(group);
  // Normalize leaveRequests shape: API may return an object { requests: [...] } or an array
  const pendingLeaveRequests = Array.isArray(leaveRequests)
    ? leaveRequests
    : (leaveRequests && leaveRequests.requests) || [];

  return (
    <div className="space-y-6">
      {actionError && <Alert message={actionError} onDismiss={() => setActionError('')} />}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {group.name}
              </h2>
              <StatusBadge status={group.status} type="group" />
            </div>
            {group.description && (
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {group.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {isCreator && group.status === 'active' && (
              <Button onClick={handleStartCycle} loading={actionLoading}>
                <FiPlay className="h-4 w-4" />
                Start Cycle
              </Button>
            )}
            <Link to={`/groups/${groupId}/cycles`}>
              <Button variant="outline">
                <FiRefreshCw className="h-4 w-4" />
                View Cycles
              </Button>
            </Link>
            {isCreator && group.status !== 'completed' && (
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                <FiTrash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            {isMember && !isCreator && !leaveRequest && (
              <Button variant="outline" onClick={() => setShowLeaveModal(true)}>
                <FiLogOut className="h-4 w-4" />
                Request to Leave
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Contribution</p>
            <p className="mt-1 font-semibold">{formatCurrency(group.contributionAmount)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Frequency</p>
            <p className="mt-1 font-semibold">{FREQUENCY_LABELS[group.contributionFrequency]}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Members</p>
            <p className="mt-1 font-semibold">{activeMembers.length} / {group.maxMembers}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Invite Code</p>
            <div className="mt-1 flex items-center gap-2">
              {isCreator ? (
                <>
                  <code className="font-mono font-semibold">{group.inviteCode}</code>
                  <button
                    type="button"
                    onClick={copyInviteCode}
                    className="rounded p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-navy-700"
                    aria-label="Copy invite code"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                  {copied && <Badge color="emerald">Copied!</Badge>}
                </>
              ) : (
                <p className="text-sm text-slate-500">Admin only</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {leaveRequest && (
        <Alert
          variant="info"
          message={`Your leave request is ${leaveRequest.status}.`}
        />
      )}

      <Card>
        <CardHeader
          title="Members"
          description={`${activeMembers.length} active members`}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="pb-3 pr-4 font-medium">Member</th>
                <th className="pb-3 pr-4 font-medium">Joined</th>
                <th className="pb-3 pr-4 font-medium">Payout Received</th>
                <th className="pb-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {activeMembers.map((member) => (
                <tr key={getId(member.user)} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                        {getInitials(member.user?.name)}
                      </div>
                      <div>
                        <p className="font-medium">{member.user?.name}</p>
                        <p className="text-xs text-slate-500">{member.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{formatDate(member.joinedAt)}</td>
                  <td className="py-3 pr-4">
                    {member.hasReceivedPayout ? (
                      <Badge color="emerald">Yes</Badge>
                    ) : (
                      <Badge color="slate">No</Badge>
                    )}
                  </td>
                  <td className="py-3">
                    {getId(group.createdBy) === getId(member.user) ? (
                      <Badge color="blue">Creator</Badge>
                    ) : (
                      <Badge color="slate">Member</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isCreator && (
        <Card>
          <CardHeader title="Pending Leave Requests" />
          <div className="space-y-3">
            {pendingLeaveRequests.length > 0 ? (
              pendingLeaveRequests.map((req) => (
                <div
                  key={req._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div>
                    <p className="font-medium">{req.member?.name}</p>
                    {req.reason && (
                      <p className="mt-1 text-sm text-slate-500">{req.reason}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApproveLeave(req._id)}
                    loading={actionLoading}
                  >
                    Approve
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-slate-500">No pending leave requests.</div>
            )}
          </div>
        </Card>
      )}

      {group.payoutOrder?.length > 0 && (
        <Card>
          <CardHeader
            title="Payout Order"
            description="Current rotation for this group"
          />
          <div className="space-y-2">
            {group.payoutOrder.map((member, index) => {
              const memberId = getId(member);
              const isCurrent = index === group.currentPayoutIndex;
              const isPast = index < group.currentPayoutIndex;
              return (
                <div
                  key={memberId}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                    isCurrent
                      ? 'bg-emerald-50 dark:bg-emerald-900/20'
                      : 'bg-slate-50 dark:bg-navy-800'
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white dark:bg-navy-700">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                  </div>
                  {isCurrent && <Badge color="emerald">Current</Badge>}
                  {isPast && <Badge color="slate">Received</Badge>}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal
        open={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Request to Leave Group"
        footer={
          <ModalActions
            onCancel={() => setShowLeaveModal(false)}
            onConfirm={() => document.getElementById('leave-form').requestSubmit()}
            confirmText="Submit Request"
            loading={actionLoading}
          />
        }
      >
        {actionError && <div className="mb-4"><Alert message={actionError} /></div>}
        <form id="leave-form" onSubmit={handleLeaveRequest}>
          <Input
            label="Reason (optional)"
            maxLength={500}
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Group"
        message="This action cannot be undone. The group will be permanently deleted."
        confirmText="Delete Group"
        loading={actionLoading}
        danger
      />
    </div>
  );
}
