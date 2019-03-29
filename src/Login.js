import React, { Component } from 'react';
import { GoogleRedirectCredential } from 'mongodb-stitch-browser-sdk';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userName: 'Unnamed user'
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    if (this.props.client.auth.hasRedirectResult()) {
      this.props.client.auth.handleRedirectResult().then(user => {
        console.log(user);
        if (user) {
          this.setState({
            isLoggedIn: true,
            name: user.name
          });
        }
      });
    }
    if (this.props.client.auth.isLoggedIn) {
    }
  }

  login(e) {
    e.preventDefault();
    if (!this.props.client.auth.isLoggedIn) {
      const credential = new GoogleRedirectCredential();
      this.props.client.auth.loginWithRedirect(credential);
    }
  }

  logout(e) {
    e.preventDefault();
    if (this.props.client.auth.isLoggedIn) {
      this.props.client.auth.logout().then(response => {
        console.log(response);
        if (response) {
          this.setState({
            isLoggedIn: false,
            name: ''
          });
        }
      });
    }
  }

  render() {
    const isLoggedIn = this.props.client.auth.isLoggedIn;

    if (isLoggedIn) {
      const name = this.props.client.auth.profile
        ? this.props.client.auth.profile.name
        : 'Unnamed user';

      return (
        <React.Fragment>
          <li>
            <a href="#no-link" className="no-link">
              Welcome, {name}
            </a>
          </li>
          <li>
            <a href="#logout" onClick={this.logout}>
              Log Out
            </a>
          </li>
        </React.Fragment>
      );
    } else {
      return (
        <li>
          <a href="#login" onClick={this.login}>
            Log In
          </a>
        </li>
      );
    }
  }
}
