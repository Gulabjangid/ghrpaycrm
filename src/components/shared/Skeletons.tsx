import React from 'react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonBox: React.FC<Props> = ({ className, style }) => (
  <div className={cn('skeleton', className)} style={{ minHeight: 16, ...style }} />
);

export const LeadCardSkeleton: React.FC = () => (
  <div className="rounded-lg p-4 flex flex-col gap-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
    <div className="flex items-center gap-3">
      <SkeletonBox className="rounded-full" style={{ width: 36, height: 36, flexShrink: 0 }} />
      <div className="flex-1 flex flex-col gap-1.5">
        <SkeletonBox style={{ width: '70%', height: 14 }} />
        <SkeletonBox style={{ width: '40%', height: 12 }} />
      </div>
    </div>
    <div className="flex gap-2">
      <SkeletonBox style={{ width: 60, height: 22, borderRadius: 100 }} />
      <SkeletonBox style={{ width: 40, height: 22, borderRadius: 100 }} />
    </div>
    <SkeletonBox style={{ width: '55%', height: 12 }} />
  </div>
);

export const KPICardSkeleton: React.FC = () => (
  <div className="rounded-lg p-5 flex flex-col gap-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
    <SkeletonBox style={{ width: '50%', height: 12 }} />
    <SkeletonBox style={{ width: '35%', height: 32 }} />
    <SkeletonBox style={{ width: '60%', height: 10 }} />
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <div className="flex gap-4 py-3 px-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
    {Array.from({ length: cols }).map((_, i) => (
      <SkeletonBox key={i} style={{ flex: i === 0 ? 2 : 1, height: 14 }} />
    ))}
  </div>
);
