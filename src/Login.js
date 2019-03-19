import React, { Component } from 'react';
import { GoogleRedirectCredential } from 'mongodb-stitch-browser-sdk';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userName: 'Unnamed user'
    };
    // this.state = {
    //   auth: {
    //     id: 0,
    //     profile: {
    //       name: "John Doe"
    //     }
    //   },
    //   loggedIn: this.props.client.auth.isLoggedIn
    // };

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
      // console.log(this.props.client);
    }
    // if (this.state.isLoggedIn) {
    //   this.setState(state => ({
    //     auth: {
    //       id: "5c6dc85f3e1e1e27a8131855",
    //       profile: {
    //         email: "robbert.kauffman@mongodb.com",
    //         firstName: "Robbert",
    //         lastName: "Kauffman",
    //         name: "Robbert Kauffman",
    //       }
    //     }
    //   }));
    // }
  }

  login(e) {
    e.preventDefault();
    if (!this.props.client.auth.isLoggedIn) {
      const credential = new GoogleRedirectCredential();
      this.props.client.auth.loginWithRedirect(credential);
      // this.props.client.auth.isLoggedIn = true;
    }
    // e.preventDefault();
    // if (!this.state.isLoggedIn) {
    //   this.setState(state => ({
    //     isLoggedIn: true
    //   }));
    // }
  }

  logout(e) {
    e.preventDefault();
    if (this.props.client.auth.isLoggedIn) {
      // const credential = new GoogleRedirectCredential();
      // this.props.client.auth.loginWithRedirect(credential);
      this.props.client.auth.logout().then(response => {
        console.log(response);
        if (response) {
          this.setState({
            isLoggedIn: false,
            name: ''
          });
        }
      });
      // this.props.client.auth.isLoggedIn = true;
    }
    // e.preventDefault();
    // if (this.state.isLoggedIn) {
    //   this.setState(state => ({
    //     isLoggedIn: false
    //   }));
    // }
  }

  render() {
    const isLoggedIn = this.props.client.auth.isLoggedIn;
    // const isLoggedIn = this.state.isLoggedIn;

    if (isLoggedIn) {
      const name = this.props.client.auth.profile
        ? this.props.client.auth.profile.name
        : 'Unnamed user';
      // const name = this.state.auth.profile.name;

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
