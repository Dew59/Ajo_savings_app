import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { getErrorMessage } from '../utils/format';

export default function ResetPassword() {
  const { token } = useParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.resetPassword(token, password);
      setUser(data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Reset password
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your new password below
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert message={error} onDismiss={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          name="password"
          type="password"
          required
          minLength={8}
          hint="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
