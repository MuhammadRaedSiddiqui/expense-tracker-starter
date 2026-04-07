function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Skeleton className="h-4 w-24 mb-2" variant="text" />
      <Skeleton className="h-8 w-32 mb-1" variant="text" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <Skeleton className="h-6 w-48" variant="text" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-4 w-24" variant="text" />
            <Skeleton className="h-4 w-32 flex-1" variant="text" />
            <Skeleton className="h-4 w-20" variant="text" />
            <Skeleton className="h-4 w-16" variant="text" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Skeleton className="h-6 w-40 mb-6" variant="text" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" variant="text" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-4 w-12" variant="text" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonBudgetCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" variant="text" />
          <Skeleton className="h-4 w-24" variant="text" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <Skeleton className="h-2 w-full mb-2" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" variant="text" />
        <Skeleton className="h-3 w-16" variant="text" />
      </div>
    </div>
  );
}

export function SkeletonMemberCard() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" variant="circular" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" variant="text" />
          <Skeleton className="h-3 w-24" variant="text" />
        </div>
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

export default Skeleton;
