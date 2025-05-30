/* eslint-disable react/prop-types */

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import * as serviceWorker from './serviceWorker';
import store from './store';
import App from './App';

/* ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
); */
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
