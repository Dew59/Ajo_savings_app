import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiActivity,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import { dashboardApi } from '../api/dashboard';
import StatCard from '../components/StatCard';
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

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .getDashboard()
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;

  const { summary, currentCycles, recentContributions } = data;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Groups"
          value={summary.totalGroups}
          icon={FiUsers}
        />
        <StatCard
          label="Active Groups"
          value={summary.activeGroups}
          icon={FiActivity}
        />
        <StatCard
          label="Total Contributed"
          value={formatCurrency(summary.totalContributions)}
          icon={FiDollarSign}
        />
        <StatCard
          label="Pending Payouts"
          value={summary.pendingPayouts}
          icon={FiClock}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Current Cycles"
            description="Active contribution cycles in your groups"
          />
          {currentCycles?.length ? (
            <div className="space-y-4">
              {currentCycles.map((cycle) => (
                <Link
                  key={cycle._id}
                  to={`/groups/${getId(cycle.group)}/cycles/${cycle._id}`}
                  className="block rounded-lg border border-slate-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {cycle.group?.name} — Cycle {cycle.cycleNumber}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Recipient: {cycle.payoutRecipient?.name}
                      </p>
                    </div>
                    <StatusBadge status={cycle.status} />
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={cycle.contributorCount}
                      max={cycle.memberCount}
                      label={`${cycle.contributorCount}/${cycle.memberCount} contributed`}
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active cycles"
              description="When a group starts a cycle, it will appear here."
            />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Recent Activity"
            description="Your latest contributions"
          />
          {recentContributions?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Group</th>
                    <th className="pb-3 pr-4 font-medium">Cycle</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContributions.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-3 pr-4">{item.group?.name}</td>
                      <td className="py-3 pr-4">#{item.cycle?.cycleNumber}</td>
                      <td className="py-3 pr-4 font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-3">{formatDate(item.paymentDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No recent activity"
              description="Your contributions will show up here."
            />
          )}
        </Card>
      </div>

      {summary.groups?.length > 0 && (
        <Card>
          <CardHeader title="Your Groups" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.groups.map((group) => (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:border-emerald-300 dark:border-slate-700 dark:hover:border-emerald-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {group.name}
                  </p>
                  <StatusBadge status={group.status} type="group" />
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {formatCurrency(group.contributionAmount)} per cycle
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
