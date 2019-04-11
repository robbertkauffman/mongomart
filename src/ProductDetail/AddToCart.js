import React, { Component } from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';

import Error from '../Error';
import NotifyMeButton from './NotifyMeButton';
import UserContext from '../UserContext';

export default class AddToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addToCartError: undefined,
      setNotificationError: undefined
    };
    this.addToCart = this.addToCart.bind(this);
    this.handleSetNotification = this.handleSetNotification.bind(this);
  }

  componentDidMount() {}

  addToCart() {
    this.incrementProductQuantity();
  }

  incrementProductQuantity() {
    // first try to increment quantity of item in cart,
    // if fails, add item to cart or create cart (upsert)
    let incQuery = {
      userid: this.props.client.auth.currentUser.id,
      'items._id': this.props.item._id
    };
    const incUpdate = { $inc: { 'items.$.quantity': 1 } };

    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        // increment quantity by one
        this.props.db.collection('cart').updateOne(incQuery, incUpdate)
      )
      .then(response => {
        if (response && response.modifiedCount !== 1) {
          // if not incremented,
          // either add item to cart or create new cart (upsert)
          this.createCartOrCartItem();
        } else {
          this.onAddToCartSuccess();
        }
      })
      .catch(err => {
        this.onAddToCartError(err);
      });
  }

  createCartOrCartItem() {
    let addQuery = { userid: this.props.client.auth.currentUser.id };
    let addItem = this.props.item;
    addItem.quantity = 1;
    const addUpdate = { $addToSet: { items: addItem } };
    const options = { upsert: true };

    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.props.db.collection('cart').updateOne(addQuery, addUpdate, options)
      )
      .then(() => {
        this.onAddToCartSuccess();
      })
      .catch(err => {
        this.onAddToCartError(err);
      });
  }

  onAddToCartSuccess() {
    this.setState({ addToCartError: null });
    this.refs.addToCartButton.setAttribute('disabled', '');
    this.refs.addToCartButton.textContent = 'Added item to cart';
    this.refs.addToCartButton.className =
      this.refs.addToCartButton.className + ' success';
  }

  onAddToCartError(err) {
    this.setState({ addToCartError: err });
  }

  handleSetNotification(profile) {
    console.log(profile);
    const notificationDocument = {
      itemId: this.props.item._id,
      userid: profile.id,
      email: profile.email
    };
    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.props.db.collection('notify').insertOne(notificationDocument)
      )
      .then(() => {
        this.onSetNotificationSuccess();
      })
      .catch(err => {
        this.onSetNotificationError(err);
      });
  }

  onSetNotificationSuccess() {
    this.setState({ setNotificationError: null });
  }

  onSetNotificationError(err) {
    this.setState({ setNotificationError: err });
  }

  render() {
    const item = this.props.item;
    if (item.stock > 0) {
      return (
        <React.Fragment>
          <button
            className="btn btn-primary"
            type="submit"
            ref="addToCartButton"
            onClick={this.addToCart}
          >
            Add to cart
            <span className="glyphicon glyphicon-chevron-right" />
          </button>
          <Error
            message={'Error while adding to cart!'}
            error={this.state.addToCartError}
            display={'small'}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <p className="red-text">Sorry, this product is out of stock</p>
          <UserContext.Consumer>
            {profile => (
              <NotifyMeButton
                handleSetNotification={this.handleSetNotification}
                profile={profile}
                errorStatus={this.state.setNotificationError}
              />
            )}
          </UserContext.Consumer>
          <Error
            message={'Error while setting notification!'}
            error={this.state.setNotificationError}
            display={'small'}
          />
        </React.Fragment>
      );
    }
  }
}
