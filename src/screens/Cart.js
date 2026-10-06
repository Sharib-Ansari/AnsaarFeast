import React from 'react';
import Delete from '@material-ui/icons/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';

const API_URL = process.env.REACT_APP_API_URL;

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className="af-cart-wrap af-cart-empty">
        <div className="af-cart-empty-icon">🛒</div>
        <div className="af-cart-empty-text">Your cart is empty</div>
        <p style={{ color: 'var(--af-text-muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
          Add some delicious food to get started!
        </p>
      </div>
    );
  }

  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem('userEmail');
    try {
      const response = await fetch(`${API_URL}/api/auth/orderData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString(),
        }),
      });
      if (response.status === 200) {
        dispatch({ type: 'DROP' });
      } else {
        const json = await response.json();
        alert(json.error || 'Could not place order. Please try again.');
      }
    } catch (err) {
      alert('Could not reach the server. Is the backend running?');
    }
  };

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="af-cart-wrap">
      {/* Header */}
      <div className="af-cart-header">
        🛒 Your Cart
        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--af-text-muted)' }}>
          ({data.length} {data.length === 1 ? 'item' : 'items'})
        </span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="af-cart-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Size</th>
              <th>Price</th>
              <th style={{ textAlign: 'right' }}>Remove</th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <td style={{ color: 'var(--af-text-muted)', width: '2rem' }}>{index + 1}</td>
                <td className="af-cart-item-name">{food.name}</td>
                <td>{food.qty}</td>
                <td style={{ textTransform: 'capitalize' }}>{food.size}</td>
                <td className="af-cart-price">₹{food.price}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn af-cart-remove-btn"
                    aria-label={`Remove ${food.name}`}
                    onClick={() => dispatch({ type: 'REMOVE', index: index })}
                  >
                    <Delete style={{ fontSize: '1.1rem' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: total + checkout */}
      <div className="af-cart-footer">
        <div className="af-cart-total">
          Total:{' '}
          <span className="af-cart-total-amount">₹{totalPrice}</span>
        </div>
        <button
          className="btn af-checkout-btn"
          onClick={handleCheckOut}
        >
          Place Order →
        </button>
      </div>
    </div>
  );
}
