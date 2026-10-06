import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('token', json.authToken);
        navigate('/');
      } else {
        const msg =
          json.error ||
          (json.errors && json.errors.map((e) => e.msg).join(', ')) ||
          'Invalid credentials.';
        setErrorMsg(msg);
      }
    } catch (err) {
      setErrorMsg('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="af-auth-page"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/326278/pexels-photo-326278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
      }}
    >
      <Navbar />

      <div className="af-auth-container">
        <div className="af-auth-card">
          {/* Header */}
          <div className="af-auth-logo">AnsaarFeast</div>
          <h1 className="af-auth-title">Welcome back</h1>
          <p className="af-auth-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="af-form-group">
              <label htmlFor="loginEmail" className="af-form-label">
                Email address
              </label>
              <input
                id="loginEmail"
                type="email"
                className="af-form-input form-control"
                name="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
              <p className="af-form-hint">We'll never share your email with anyone.</p>
            </div>

            {/* Password */}
            <div className="af-form-group">
              <label htmlFor="loginPassword" className="af-form-label">
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                className="af-form-input form-control"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={onChange}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="af-alert-error alert" role="alert">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="af-btn-primary btn mt-2"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer link */}
          <div className="af-auth-footer">
            New to AnsaarFeast?{' '}
            <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}