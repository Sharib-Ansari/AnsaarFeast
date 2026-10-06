import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const API_URL = process.env.REACT_APP_API_URL;

export default function MyOrder() {
  const [orderData, setOrderData] = useState(null);

  const fetchMyOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/myOrderData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem('userEmail') }),
      });
      const json = await res.json();
      setOrderData(json.orderData);
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div style={{ background: 'var(--af-bg)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container af-orders-page">
        <h1 className="af-orders-title">My Orders</h1>
        <p className="af-orders-subtitle">Your complete order history</p>

        {orderData && orderData.order_data ? (
          orderData.order_data
            .slice()
            .reverse()
            .map((orderGroup, groupIndex) => {
              const dateEntry = orderGroup.find((item) => item.Order_date);
              const dateLabel = dateEntry ? dateEntry.Order_date : '';
              const foodItems = orderGroup.filter((item) => !item.Order_date);

              return (
                <div key={groupIndex} className="af-order-group">
                  {/* Order date badge */}
                  {dateLabel && (
                    <div className="af-order-date">
                      📅 {dateLabel}
                    </div>
                  )}
                  <hr className="af-order-divider" />

                  {/* Cards row */}
                  <div className="af-cards-row">
                    {foodItems.map((item, itemIndex) => (
                      <div
                        key={`${groupIndex}-${itemIndex}`}
                        className="af-order-card"
                      >
                        <img
                          src={item.img}
                          className="af-order-card-img"
                          alt={item.name}
                        />
                        <div className="af-order-card-body">
                          <div className="af-order-card-title" title={item.name}>
                            {item.name}
                          </div>
                          <div className="af-order-card-meta">
                            <span>Qty: {item.qty}</span>
                            <span>·</span>
                            <span style={{ textTransform: 'capitalize' }}>{item.size}</span>
                          </div>
                          <div className="af-order-card-price">₹{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--af-text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {orderData === null ? 'Loading your orders…' : 'No orders yet.'}
            </p>
            {orderData !== null && (
              <p style={{ fontSize: '0.88rem' }}>Place your first order to see it here!</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}