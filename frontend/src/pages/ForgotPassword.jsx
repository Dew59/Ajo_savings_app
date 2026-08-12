import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { getErrorMessage } from '../utils/format';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(email);
      setSuccess(data.message || 'Password reset email sent successfully.');
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
          Forgot password
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your email to receive a reset link
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert message={error} onDismiss={() => setError('')} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <Alert variant="success" message={success} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
