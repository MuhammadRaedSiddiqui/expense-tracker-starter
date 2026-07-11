import type { DataTableProps, DataTableColumn } from '../../types/stitch-components';

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  actions,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 overflow-hidden ${className}`}
      role="region"
      aria-label={title || 'Data table'}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          {title && (
            <h2 className="text-title-lg font-semibold text-slate-900">
              {title}
            </h2>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full" role="table">
          <thead>
            <tr className="bg-slate-50">
              {columns.map((column, index) => (
                <th
                  key={String(column.key) || index}
                  className={`
                    px-6 py-3
                    text-left
                    text-label-md
                    uppercase
                    tracking-wider
                    text-slate-600
                    font-medium
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.className || ''}
                  `}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-body-md text-on-surface-variant"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    transition-colors
                    hover:bg-slate-50
                    border-b border-slate-100 last:border-0
                  `}
                >
                  {columns.map((column, colIndex) => {
                    const value = row[column.key as keyof T];
                    const content = column.render
                      ? column.render(value, row)
                      : value;

                    return (
                      <td
                        key={colIndex}
                        className={`
                          px-6 py-4
                          text-body-md
                          text-slate-900
                          ${column.align === 'right' ? 'text-right tabular-nums' : ''}
                          ${column.align === 'center' ? 'text-center' : ''}
                          ${column.className || ''}
                        `}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
