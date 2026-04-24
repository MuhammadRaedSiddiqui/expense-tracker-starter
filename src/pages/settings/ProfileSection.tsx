import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export default function ProfileSection() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await user?.setProfileImage({ file });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error uploading profile image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.hasImage) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await user?.setProfileImage({ file: null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error removing profile image:', err);
      setError(err.message || 'Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-primary" data-icon="person">
          person
        </span>
        <h3 className="text-lg font-bold tracking-tight">Public Profile</h3>
      </div>

      {/* Profile Picture Section */}
      <div className="mb-8 pb-8 border-b border-outline-variant/10">
        <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-4">
          Profile Picture
        </label>
        <div className="flex items-center gap-6">
          <div className="relative">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-outline-variant/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-outline-variant/20">
                <span className="material-symbols-outlined text-4xl text-outline" data-icon="person">
                  person
                </span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
                <span className="inline-block px-4 py-2 bg-secondary text-on-secondary text-xs font-bold uppercase tracking-wider rounded hover:bg-on-secondary-fixed-variant transition-colors disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload New'}
                </span>
              </label>
              {user?.hasImage && (
                <button
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="px-4 py-2 bg-transparent border border-error text-error text-xs font-bold uppercase tracking-wider rounded hover:bg-error/10 transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[10px] text-on-surface-variant">
              JPG, PNG or GIF. Max size 5MB.
            </p>
            {error && (
              <div className="flex items-center gap-2 text-error text-xs">
                <span className="material-symbols-outlined text-sm" data-icon="error">
                  error
                </span>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-secondary text-xs">
                <span className="material-symbols-outlined text-sm" data-icon="check_circle">
                  check_circle
                </span>
                Profile picture updated successfully
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Full Name
          </label>
          <input
            className="w-full bg-surface-container-low border-b-2 border-transparent px-2 py-2 text-sm font-medium focus:ring-0"
            type="text"
            value={user?.fullName || ''}
            readOnly
          />
          <p className="text-[10px] text-on-surface font-medium opacity-70">
            Managed by your authentication provider (Clerk)
          </p>
        </div>
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Email Address
          </label>
          <input
            className="w-full bg-surface-container-low border-b-2 border-transparent px-2 py-2 text-sm font-medium focus:ring-0"
            type="email"
            value={user?.primaryEmailAddress?.emailAddress || ''}
            readOnly
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            User ID
          </label>
          <input
            className="w-full bg-surface-container-low border-b-2 border-transparent px-2 py-2 text-xs font-mono focus:ring-0"
            type="text"
            value={user?.id || ''}
            readOnly
          />
          <p className="text-[10px] text-on-surface font-medium opacity-70">
            Your unique identifier in the system
          </p>
        </div>
      </div>
      <div className="mt-6 p-4 bg-primary-container/20 rounded border border-primary/20">
        <p className="text-xs text-on-surface-variant">
          <span className="font-bold">Note:</span> Profile name and email are managed through your
          authentication provider. To update these fields, please use the user menu in the top navigation.
        </p>
      </div>
    </section>
  );
}
