import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Redux Store
import { store } from './redux/store';

// Navigation
import RouterConfig from './navigation/RouterConfig';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          
          <RouterConfig />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
