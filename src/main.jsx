import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Auth0Provider
      domain="dev-h4m4j104bctml7cc.us.auth0.com"
      clientId="9OuYsf0VRJpAnG7BT6QTk89WafktB19P"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://dev-h4m4j104bctml7cc.us.auth0.com/api/v2/',
        scope: 'openid profile email'
      }}
      logoutParams={{
        returnTo: window.location.origin
      }}
      onError={(err) => console.error('Auth0 Error:', err)}
    >
      <App />
    </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
)
