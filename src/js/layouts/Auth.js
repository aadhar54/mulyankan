import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import WelcomeNav from './../components/WelcomeNav';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

const auth = firebase.auth();
const Auth = ({ mode, setMode }) => {
  const [user, loading, error] = useAuthState(auth);
  const [visibility, setVisibility] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = e => {
    e.preventDefault();
    if (email) {
      if (password) {
        if (emailValidationRegex.test(email)) {
          if (password.length >= 8) {
            auth
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                toast.success('You have been signed in.');
              })
              .catch(err => {
                console.log(err);
                toast.error(err.message, { autoClose: 6000 });
              });
          } else {
            toast.warn('The password must be at least 8 characters.', {
              autoClose: 5000
            });
          }
        } else {
          toast.warn(
            'You have entered an invalid email. Please check the syntax.',
            { autoClose: 5000 }
          );
        }
      } else {
        toast.warn('Please enter a proper password.', {
          autoClose: 5000
        });
      }
    } else {
      toast.warn('Please enter a proper email address.', {
        autoClose: 5000
      });
    }
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
  }, [mode]);

  const signUp = e => {
    e.preventDefault();
    if (name) {
      if (email) {
        if (password) {
          if (emailValidationRegex.test(email)) {
            if (password.length >= 8) {
              auth
                .createUserWithEmailAndPassword(email, password)
                .then(userData => {
                  console.log(user);
                  console.log(userData.user.uid, user);
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(userData.user.uid)
                    .set({
                      name,
                      email
                    })
                    .then(doc => {
                      console.log(doc);
                      toast.success('You have been successfully registered!');
                    })
                    .catch(err => {
                      toast.error(err.message);
                    });
                })
                .catch(err => toast.error(err.message, { autoClose: 5000 }));
            } else {
              toast.warn('The password must be at least 8 characters.', {
                autoClose: 5000
              });
            }
          } else {
            toast.warn(
              'You have entered an invalid email. Please check the syntax.',
              { autoClose: 5000 }
            );
          }
        } else {
          toast.warn('Please enter a proper password.', {
            autoClose: 5000
          });
        }
      } else {
        toast.warn('Please enter a proper email address.', {
          autoClose: 5000
        });
      }
    } else {
      toast.warn('Please enter a proper name.', {
        autoClose: 5000
      });
    }
  };

  const emailValidationRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return (
    <div className="auth">
      <div className="auth-container">
        <WelcomeNav active="auth" mode={mode} />
        <div className="auth-contents">
          {user ? (
            <Redirect to="/" />
          ) : mode === 'signin' ? (
            <div className="auth__form-container">
              <form onSubmit={e => signIn(e)} className="auth__form">
                <div className="auth__input-wrapper">
                  <i className="material-icons">email</i>
                  <input
                    className="auth__input"
                    type="text"
                    id="signin-email"
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="auth__input-wrapper">
                  {password === '' ? (
                    <i className="material-icons">vpn_key</i>
                  ) : visibility ? (
                    <i
                      style={{ cursor: 'pointer' }}
                      onClick={() => setVisibility(false)}
                      className="material-icons"
                    >
                      visibility_off
                    </i>
                  ) : (
                    <i
                      style={{ cursor: 'pointer' }}
                      onClick={() => setVisibility(true)}
                      className="material-icons"
                    >
                      visibility
                    </i>
                  )}
                  <input
                    onChange={e => setPassword(e.target.value)}
                    className="auth__input"
                    placeholder="Password"
                    id="signin-password"
                    type={visibility ? 'text' : 'password'}
                  />
                </div>
                <button className="auth__submit">Sign In</button>
              </form>
            </div>
          ) : mode === 'signup' ? (
            <div className="auth__form-container">
              <form
                onSubmit={e => signUp(e)}
                className="auth__form"
                autoComplete="false"
              >
                <div className="auth__input-wrapper">
                  <i className="material-icons">face</i>
                  <input
                    className="auth__input"
                    type="name"
                    id="signup-name"
                    onChange={e => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div className="auth__input-wrapper">
                  <i className="material-icons">email</i>
                  <input
                    onChange={e => setEmail(e.target.value)}
                    className="auth__input"
                    type="text"
                    id="signup-email"
                    placeholder="Email"
                  />
                </div>
                <div className="auth__input-wrapper">
                  {password === '' ? (
                    <i className="material-icons">vpn_key</i>
                  ) : visibility ? (
                    <i
                      style={{ cursor: 'pointer' }}
                      onClick={() => setVisibility(false)}
                      className="material-icons"
                    >
                      visibility_off
                    </i>
                  ) : (
                    <i
                      style={{ cursor: 'pointer' }}
                      onClick={() => setVisibility(true)}
                      className="material-icons"
                    >
                      visibility
                    </i>
                  )}
                  <input
                    onChange={e => setPassword(e.target.value)}
                    className="auth__input"
                    placeholder="Password"
                    id="signup-password"
                    type={visibility ? 'text' : 'password'}
                  />
                </div>
                <button className="auth__submit">Sign Up</button>
              </form>
            </div>
          ) : null}
          {mode === 'signin' ? (
            <p className="auth-accessory-text">
              Don't have an account ? No worries,{' '}
              <span
                className="auth-accessory-text-action"
                onClick={() => setMode('signup')}
              >
                Sign Up
              </span>{' '}
              now to get awesome features!
            </p>
          ) : (
            <p className="auth-accessory-text">
              Already have an account ?{' '}
              <span
                className="auth-accessory-text-action"
                onClick={() => setMode('signin')}
              >
                Sign In
              </span>{' '}
              to sync all your saved documents.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
