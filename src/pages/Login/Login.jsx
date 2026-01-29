import React from 'react';
import './Login.scss';

const Login = ({ onSSOLogin, isLoggingIn }) => {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>AI Image Generation and Compare</h1>
        <p>Please sign in with your ASU account to continue.</p>

        <button
          type="button"
          onClick={onSSOLogin}
          disabled={isLoggingIn}
          className="login-btn"
        >
          {isLoggingIn ? 'Redirecting to ASU Login…' : 'Login with ASU SSO'}
        </button>
      </div>
    </div>
  );
};

export default Login;
