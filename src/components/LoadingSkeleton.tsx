export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 h-32"
          >
            <div className="h-4 bg-surface-container rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-surface-container rounded w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 h-80">
        <div className="h-6 bg-surface-container rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-surface-container rounded"></div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/10">
          <div className="h-5 bg-surface-container rounded w-1/3"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-surface-container rounded flex-1"></div>
              <div className="h-4 bg-surface-container rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/20 overflow-hidden animate-pulse">
      <div className="p-6 border-b border-outline-variant/10">
        <div className="h-5 bg-surface-container rounded w-1/4"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/10">
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-3 bg-surface-container rounded w-full"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-surface-container rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 animate-pulse">
      <div className="h-5 bg-surface-container rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-surface-container rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-surface-container rounded w-1/2"></div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 bg-surface-container rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}
