import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
} from '../utils/format';
import { FiRefreshCw } from 'react-icons/fi';

export default function GroupCycles() {
  const { groupId } = useParams();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cyclesApi
      .getGroupCycles(groupId, { limit: 50 })
      .then(({ data }) => setCycles(data.data.cycles))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Cycle History"
          description="All contribution cycles for this group"
        />

        {cycles.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Cycle</th>
                  <th className="pb-3 pr-4 font-medium">Recipient</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Progress</th>
                  <th className="pb-3 pr-4 font-medium">Total</th>
                  <th className="pb-3 pr-4 font-medium">Period</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {cycles.map((cycle) => (
                  <tr
                    key={cycle._id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="py-3 pr-4 font-medium">#{cycle.cycleNumber}</td>
                    <td className="py-3 pr-4">{cycle.payoutRecipient?.name}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={cycle.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="w-24">
                        <ProgressBar
                          value={cycle.contributorCount}
                          max={cycle.memberCount}
                        />
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {formatCurrency(cycle.totalContributed)}
                    </td>
                    <td className="py-3 pr-4 text-xs">
                      {formatDate(cycle.startDate)} — {formatDate(cycle.endDate)}
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/groups/${groupId}/cycles/${cycle._id}`}
                        className="text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FiRefreshCw}
            title="No cycles yet"
            description="Cycles will appear here once the group creator starts one."
          />
        )}
      </Card>
    </div>
  );
}
