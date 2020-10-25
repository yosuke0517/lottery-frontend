import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import * as serviceWorker from './serviceWorker';
import Login from './components/Login';
import App from './App';
import Home from './components/Home';

const routing = (
  <React.StrictMode>
    <BrowserRouter>
      {/* propsでcookieが使えるようにする*/}
      <CookiesProvider>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        {/* TODO まとめる方法はないか確認*/}
        <Route exact path="/miniloto" component={App} />
        <Route exact path="/lotosix" component={App} />
        <Route exact path="/lotoseven" component={App} />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
