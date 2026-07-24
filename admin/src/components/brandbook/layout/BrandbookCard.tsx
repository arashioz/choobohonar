'use client';

import { cn } from '@/lib/utils';

type BrandbookCardSurface = 'paper' | 'glass';
type BrandbookCardLift = 'none' | 'sm' | 'md';

export type BrandbookCardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  surface?: BrandbookCardSurface;
  lift?: BrandbookCardLift;
};

const surfaceClass: Record<BrandbookCardSurface, string> = {
  paper: 'bg-paper',
  glass: 'bg-paper/70 backdrop-blur-sm',
};

const liftClass: Record<BrandbookCardLift, string> = {
  none: '',
  sm: 'hover:-translate-y-0.5',
  md: 'hover:-translate-y-1',
};

export default function BrandbookCard({
  className,
  children,
  interactive = true,
  surface = 'paper',
  lift = 'md',
  ...props
}: BrandbookCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-forest/10',
        surfaceClass[surface],
        interactive && [
          'transition-all duration-500 ease-out-expo',
          liftClass[lift],
          'hover:border-forest/15 hover:shadow-sm hover:shadow-forest/[0.04]',
        ],
        className,
      )}
      {...props}
    >
      {interactive && (
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 z-0',
            'bg-gradient-to-br from-peach/[0.14] via-teal/[0.06] to-transparent',
            'opacity-0 transition-opacity duration-500 ease-out-expo group-hover:opacity-100',
          )}
        />
      )}
      {children}
    </div>
  );
}
