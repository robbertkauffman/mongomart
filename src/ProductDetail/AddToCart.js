import React, { Component } from 'react';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

import AddToCartButton from './AddToCartButton';
import Error from '../Error';
import NotifyMeButton from './NotifyMeButton';

export default class AddToCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addToCartError: undefined,
      isAddedToCart: false,
      setNotificationError: undefined
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleSetNotification = this.handleSetNotification.bind(this);
  }

  componentDidMount() {}

  handleAddToCart() {
    this.incrementProductQuantity();
  }

  incrementProductQuantity() {
    // first try to increment quantity of item in cart,
    // if fails, add item to cart or create cart (upsert)
    let incQuery = {
      _id: this.props.client.auth.currentUser.id,
      'cart._id': this.props.item._id
    };
    const incUpdate = { $inc: { 'cart.$.quantity': 1 } };

    const db = this.props.client
      .getServiceClient(RemoteMongoClient.factory, 'mm-users')
      .db('mongomart');
    this.props.clientAuthenticated
      .then(() => {
        // increment quantity by one
        db.collection('users').updateOne(incQuery, incUpdate);
      })
      .then(response => {
        if ((response && response.modifiedCount !== 1) || !response) {
          // if not incremented,
          // either add item to cart or create new cart (upsert)
          this.createCartOrCartItem(db);
        } else {
          this.onAddToCartSuccess();
        }
      })
      .catch(err => {
        this.onAddToCartError(err);
      });
  }

  createCartOrCartItem(db) {
    let addQuery = { _id: this.props.client.auth.currentUser.id };
    // add flag for anonymous users so they can be cleaned up easily if needed
    if (
      this.props.client.auth.currentUser.loggedInProviderName === 'anon-user'
    ) {
      addQuery.anonymousUser = true;
    }

    let addItem = this.props.item;
    addItem.quantity = 1;
    const addUpdate = { $addToSet: { cart: addItem } };

    const options = { upsert: true };

    this.props.clientAuthenticated
      .then(() =>
        db.collection('users').updateOne(addQuery, addUpdate, options)
      )
      .then(() => {
        this.onAddToCartSuccess();
      })
      .catch(err => {
        this.onAddToCartError(err);
      });
  }

  onAddToCartSuccess() {
    this.setState({ addToCartError: null, isAddedToCart: true });
  }

  onAddToCartError(err) {
    this.setState({ addToCartError: err });
  }

  handleSetNotification() {
    const notificationDocument = {
      itemId: this.props.item._id,
      userid: this.props.client.auth.currentUser.id,
      email: this.props.client.auth.currentUser.email
    };

    const db = this.props.client
      .getServiceClient(RemoteMongoClient.factory, 'mm-products')
      .db('mongomart');
    this.props.clientAuthenticated
      .then(() => db.collection('notify').insertOne(notificationDocument))
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
          <AddToCartButton
            onAddToCart={this.handleAddToCart}
            isAddedToCart={this.state.isAddedToCart}
          />
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
          <NotifyMeButton
            handleSetNotification={this.handleSetNotification}
            errorStatus={this.state.setNotificationError}
            client={this.props.client}
          />
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
