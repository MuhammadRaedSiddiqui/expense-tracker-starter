import AppLayout from '@/components/layout/AppLayout';
import SettingsNav from './SettingsNav';
import ProfileSection from './ProfileSection';
import OrganizationSection from './OrganizationSection';
import NotificationSection from './NotificationSection';
import DangerZone from './DangerZone';

export default function Settings() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Editorial Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
              System Configuration
            </span>
            <h2 className="text-4xl font-extrabold tracking-tighter text-on-surface mt-1">
              Settings
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-on-surface-variant">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-[10px] font-bold text-secondary uppercase">
              Encryption: AES-256 Active
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <SettingsNav />
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <ProfileSection />
            <OrganizationSection />
            <NotificationSection />
            <DangerZone />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
