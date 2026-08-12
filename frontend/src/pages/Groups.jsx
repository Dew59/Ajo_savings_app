import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { groupsApi } from '../api/groups';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal, { ModalActions } from '../components/Modal';
import { PageLoader } from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import {
  formatCurrency,
  getErrorMessage,
  getActiveMembers,
} from '../utils/format';
import { FREQUENCY_LABELS } from '../utils/constants';

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    contributionFrequency: 'monthly',
    maxMembers: '',
  });
  const [inviteCode, setInviteCode] = useState('');

  const fetchGroups = () => {
    setLoading(true);
    groupsApi
      .getAll({ limit: 50 })
      .then(({ data }) => setGroups(data.data.groups))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await groupsApi.create({
        ...createForm,
        contributionAmount: Number(createForm.contributionAmount),
        maxMembers: Number(createForm.maxMembers),
      });
      setShowCreate(false);
      setCreateForm({
        name: '',
        description: '',
        contributionAmount: '',
        contributionFrequency: 'monthly',
        maxMembers: '',
      });
      fetchGroups();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await groupsApi.join(inviteCode);
      setShowJoin(false);
      setInviteCode('');
      fetchGroups();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {error && <Alert message={error} />}

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => { setFormError(''); setShowCreate(true); }}>
          <FiPlus className="h-4 w-4" />
          Create Group
        </Button>
        <Button variant="outline" onClick={() => { setFormError(''); setShowJoin(true); }}>
          Join with Invite Code
        </Button>
      </div>

      {groups.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <Link key={group._id} to={`/groups/${group._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {group.name}
                  </h3>
                  <StatusBadge status={group.status} type="group" />
                </div>
                {group.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {group.description}
                  </p>
                )}
                <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <p>{formatCurrency(group.contributionAmount)} / {FREQUENCY_LABELS[group.contributionFrequency]}</p>
                  <p className="flex items-center gap-1">
                    <FiUsers className="h-4 w-4" />
                    {getActiveMembers(group).length} / {group.maxMembers} members
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiUsers}
          title="No groups yet"
          description="Create a new group or join one with an invite code."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => setShowCreate(true)}>Create Group</Button>
              <Button variant="outline" onClick={() => setShowJoin(true)}>
                Join Group
              </Button>
            </div>
          }
        />
      )}

      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Group"
        footer={
          <ModalActions
            onCancel={() => setShowCreate(false)}
            onConfirm={() => document.getElementById('create-group-form').requestSubmit()}
            confirmText="Create"
            loading={submitting}
          />
        }
      >
        {formError && <div className="mb-4"><Alert message={formError} /></div>}
        <form id="create-group-form" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Group name"
            required
            minLength={3}
            maxLength={100}
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
          />
          <Input
            label="Description"
            maxLength={500}
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
          />
          <Input
            label="Contribution amount (₦)"
            type="number"
            required
            min={1}
            value={createForm.contributionAmount}
            onChange={(e) => setCreateForm({ ...createForm, contributionAmount: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Frequency
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-navy-900"
              value={createForm.contributionFrequency}
              onChange={(e) => setCreateForm({ ...createForm, contributionFrequency: e.target.value })}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <Input
            label="Maximum members"
            type="number"
            required
            min={2}
            value={createForm.maxMembers}
            onChange={(e) => setCreateForm({ ...createForm, maxMembers: e.target.value })}
          />
        </form>
      </Modal>

      <Modal
        open={showJoin}
        onClose={() => setShowJoin(false)}
        title="Join Group"
        footer={
          <ModalActions
            onCancel={() => setShowJoin(false)}
            onConfirm={() => document.getElementById('join-group-form').requestSubmit()}
            confirmText="Join"
            loading={submitting}
          />
        }
      >
        {formError && <div className="mb-4"><Alert message={formError} /></div>}
        <form id="join-group-form" onSubmit={handleJoin}>
          <Input
            label="Invite code"
            required
            placeholder="Enter 8-character code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          />
        </form>
      </Modal>
    </div>
  );
}
