// GeoRecon AI - Common Status Badge & Metric Card Components

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'confidence' | 'validation' | 'review' | 'general';
  score?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general', score }) => {
  if (type === 'confidence' && score !== undefined) {
    if (score >= 90) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {score.toFixed(1)}% High
        </span>
      );
    }
    if (score >= 75) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {score.toFixed(1)}% Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {score.toFixed(1)}% Flagged
      </span>
    );
  }

  // General or review status
  const normalized = status.toLowerCase();
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (normalized.includes('auto-approved') || normalized.includes('validated') || normalized.includes('ready') || normalized.includes('resolved') || normalized.includes('confirmed')) {
    badgeStyle = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
  } else if (normalized.includes('review') || normalized.includes('pending') || normalized.includes('has_issues')) {
    badgeStyle = 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
  } else if (normalized.includes('flagged') || normalized.includes('rejected') || normalized.includes('open') || normalized.includes('critical')) {
    badgeStyle = 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
      {status}
    </span>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  highlightColor?: 'brand' | 'emerald' | 'amber' | 'rose' | 'indigo';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  highlightColor = 'brand',
  onClick
}) => {
  const colorMap = {
    brand: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-100 dark:border-sky-900/50',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50',
    indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/50'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-sky-500 hover:shadow-md' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg border ${colorMap[highlightColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{subtitle}</span>
          {trend && (
            <span className={`font-medium ${trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
