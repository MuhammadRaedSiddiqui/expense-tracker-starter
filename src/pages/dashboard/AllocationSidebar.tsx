import { useState, useEffect } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';

interface AllocationSidebarProps {
  organizationId?: string;
}

export default function AllocationSidebar({ organizationId }: AllocationSidebarProps) {
  const { data: transactions } = useTransactions(organizationId);
  const { data: budgets } = useBudgets(organizationId);

  const [allocations, setAllocations] = useState<Array<{ label: string; value: number; color: string }>>([]);

  useEffect(() => {
    if (!transactions || !budgets) return;

    // Calculate spending by category
    const categorySpending = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const current = categorySpending.get(t.category) || 0;
        categorySpending.set(t.category, current + parseFloat(t.amount.toString()));
      });

    const totalSpending = Array.from(categorySpending.values()).reduce((sum, val) => sum + val, 0);

    if (totalSpending === 0) {
      setAllocations([]);
      return;
    }

    // Convert to percentages
    const allocationData = Array.from(categorySpending.entries())
      .map(([category, amount]) => ({
        label: category.toUpperCase(),
        value: Math.round((amount / totalSpending) * 100),
        color: 'bg-primary',
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3); // Top 3 categories

    // Assign different colors
    if (allocationData[0]) allocationData[0].color = 'bg-primary';
    if (allocationData[1]) allocationData[1].color = 'bg-secondary';
    if (allocationData[2]) allocationData[2].color = 'bg-tertiary';

    setAllocations(allocationData);
  }, [transactions, budgets]);

  return (
    <div className="bg-surface-container-high p-6 rounded-lg flex flex-col">
      <h3 className="text-xs font-bold text-on-surface mb-6 uppercase tracking-widest">
        Spending Allocation
      </h3>
      <div className="space-y-6 flex-1">
        {allocations.length > 0 ? (
          allocations.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-xs text-on-surface-variant">No spending data available</div>
        )}
      </div>
      <div className="mt-6 p-4 bg-surface-container-lowest rounded-lg border-l-4 border-secondary">
        <p className="text-[10px] leading-relaxed text-on-surface font-medium italic">
          Allocation based on current spending patterns across all categories.
        </p>
      </div>
    </div>
  );
}
