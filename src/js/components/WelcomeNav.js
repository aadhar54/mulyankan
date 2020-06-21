import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeNav = ({ active }) => {
  return (
    <div className="welcome-nav-wrapper">
      <p className="welcome__title">
        <span className="welcome__title--main">mulyankan</span>
        <span className="welcome__title--sub">
          Checking Papers Online Made Easy.
        </span>
      </p>
      <nav className="welcome-nav">
        <ul className="welcome-nav-list">
          <Link to="/" id="home" style={{ display: 'none' }}>
            home
          </Link>
          <Link to="/help" id="help" style={{ display: 'none' }}>
            help
          </Link>
          <li
            className={`welcome-nav-item ${
              active === 'home' ? 'welcome-nav-item-active' : ''
            }`}
            onClick={() => document.querySelector('#home').click()}
          >
            Home
          </li>
          <li
            className={`welcome-nav-item ${
              active === 'help' ? 'welcome-nav-item-active' : ''
            }`}
            onClick={() => document.querySelector('#help').click()}
          >
            Help
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default WelcomeNav;
