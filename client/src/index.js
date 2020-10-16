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

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { PersistGate } from 'redux-persist/integration/react';

const logger = createLogger();
const persistConfig = {
  key:'root',
  storage
}
const persistedReducer = persistReducer(persistConfig,reducers);

 const createStoreWithMiddleware = createStore(persistedReducer, applyMiddleware(logger,thunk));

 let persistor = persistStore(createStoreWithMiddleware);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStoreWithMiddleware}>
      <PersistGate loading={null} persistor={persistor}>
          <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.register();
