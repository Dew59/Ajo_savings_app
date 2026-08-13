import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cyclesApi } from '../api/cycles';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader } from '../components/Card';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { PageLoader } from '../components/Loader';
import Alert from '../components/Alert';
import { StatusBadge, ProgressBar } from '../components/StatusBadge';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getErrorMessage,
  getId,
  isGroupCreator,
  getInitials,
} from '../utils/format';
import { FREQUENCY_LABELS } from '../utils/constants';

export default function CycleDetail() {
  const { groupId, cycleId } = useParams();
  const { user } = useAuth();
  const [cycle, setCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmPayout, setShowConfirmPayout] = useState(false);

  const fetchCycle = () => {
    setLoading(true);
    cyclesApi
      .getById(cycleId)
      .then(({ data }) => setCycle(data.data.cycle))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCycle();
  }, [cycleId]);

  const isCreator = getId(cycle?.createdBy) === getId(user?._id);
  const canContribute =
    cycle?.status === 'open' && !cycle?.myContribution;
  const canConfirmPayout =
    isCreator && cycle?.status === 'ready_for_payout';

  const handleContribute = async () => {
    setActionError('');
    setActionLoading(true);
    try {
      await cyclesApi.contribute(cycleId, cycle.contributionAmount);
      fetchCycle();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmPayout = async () => {
    setActionLoading(true);
    try {
      await cyclesApi.confirmPayout(cycleId);
      setShowConfirmPayout(false);
      fetchCycle();
    } catch (err) {
      setActionError(getErrorMessage(err));
      setShowConfirmPayout(false);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;
  if (!cycle) return null;

  return (
    <div className="space-y-6">
      <div className="text-sm">
        <Link
          to={`/groups/${groupId}`}
          className="text-emerald-600 hover:underline dark:text-emerald-400"
        >
          ← Back to group
        </Link>
      </div>

      {actionError && <Alert message={actionError} onDismiss={() => setActionError('')} />}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Cycle #{cycle.cycleNumber}
              </h2>
              <StatusBadge status={cycle.status} />
            </div>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {cycle.group?.name}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canContribute && (
              <Button onClick={handleContribute} loading={actionLoading}>
                Contribute {formatCurrency(cycle.contributionAmount)}
              </Button>
            )}
            {canConfirmPayout && (
              <Button onClick={() => setShowConfirmPayout(true)} loading={actionLoading}>
                Confirm Payout
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500">Payout Recipient</p>
            <p className="mt-1 font-semibold">{cycle.payoutRecipient?.name}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500">Amount per Member</p>
            <p className="mt-1 font-semibold">{formatCurrency(cycle.contributionAmount)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500">Total Contributed</p>
            <p className="mt-1 font-semibold">{formatCurrency(cycle.totalContributed)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-navy-800">
            <p className="text-sm text-slate-500">Frequency</p>
            <p className="mt-1 font-semibold">{FREQUENCY_LABELS[cycle.contributionFrequency]}</p>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar
            value={cycle.contributorCount}
            max={cycle.memberCount}
            label={`${cycle.contributorCount} of ${cycle.memberCount} members contributed`}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Start Date</p>
            <p className="font-medium">{formatDate(cycle.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">End Date</p>
            <p className="font-medium">{formatDate(cycle.endDate)}</p>
          </div>
        </div>

        {cycle.myContribution && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              You contributed {formatCurrency(cycle.myContribution.amount)} on{' '}
              {formatDate(cycle.myContribution.paymentDate)}
            </p>
          </div>
        )}

        {cycle.status === 'closed' && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-navy-800">
            <p className="text-sm text-slate-500">Payout confirmed</p>
            <p className="font-medium">
              {formatCurrency(cycle.payoutAmount)} paid to {cycle.payoutRecipient?.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDateTime(cycle.payoutConfirmedAt)} by {cycle.payoutConfirmedBy?.name}
            </p>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title="Contributions"
          description={`${cycle.contributions?.length || 0} contributions recorded`}
        />
        {cycle.contributions?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Member</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {cycle.contributions.map((c) => (
                  <tr key={c._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                          {getInitials(c.member?.name)}
                        </div>
                        {c.member?.name}
                      </div>
                    </td>
                    <td className="py-3 pr-4 font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(c.amount)}
                    </td>
                    <td className="py-3">{formatDate(c.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No contributions yet.</p>
        )}
      </Card>

      <ConfirmDialog
        open={showConfirmPayout}
        onClose={() => setShowConfirmPayout(false)}
        onConfirm={handleConfirmPayout}
        title="Confirm Payout"
        message={`Confirm payout of ${formatCurrency(cycle.totalContributed)} to ${cycle.payoutRecipient?.name}? This will close the cycle.`}
        confirmText="Confirm Payout"
        loading={actionLoading}
      />
    </div>
  );
}
