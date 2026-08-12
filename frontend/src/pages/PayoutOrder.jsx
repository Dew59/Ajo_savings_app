import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupsApi } from '../api/groups';
import Card, { CardHeader } from '../components/Card';
import { PageLoader } from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';
import { StatusBadge } from '../components/StatusBadge';
import { getErrorMessage, getId } from '../utils/format';
import { FiAward } from 'react-icons/fi';

export default function PayoutOrder() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    groupsApi
      .getAll({ limit: 50 })
      .then(({ data }) => {
        const withPayoutOrder = data.data.groups.filter(
          (g) => g.payoutOrder?.length > 0 && g.status !== 'recruiting'
        );
        setGroups(withPayoutOrder);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;

  return (
    <div className="space-y-6">
      {groups.length ? (
        groups.map((group) => (
          <Card key={group._id}>
            <CardHeader
              title={group.name}
              description="Payout rotation order"
              action={<StatusBadge status={group.status} type="group" />}
            />

            <div className="space-y-2">
              {group.payoutOrder.map((member, index) => {
                const memberId = getId(member);
                const isCurrent = index === group.currentPayoutIndex;
                const isPast = index < group.currentPayoutIndex;
                const isUpcoming = index > group.currentPayoutIndex;

                return (
                  <div
                    key={memberId}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                      isCurrent
                        ? 'border border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20'
                        : 'bg-slate-50 dark:bg-navy-800'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-navy-800 text-white dark:bg-navy-700'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                    {isPast && <Badge color="slate">Previous</Badge>}
                    {isCurrent && <Badge color="emerald">Current</Badge>}
                    {isUpcoming && <Badge color="blue">Upcoming</Badge>}
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <Link
                to={`/groups/${group._id}`}
                className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
              >
                View group details →
              </Link>
            </div>
          </Card>
        ))
      ) : (
        <EmptyState
          icon={FiAward}
          title="No payout orders yet"
          description="Payout order is set when a group reaches its maximum members and becomes active."
        />
      )}
    </div>
  );
}
