import { Link } from 'react-router-dom';
import { useOrganization } from '@/integration/hooks/useOrganization';

export default function OrganizationSection() {
  const { organization, loading } = useOrganization();

  const getInitials = (name: string | undefined) => {
    if (!name) return 'ORG';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary" data-icon="corporate_fare">
            corporate_fare
          </span>
          <h3 className="text-lg font-bold tracking-tight">Organization</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-surface-container rounded"></div>
          <div className="h-12 bg-surface-container rounded"></div>
        </div>
      </section>
    );
  }

  if (!organization) {
    return (
      <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary" data-icon="corporate_fare">
            corporate_fare
          </span>
          <h3 className="text-lg font-bold tracking-tight">Organization</h3>
        </div>
        <p className="text-sm text-on-surface-variant">No organization found</p>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary" data-icon="corporate_fare">
          corporate_fare
        </span>
        <h3 className="text-lg font-bold tracking-tight">Organization</h3>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-surface rounded">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-on-surface text-surface flex items-center justify-center rounded font-bold">
              {getInitials(organization.name)}
            </div>
            <div>
              <p className="text-sm font-bold">{organization.name}</p>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">
                Organization ID: {organization.id.substring(0, 8)}...
              </p>
            </div>
          </div>
          <Link
            to="/team"
            className="text-[10px] font-bold uppercase px-3 py-1.5 border border-outline hover:bg-surface-container-high transition-colors"
          >
            Manage Members
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Created Date
            </label>
            <input
              className="w-full bg-surface-container-low border-b-2 border-transparent px-0 py-2 text-sm font-medium focus:ring-0"
              type="text"
              value={new Date(organization.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              readOnly
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Reporting Currency
            </label>
            <select className="w-full bg-surface-container-low border-b-2 border-transparent px-0 py-2 text-sm font-medium focus:ring-0">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
            <p className="text-[10px] text-on-surface font-medium opacity-70">
              Currency preferences coming soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
