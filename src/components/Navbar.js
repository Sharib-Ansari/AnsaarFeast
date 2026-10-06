import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useCart } from './ContextReducer';
import Modal from '../Modal';
import Cart from '../screens/Cart';

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const items = useCart();

  return (
    <nav className="af-navbar navbar navbar-expand-lg">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand af-navbar-brand" to="/">
          AnsaarFeast
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#afNavbar"
          aria-controls="afNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="afNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {localStorage.getItem('token') && (
              <li className="nav-item">
                <Link className="nav-link" to="/myorder">
                  My Orders
                </Link>
              </li>
            )}
          </ul>

          {/* Right-side controls */}
          <div className="d-flex align-items-center gap-2">
            {!localStorage.getItem('token') ? (
              <>
                <Link
                  className="btn af-nav-btn af-nav-btn-outline"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="btn af-nav-btn af-nav-btn-solid"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <button
                  className="btn af-cart-btn"
                  onClick={() => setCartView(true)}
                  aria-label={`Cart (${items.length} items)`}
                >
                  <Badge color="secondary" badgeContent={items.length}>
                    <ShoppingCartIcon style={{ fontSize: '1.2rem' }} />
                  </Badge>
                  <span className="d-none d-sm-inline ms-1">Cart</span>
                </button>

                {cartView && (
                  <Modal onClose={() => setCartView(false)}>
                    <Cart />
                  </Modal>
                )}

                <button
                  onClick={handleLogout}
                  className="btn af-nav-btn af-nav-btn-outline"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
