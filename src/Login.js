import React, { Component } from 'react';
import { GoogleRedirectCredential } from 'mongodb-stitch-browser-sdk';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userName: undefined
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    if (this.props.client.auth.hasRedirectResult()) {
      this.props.client.auth.handleRedirectResult().then(user => {
        if (user) {
          this.setState({
            isLoggedIn: true,
            userName: user.profile.name
          });
          // add ID to profile for when creating notifications
          const profile = user.profile;
          profile.id = user.id;
          this.props.handleUpdateProfile(profile);
        }
      });
    }
  }

  login(e) {
    e.preventDefault();
    if (!this.state.isLoggedIn) {
      const credential = new GoogleRedirectCredential(
        window.location.origin + this.props.homeUrl
      );
      this.props.client.auth.loginWithRedirect(credential);
    }
  }

  logout(e) {
    e.preventDefault();
    if (this.state.isLoggedIn) {
      this.props.client.auth.logout().then(response => {
        if (response) {
          this.setState({
            isLoggedIn: false,
            userName: undefined
          });
          this.props.handleUpdateProfile({});
        }
      });
    }
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <React.Fragment>
          <li>
            <a href="#no-link" className="no-link">
              Welcome, {this.state.userName}
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
