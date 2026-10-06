import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  let data = useCart();
  let navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastHiding, setToastHiding] = useState(false);
  const toastTimerRef = useRef(null);
  const priceRef = useRef();

  let options = props.options;
  let priceOptions = Object.keys(options);
  let foodItem = props.item;
  const dispatch = useDispatchCart();

  const handleClick = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  };

  const handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleOptions = (e) => {
    setSize(e.target.value);
  };

  const showToast = () => {
    // Clear any pending hide timer
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastHiding(false);
    setToastVisible(true);

    // Begin hiding after 2.2 seconds
    toastTimerRef.current = setTimeout(() => {
      setToastHiding(true);
      // Remove from DOM after hide animation
      setTimeout(() => {
        setToastVisible(false);
        setToastHiding(false);
      }, 380);
    }, 2200);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleAddToCart = async () => {
    // Redirect to login if not authenticated
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    // Find existing cart entry for this food item (by id)
    const existingItem = data.find((item) => item.id === foodItem._id);

    if (existingItem) {
      if (existingItem.size === size) {
        // Same size — update quantity and price
        await dispatch({
          type: 'UPDATE',
          id: foodItem._id,
          price: finalPrice,
          qty: qty,
        });
      } else {
        // Different size — add as separate entry
        await dispatch({
          type: 'ADD',
          id: foodItem._id,
          name: foodItem.name,
          price: finalPrice,
          qty: qty,
          size: size,
          img: props.ImgSrc,
        });
      }
    } else {
      // Not in cart yet — add it
      await dispatch({
        type: 'ADD',
        id: foodItem._id,
        name: foodItem.name,
        price: finalPrice,
        qty: qty,
        size: size,
        img: props.ImgSrc,
      });
    }

    showToast();
  };

  useEffect(() => {
    setSize(priceRef.current.value);
  }, []);

  let finalPrice = qty * parseInt(options[size]);

  return (
    <div className="af-food-card">
      {/* Image */}
      <div className="af-card-img-wrap">
        <img
          src={props.ImgSrc}
          className="af-card-img"
          alt={props.foodName}
        />
        <div className="af-card-img-overlay" />
      </div>

      {/* Body */}
      <div className="af-card-body">
        <h5 className="af-card-title" title={props.foodName}>
          {props.foodName}
        </h5>

        {/* Qty + Size + Price row */}
        <div className="af-card-controls">
          <select
            className="af-card-select"
            onClick={handleClick}
            onChange={handleQty}
            aria-label="Quantity"
          >
            {Array.from(Array(6), (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select
            className="af-card-select"
            ref={priceRef}
            onClick={handleClick}
            onChange={handleOptions}
            aria-label="Portion size"
          >
            {priceOptions.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>

          <span className="af-card-price">₹{finalPrice}</span>
        </div>

        <hr className="af-card-divider" />

        {/* Add to Cart button */}
        <button
          className="af-add-btn btn"
          onClick={handleAddToCart}
        >
          + Add to Cart
        </button>

        {/* Success toast */}
        {toastVisible && (
          <div className={`af-cart-toast${toastHiding ? ' hiding' : ''}`} role="status" aria-live="polite">
            <span className="af-toast-icon">✓</span>
            <span>{props.foodName} added to cart</span>
          </div>
        )}
      </div>
    </div>
  );
}
