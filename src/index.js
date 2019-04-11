import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

import Cart from './Cart/Cart';
import Home from './Home';
import Login from './Login';
import ProductItemDetail from './ProductDetail/ProductItemDetail';
import UserContext from './UserContext';

export default class Routing extends Component {
  constructor(props) {
    // replace Stitch App ID in the next line
    const stitchAppId = 'mongomart-vyoeg';

    super(props);
    this.state = {
      client: Stitch.initializeDefaultAppClient(stitchAppId),
      homeUrl: '/',
      userProfile: {}
    };
    this.homeCallback = this.homeCallback.bind(this);
    this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
  }

  componentDidMount() {}

  homeCallback(node, homeUrl) {
    // define home URL which is used by login redirect
    this.setState({ homeUrl: node.getAttribute('href') });
  }

  handleUpdateProfile(profile) {
    // user profile is updated when logging in and shared through UserContext
    this.setState({ userProfile: profile });
  }

  render() {
    const db = this.state.client
      .getServiceClient(RemoteMongoClient.factory, 'mm-products')
      .db('mongomart');

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <React.Fragment>
          <nav
            className="navbar navbar-inverse navbar-fixed-top"
            role="navigation"
          >
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
                <Link
                  className="navbar-brand"
                  to="/"
                  innerRef={this.homeCallback}
                >
                  MongoMart
                </Link>
              </div>
              <div
                className="collapse navbar-collapse"
                id="bs-example-navbar-collapse-1"
              >
                <ul className="nav navbar-nav">
                  <Login
                    client={this.state.client}
                    homeUrl={this.state.homeUrl}
                    handleUpdateProfile={this.handleUpdateProfile}
                  />
                </ul>
                <div className="collapse navbar-collapse">
                  <form
                    className="navbar-form navbar-right"
                    role="search"
                    action="/search"
                  >
                    {/* <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="query"
                        placeholder="Search"
                      />
                    </div>
                    <button type="submit" className="btn btn-default">
                      Submit
                    </button> */}
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
            <UserContext.Provider value={this.state.userProfile}>
              <Route
                exact
                path="/"
                render={props => (
                  <Home {...props} client={this.state.client} db={db} />
                )}
              />
              <Route
                path="/category/:category"
                render={props => (
                  <Home {...props} client={this.state.client} db={db} />
                )}
              />
              <Route
                path="/cart"
                render={props => (
                  <Cart {...props} client={this.state.client} db={db} />
                )}
              />
              <Route
                path="/item/:id"
                render={props => (
                  <ProductItemDetail
                    {...props}
                    client={this.state.client}
                    db={db}
                  />
                )}
              />
            </UserContext.Provider>
          </div>
        </React.Fragment>
      </Router>
    );
  }
}

ReactDOM.render(<Routing />, document.getElementById('root'));
