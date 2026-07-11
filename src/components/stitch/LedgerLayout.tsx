import { LedgerSidebar } from './LedgerSidebar';
import { LedgerHeader } from './LedgerHeader';
import { LedgerDashboard } from './LedgerDashboard';

export function LedgerLayout() {
  return (
    <div className="bg-background text-on-background font-body antialiased">
      <LedgerSidebar />
      <main className="ml-64 min-h-screen">
        <LedgerHeader />
        <LedgerDashboard />
      </main>
    </div>
  );
}
