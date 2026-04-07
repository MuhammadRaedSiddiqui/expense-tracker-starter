/**
 * Convert transactions to CSV format and trigger download
 */
export function exportTransactionsToCSV(transactions, filename = 'transactions.csv') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Currency'];

  // Convert transactions to CSV rows
  const rows = transactions.map((t) => {
    return [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
      t.category,
      t.type,
      t.amount,
      t.currency || 'USD',
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format date for filename
 */
export function getExportFilename(prefix, startDate, endDate) {
  const start = new Date(startDate).toISOString().split('T')[0];
  const end = new Date(endDate).toISOString().split('T')[0];
  return `${prefix}_${start}_to_${end}.csv`;
}
