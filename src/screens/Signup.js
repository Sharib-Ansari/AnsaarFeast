import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL;

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [address, setAddress] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  let navigate = useNavigate();

  // Fetch current location — gracefully handles denial or unavailability
  const handleLocationClick = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser. Please enter your address manually.');
      return;
    }

    setLocationLoading(true);

    let coords;
    try {
      coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        });
      });
    } catch (geoErr) {
      setLocationLoading(false);
      if (geoErr.code === 1) {
        setErrorMsg('Location permission denied. Please enter your address manually.');
      } else {
        setErrorMsg('Could not determine your location. Please enter your address manually.');
      }
      return;
    }

    try {
      const { latitude: lat, longitude: long } = coords.coords;
      const response = await fetch(`${API_URL}/api/auth/getlocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latlong: { lat, long } }),
      });
      const json = await response.json();
      if (json.location) {
        setAddress(json.location);
      } else {
        setErrorMsg(json.error || 'Could not fetch address. Please enter it manually.');
      }
    } catch (fetchErr) {
      setErrorMsg('Could not reach the server for geocoding. Please enter your address manually.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/createuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: address,
        }),
      });
      const json = await response.json();

      if (json.success) {
        localStorage.setItem('token', json.authToken);
        navigate('/login');
      } else {
        const msg =
          json.error ||
          (json.errors && json.errors.map((err) => err.msg).join(', ')) ||
          'Could not create account.';
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
          'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
      }}
    >
      <Navbar />

      <div className="af-auth-container">
        <div className="af-auth-card">
          {/* Header */}
          <div className="af-auth-logo">AnsaarFeast</div>
          <h1 className="af-auth-title">Create account</h1>
          <p className="af-auth-subtitle">Join us and start ordering today</p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="af-form-group">
              <label htmlFor="signupName" className="af-form-label">
                Full Name
              </label>
              <input
                id="signupName"
                type="text"
                className="af-form-input form-control"
                name="name"
                placeholder="Enter your full name"
                value={credentials.name}
                onChange={onChange}
                minLength={3}
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div className="af-form-group">
              <label htmlFor="signupEmail" className="af-form-label">
                Email address
              </label>
              <input
                id="signupEmail"
                type="email"
                className="af-form-input form-control"
                name="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Address */}
            <div className="af-form-group">
              <label htmlFor="signupAddress" className="af-form-label">
                Address{' '}
                <span style={{ fontWeight: 400, color: 'var(--af-text-muted)', fontSize: '0.78rem' }}>
                  (optional)
                </span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  id="signupAddress"
                  type="text"
                  className="af-form-input form-control"
                  name="address"
                  placeholder="Type your address or use location"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleLocationClick}
                  className="af-location-btn btn"
                  disabled={locationLoading}
                  title="Use current location"
                  aria-label="Use current location"
                  style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
                >
                  {locationLoading ? '⏳' : '📍'}
                </button>
              </div>
              <p className="af-form-hint">You can enter your address manually or use GPS.</p>
            </div>

            {/* Password */}
            <div className="af-form-group">
              <label htmlFor="signupPassword" className="af-form-label">
                Password
              </label>
              <input
                id="signupPassword"
                type="password"
                className="af-form-input form-control"
                name="password"
                placeholder="Min. 5 characters"
                value={credentials.password}
                onChange={onChange}
                minLength={5}
                autoComplete="new-password"
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
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer link */}
          <div className="af-auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}