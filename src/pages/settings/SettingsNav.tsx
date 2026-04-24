import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/components/ToastContainer';

export default function SettingsNav() {
  const { user } = useUser();
  const toast = useToast();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleNavClick = (section: string) => {
    // Scroll to section or show coming soon message
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast.info(`${section.charAt(0).toUpperCase() + section.slice(1)} section coming soon!`);
    }
  };

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg bg-primary-container flex items-center justify-center overflow-hidden">
            {user?.imageUrl ? (
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src={user.imageUrl}
              />
            ) : (
              <span className="text-2xl font-bold text-on-primary-container">
                {getInitials(user?.fullName)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-on-surface">
              {user?.fullName || 'User'}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {user?.primaryEmailAddress?.emailAddress || 'No email'}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => handleNavClick('profile')}
            className="w-full text-left px-4 py-2.5 rounded text-sm font-bold bg-secondary-container text-on-secondary-container flex items-center justify-between"
          >
            General Profile
            <span className="material-symbols-outlined text-sm" data-icon="chevron_right">
              chevron_right
            </span>
          </button>
          <button
            onClick={() => handleNavClick('security')}
            className="w-full text-left px-4 py-2.5 rounded text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Password &amp; Security
          </button>
          <button
            onClick={() => handleNavClick('billing')}
            className="w-full text-left px-4 py-2.5 rounded text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Billing
          </button>
          <button
            onClick={() => handleNavClick('tier')}
            className="w-full text-left px-4 py-2.5 rounded text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Billing &amp; Tier
          </button>
        </div>
      </div>
      <div className="bg-surface-container-high p-6 rounded-lg border-l-4 border-secondary">
        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-2">
          Usage Metric
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">--</span>
          <span className="text-xs text-on-surface-variant">of storage used</span>
        </div>
        <div className="mt-3 h-1.5 w-full bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-secondary w-[0%]"></div>
        </div>
        <p className="text-[10px] text-on-surface-variant mt-2">
          Storage metrics coming soon
        </p>
      </div>
    </div>
  );
}
