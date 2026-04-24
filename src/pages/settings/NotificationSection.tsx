import { useState } from 'react';

export default function NotificationSection() {
  const [emailDigest, setEmailDigest] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  return (
    <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8">
        <span
          className="material-symbols-outlined text-primary"
          data-icon="notifications_active"
        >
          notifications_active
        </span>
        <h3 className="text-lg font-bold tracking-tight">Communication</h3>
      </div>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="max-w-md">
            <p className="text-sm font-bold">Email Digest</p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Receive a weekly summary of organizational spending, recurring transactions, and
              budget health every Monday morning.
            </p>
          </div>
          <button
            onClick={() => setEmailDigest(!emailDigest)}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
              emailDigest ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                emailDigest ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        <div className="h-[1px] bg-outline-variant opacity-10"></div>

        <div className="flex items-start justify-between">
          <div className="max-w-md">
            <p className="text-sm font-bold">Budget Overrun Alerts</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="material-symbols-outlined text-error text-[12px]"
                data-icon="warning"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <p className="text-[11px] text-error font-medium uppercase tracking-tighter">
                Priority
              </p>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
              Immediate alerts via push and email when any category exceeds 95% of its allocated
              monthly budget.
            </p>
          </div>
          <button
            onClick={() => setBudgetAlerts(!budgetAlerts)}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
              budgetAlerts ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                budgetAlerts ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-tertiary-container/20 rounded border border-tertiary/20">
          <p className="text-xs text-on-surface-variant">
            <span className="font-bold">Note:</span> Notification preferences are currently
            UI-only. Backend integration for email notifications will be added in a future update.
          </p>
        </div>
      </div>
    </section>
  );
}
