import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

import Cart from './Cart/Cart';
import Home from './Home';
import Login from './Login';
import ProductItemDetail from './ProductDetail/ProductItemDetail';

const client = Stitch.initializeDefaultAppClient('mongomart-vyoeg');
const db = client
  .getServiceClient(RemoteMongoClient.factory, 'mm-products')
  .db('mongomart');

const Routing = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <React.Fragment>
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to="/">
              MongoMart
            </Link>
          </div>
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav">
              <Login client={client} />
            </ul>
            <div className="collapse navbar-collapse">
              <form
                className="navbar-form navbar-right"
                role="search"
                action="/search"
              >
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="query"
                    placeholder="Search"
                  />
                </div>
                <button type="submit" className="btn btn-default">
                  Submit
                </button>
                <Link to="/cart">
                  <button type="button" className="btn btn-success">
                    <span
                      className="glyphicon glyphicon-shopping-cart"
                      aria-hidden="true"
                    />{' '}
                    Cart
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <Route
          exact
          path="/"
          render={props => <Home {...props} client={client} db={db} />}
        />
        <Route
          path="/category/:category"
          render={props => <Home {...props} client={client} db={db} />}
        />
        <Route
          path="/cart"
          render={props => <Cart {...props} client={client} db={db} />}
        />
        <Route
          path="/item/:id"
          render={props => (
            <ProductItemDetail {...props} client={client} db={db} />
          )}
        />
      </div>
    </React.Fragment>
  </Router>
);

ReactDOM.render(<Routing />, document.getElementById('root'));
