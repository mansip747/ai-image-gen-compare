import React from 'react';
import './Header.scss';

const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="logo-section">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <img src="/favicon.png" alt="Logo" className="logo" />
        <h1>AI Image Generation and Compare</h1>
      </div>
    </header>
  );
};

export default Header;
