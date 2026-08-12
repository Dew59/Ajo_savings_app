import { useEffect, useState } from 'react';
import { usersApi } from '../api/users';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader } from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { PageLoader } from '../components/Loader';
import { getErrorMessage, getInitials } from '../utils/format';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', email: '', avatar: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    usersApi
      .getMe()
      .then(({ data }) => {
        const u = data.data.user;
        setProfileForm({ name: u.name, email: u.email, avatar: u.avatar || '' });
        setUser(u);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    try {
      const payload = {};
      if (profileForm.name !== user?.name) payload.name = profileForm.name;
      if (profileForm.email !== user?.email) payload.email = profileForm.email;
      if (profileForm.avatar !== (user?.avatar || '')) payload.avatar = profileForm.avatar;

      if (Object.keys(payload).length === 0) {
        setProfileError('No changes to save.');
        return;
      }

      const { data } = await usersApi.updateProfile(payload);
      setUser(data.data.user);
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const { data } = await usersApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess(data.message || 'Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-xl font-bold text-white">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Profile Information" description="Update your personal details" />

        {profileError && (
          <div className="mb-4">
            <Alert message={profileError} onDismiss={() => setProfileError('')} />
          </div>
        )}
        {profileSuccess && (
          <div className="mb-4">
            <Alert variant="success" message={profileSuccess} />
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input
            label="Full name"
            required
            minLength={2}
            maxLength={50}
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
          />
          <Input
            label="Avatar URL"
            value={profileForm.avatar}
            onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
            hint="Optional profile image URL"
          />
          <Button type="submit" loading={profileLoading}>
            Save Changes
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Change Password" description="Update your account password" />

        {passwordError && (
          <div className="mb-4">
            <Alert message={passwordError} onDismiss={() => setPasswordError('')} />
          </div>
        )}
        {passwordSuccess && (
          <div className="mb-4">
            <Alert variant="success" message={passwordSuccess} />
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            required
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
            }
          />
          <Input
            label="New password"
            type="password"
            required
            minLength={8}
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
          />
          <Input
            label="Confirm new password"
            type="password"
            required
            minLength={8}
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
            }
          />
          <Button type="submit" loading={passwordLoading}>
            Change Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
