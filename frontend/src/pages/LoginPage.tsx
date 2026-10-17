import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('user@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Unable to sign in. Check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Sign in to Blog Platform</h1>
          <p className="mt-2 text-sm text-gray-600">Use your account to create posts and manage drafts.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          </div>
          {error && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs text-gray-500">Local demo account: user@test.com / password</p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
