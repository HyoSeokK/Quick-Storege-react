import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware,compose } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

const logger = createLogger();

 const createStoreWithMiddleware = createStore(reducers, applyMiddleware(logger,thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
