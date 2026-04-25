import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CREDENTIALS } from '../data/competitions';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!form.username || !form.password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (
        form.username === ADMIN_CREDENTIALS.username &&
        form.password === ADMIN_CREDENTIALS.password
      ) {
        sessionStorage.setItem('aes_admin', '1');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="screen-container bg-primary-500 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-primary-400 opacity-30 -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary-700 opacity-30 translate-y-1/3 -translate-x-1/3" />

      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Icon */}
        <div className="animate-fade-in-up stagger-1 text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-white mx-auto flex items-center justify-center mb-4 shadow-xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#1B3A6B" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#1B3A6B" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="#D4A017" />
            </svg>
          </div>
          <h1 className="text-white font-black text-2xl">Admin Login</h1>
          <p className="text-primary-200 text-sm font-medium mt-1">AES Registration Portal</p>
        </div>

        {/* Form card */}
        <div className="animate-fade-in-up stagger-2 bg-white rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="admin"
                  value={form.username}
                  onChange={e => { setForm(p => ({ ...p, username: e.target.value })); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Logging in…
                </>
              ) : '🔐 Login'}
            </button>
          </div>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="animate-fade-in-up stagger-3 mt-5 text-primary-200 hover:text-white text-sm font-medium text-center transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
