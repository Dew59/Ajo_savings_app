import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import Card, { CardHeader } from '../components/Card';
import { PageLoader } from '../components/Loader';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import { formatCurrency, formatDate, getErrorMessage, getId } from '../utils/format';
import { FiDollarSign } from 'react-icons/fi';

export default function Contributions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .getTransactions()
      .then(({ data }) => {
        const contributions = data.data.transactions.filter(
          (t) => t.type === 'contribution'
        );
        setTransactions(contributions);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (error) return <Alert message={error} />;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Your Contributions"
          description="All contribution transactions across your groups"
        />

        {transactions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Group</th>
                  <th className="pb-3 pr-4 font-medium">Cycle</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                  >
                    <td className="py-3 pr-4">{tx.group?.name}</td>
                    <td className="py-3 pr-4">#{tx.cycle?.cycleNumber}</td>
                    <td className="py-3 pr-4 font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 pr-4">{formatDate(tx.createdAt)}</td>
                    <td className="py-3">
                      {getId(tx.group) && getId(tx.cycle) && (
                        <Link
                          to={`/groups/${getId(tx.group)}/cycles/${getId(tx.cycle)}`}
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          View cycle
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={FiDollarSign}
            title="No contributions yet"
            description="When you contribute to a cycle, your transactions will appear here."
          />
        )}
      </Card>
    </div>
  );
}
