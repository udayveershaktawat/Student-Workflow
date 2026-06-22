import React from 'react';
import ReactDOM from 'react-dom/client';
import keycloak from './keycloak';
import App from './App';

keycloak
  .init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false })
  .then((authenticated) => {
    if (!authenticated) {
      keycloak.login();
      return;
    }
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => {
    document.getElementById('root').innerText =
      'Keycloak init failed. Is Keycloak running on :8081? ' + err;
  });
