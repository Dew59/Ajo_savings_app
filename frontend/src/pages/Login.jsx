import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { getErrorMessage } from '../utils/format';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
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
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Sign in to manage your ajo savings
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert message={error} onDismiss={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          Create one
        </Link>
      </p>
    </Card>
  );
}
