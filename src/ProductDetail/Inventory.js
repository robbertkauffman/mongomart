import React, { Component } from 'react';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';

import Error from '../Error';

export default class Inventory extends Component {
  constructor(props) {
    super(props);
    this.addToCart = this.addToCart.bind(this);
    this.state = {
      addToCartError: undefined
    };
    // this.setNotification = this.setNotification.bind(this);
  }

  componentDidMount() {}

  addToCart() {
    this.incrementProductQuantity();
  }

  incrementProductQuantity() {
    // first try to increment quantity of item in cart,
    // if fails, add item to cart or create cart (upsert)
    let incQuery = {
      userId: this.props.client.auth.currentUser.id,
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
    let addQuery = { userId: this.props.client.auth.currentUser.id };
    let addItem = this.props.item;
    addItem.quantity = 1;
    const addUpdate = { $addToSet: { items: addItem } };
    const options = { upsert: true };

    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.props.db.collection('cart').updateOne(addQuery, addUpdate, options)
      )
      .then(response => {
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

  setNotification() {
    // const notificationDocument = {
    //   itemId: this.state.item._id,
    //   userId: this.props.client.auth.currentUser.id,
    //   email: this.props.client.auth.currentUser.profile.email
    // };
    // console.log(notificationDocument);
    // this.props.client.auth.loginWithCredential(new AnonymousCredential()).then(() =>
    //   this.props.db.collection('notify').insertOne(notificationDocument)
    // ).then(response => {
    //   console.log(response);
    // }).catch(err => {
    //   console.error(err);
    // });
  }

  render() {
    const item = this.props.item;
    if (item.stock > 0) {
      if (!this.state.addToCartError) {
        return (
          <button
            className="btn btn-primary"
            type="submit"
            ref="addToCartButton"
            onClick={this.addToCart}
          >
            Add to cart
            <span className="glyphicon glyphicon-chevron-right" />
          </button>
        );
      } else {
        return (
          <Error
            message={'Error while adding to cart!'}
            error={this.state.addToCartError}
          />
        );
      }
    } else {
      return (
        <React.Fragment>
          <p className="red-text">Sorry, this product is out of stock</p>
          {/* <button
            className="btn btn-primary"
            type="submit"
            onClick={() => this.setNotification()}
          >
            Notify me <br />
            when in stock
            <span className="glyphicon glyphicon-bell" />
          </button> */}
        </React.Fragment>
      );
    }
  }
}
