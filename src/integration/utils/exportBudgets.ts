// Export budgets to CSV
export function exportBudgetsToCSV(budgetsWithSpending: any[]) {
  try {
    // Create CSV header
    const headers = ['Category', 'Budget Amount', 'Spent', 'Remaining', 'Utilization %', 'Period', 'Status'];

    // Create CSV rows
    const rows = budgetsWithSpending.map(({ budget, spent, utilization }) => {
      const remaining = budget.amount - spent;
      const status = utilization >= 100 ? 'Over Budget' : utilization >= 80 ? 'Warning' : 'On Track';

      return [
        budget.category,
        budget.amount.toFixed(2),
        spent.toFixed(2),
        remaining.toFixed(2),
        utilization.toFixed(1),
        budget.period,
        status
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `budgets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting budgets to CSV:', error);
    return false;
  }
}
