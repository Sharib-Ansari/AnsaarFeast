import React from 'react';

export default function Footer() {
  return (
    <footer className="af-footer">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          {/* Brand */}
          <div>
            <div className="af-footer-brand">AnsaarFeast</div>
            <div className="af-footer-tagline">Good food❣️. Great moments💖.</div>
          </div>

          {/* Quick links */}
          <nav className="d-flex gap-4">
            <a href="/" className="af-footer-tagline text-decoration-none" style={{ transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--af-green)'}
              onMouseLeave={e => e.target.style.color = ''}>
              Home
            </a>
            <a href="/login" className="af-footer-tagline text-decoration-none" style={{ transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--af-green)'}
              onMouseLeave={e => e.target.style.color = ''}>
              Login
            </a>
            <a href="/signup" className="af-footer-tagline text-decoration-none" style={{ transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--af-green)'}
              onMouseLeave={e => e.target.style.color = ''}>
              Sign Up
            </a>
          </nav>

          {/* Copyright */}
          <div className="af-footer-tagline">Made With Love By SHARIB ANSARI ❤️.</div>
          <p className="af-footer-copy mb-0">
            © {new Date().getFullYear()} AnsaarFeast, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
