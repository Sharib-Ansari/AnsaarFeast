import React from 'react';
import ReactDom from 'react-dom';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: '#161a18',
  transform: 'translate(-50%, -50%)',
  zIndex: 1050,
  maxHeight: '88vh',
  width: '92%',
  maxWidth: '860px',
  borderRadius: '16px',
  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(34, 197, 94, 0.15)',
  border: '1px solid rgba(34, 197, 94, 0.15)',
  overflowY: 'auto',
  padding: '28px',
};

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 1040,
};

const CLOSE_BTN_STYLES = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  border: '1.5px solid rgba(220, 38, 38, 0.4)',
  background: 'rgba(220, 38, 38, 0.12)',
  color: '#f87171',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  cursor: 'pointer',
  zIndex: 1051,
  lineHeight: '1',
  padding: 0,
  transition: 'all 0.2s ease',
};

export default function Modal({ children, onClose }) {
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />
      <div style={MODAL_STYLES} className="af-modal-container" role="dialog" aria-modal="true">
        <button
          style={CLOSE_BTN_STYLES}
          onClick={onClose}
          aria-label="Close modal"
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.35)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(220,38,38,0.12)';
            e.currentTarget.style.color = '#f87171';
          }}
        >
          ✕
        </button>
        {children}
      </div>
    </>,
    document.getElementById('cart-root')
  );
}