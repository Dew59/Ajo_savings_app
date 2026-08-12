import { CYCLE_STATUS, GROUP_STATUS } from '../utils/constants';
import Badge from './Badge';

export function StatusBadge({ status, type = 'cycle' }) {
  const config = type === 'group' ? GROUP_STATUS[status] : CYCLE_STATUS[status];
  if (!config) return <Badge>{status}</Badge>;
  return <Badge color={config.color}>{config.label}</Badge>;
}

export function ProgressBar({ value, max = 100, label }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
