import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

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
  
          
          <RouterConfig />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
