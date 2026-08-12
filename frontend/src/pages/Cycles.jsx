import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import { cyclesApi } from '../api/cycles';
import Card, { CardHeader } from '../components/Card';
import { PageLoader } from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import { StatusBadge, ProgressBar } from '../components/StatusBadge';
import {
  formatCurrency,
  formatDate,
  getErrorMessage,
  getId,
} from '../utils/format';
import { FiRefreshCw } from 'react-icons/fi';

export default function Cycles() {
  const [currentCycle, setCurrentCycle] = useState(null);
  const [dashboardCycles, setDashboardCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      cyclesApi.getCurrent(),
      dashboardApi.getDashboard(),
    ])
      .then(([currentRes, dashRes]) => {
        setCurrentCycle(currentRes.data.data.cycle);
        setDashboardCycles(dashRes.data.data.currentCycles || []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;

  const cycles = dashboardCycles.length
    ? dashboardCycles
    : currentCycle
      ? [currentCycle]
      : [];

  return (
    <div className="space-y-6">
      {currentCycle && (
        <Card>
          <CardHeader
            title="Your Current Cycle"
            description="The active cycle you can contribute to"
          />
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {currentCycle.group?.name} — Cycle #{currentCycle.cycleNumber}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Recipient: {currentCycle.payoutRecipient?.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(currentCycle.startDate)} — {formatDate(currentCycle.endDate)}
                </p>
              </div>
              <StatusBadge status={currentCycle.status} />
            </div>
            <div className="mt-4">
              <ProgressBar
                value={currentCycle.contributorCount}
                max={currentCycle.memberCount}
                label={`${currentCycle.contributorCount}/${currentCycle.memberCount} contributed`}
              />
            </div>
            <div className="mt-4">
              <Link
                to={`/groups/${getId(currentCycle.group)}/cycles/${currentCycle._id}`}
                className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                View cycle details →
              </Link>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader
          title="All Active Cycles"
          description="Open and ready-for-payout cycles in your groups"
        />

        {cycles.length ? (
          <div className="space-y-4">
            {cycles.map((cycle) => (
              <Link
                key={cycle._id}
                to={`/groups/${getId(cycle.group)}/cycles/${cycle._id}`}
                className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {cycle.group?.name} — Cycle #{cycle.cycleNumber}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatCurrency(cycle.contributionAmount)} per member · Recipient: {cycle.payoutRecipient?.name}
                    </p>
                  </div>
                  <StatusBadge status={cycle.status} />
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={cycle.contributorCount}
                    max={cycle.memberCount}
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FiRefreshCw}
            title="No active cycles"
            description="Active cycles from your groups will appear here."
          />
        )}
      </Card>
    </div>
  );
}
