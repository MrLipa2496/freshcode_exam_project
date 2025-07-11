/* eslint-disable react/prop-types */

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import * as serviceWorker from './serviceWorker';
import store from './store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

serviceWorker.unregister();
