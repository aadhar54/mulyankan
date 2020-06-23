import React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

firebase.initializeApp({
  apiKey: 'AIzaSyCVmoFHsKitugdpAC_-_5cSagm2A-U33WM',
  authDomain: 'mulyankan-58611.firebaseapp.com',
  databaseURL: 'https://mulyankan-58611.firebaseio.com',
  projectId: 'mulyankan-58611',
  storageBucket: 'mulyankan-58611.appspot.com',
  messagingSenderId: '1020776798090',
  appId: '1:1020776798090:web:b7ca45e8bd6719b9e01a73',
  measurementId: 'G-TG3L97WYT9'
});

const auth = firebase.auth();

const WelcomeNav = ({ active, mode }) => {
  const [user, loading, error] = useAuthState(auth);

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
          <Link to="/auth" id="auth" style={{ display: 'none' }}>
            auth
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
          <li
            onClick={() => {
              if (user) {
                auth
                  .signOut()
                  .then(() => {
                    toast.warn('You have been signed out.');
                  })
                  .catch(err => {
                    toast.error(err.message);
                  });
                // keep this here. idk it doesnt work without settimeout
                setTimeout(() => document.querySelector('#auth').click(), 0);
              } else {
                document.querySelector('#auth').click();
              }
            }}
            className={`welcome-nav-item ${
              active === 'auth' ? 'welcome-nav-item-active' : ''
            }`}
          >
            {user ? 'Sign Out' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default WelcomeNav;
