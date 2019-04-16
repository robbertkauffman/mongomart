import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

import CartItem from './CartItem';
import Error from '../Error';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: props.client
        .getServiceClient(
          RemoteMongoClient.factory,
          props.stitchClusterNames.users
        )
        .db('mongomart'),
      cart: [],
      cartError: undefined,
      updateQuantityError: undefined
    };
    this.updateQuantity = this.updateQuantity.bind(this);
  }

  componentDidMount() {
    this.props.clientAuthenticated
      .then(() =>
        this.state.db
          .collection('users')
          .find({ _id: this.props.client.auth.currentUser.id })
          .first()
      )
      .then(user => {
        if (user && user.cart) {
          this.setState({
            cart: user.cart,
            cartError: null
          });
        }
      })
      .catch(err => {
        this.setState({
          cartError: err
        });
        console.error(err);
      });
  }

  updateQuantity(itemId, event) {
    if (event && event.target && event.target.value) {
      const newQuantity = parseInt(event.target.value);
      if (newQuantity === 0) {
        this.removeCartItem(itemId);
      } else {
        this.updateCartQuantity(itemId, newQuantity);
      }
    }
  }

  removeCartItem(itemId) {
    this.props.clientAuthenticated
      .then(() =>
        this.state.db.collection('users').updateOne(
          {
            _id: this.props.client.auth.currentUser.id
          },
          { $pull: { cart: { _id: itemId } } }
        )
      )
      .then(response => {
        if (
          response &&
          response.modifiedCount &&
          response.modifiedCount === 1
        ) {
          let updatedCart = this.state.cart;
          updatedCart = updatedCart.filter(item => item._id !== itemId);
          this.setState({
            cart: updatedCart,
            updateQuantityError: undefined
          });
        }
      })
      .catch(err => {
        this.setState({ updateQuantityError: err });
        console.error(err);
      });
  }

  updateCartQuantity(itemId, newQuantity) {
    this.props.clientAuthenticated
      .then(() =>
        this.state.db.collection('users').updateOne(
          {
            _id: this.props.client.auth.currentUser.id,
            'cart._id': itemId
          },
          { $set: { 'cart.$.quantity': newQuantity } }
        )
      )
      .then(response => {
        if (
          response &&
          response.modifiedCount &&
          response.modifiedCount === 1
        ) {
          const updatedCart = this.state.cart;
          updatedCart.forEach(item => {
            if (item._id === itemId) {
              item.quantity = newQuantity;
            }
          });
          this.setState({
            cart: updatedCart,
            selectedQuantity: newQuantity,
            updateQuantityError: undefined
          });
        }
      })
      .catch(err => {
        this.setState({ updateQuantityError: err });
        console.error(err);
      });
  }

  renderCart() {
    return this.state.cart.map(item => (
      <CartItem
        item={item}
        updateQuantity={e => this.updateQuantity(item._id, e)}
        key={item._id}
      />
    ));
  }

  calculateTotal() {
    return this.state.cart.reduce(
      (a, b) => a + (b['price'] * b['quantity'] || 0),
      0
    );
  }

  render() {
    if (!this.state.cartError) {
      return (
        <React.Fragment>
          <div className="row">
            <div className="col-md-12">
              <ol className="breadcrumb">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li className="active">Cart</li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {this.state.updateQuantityError && (
                <Error
                  message={'Error while updating quantity!'}
                  error={this.state.updateQuantityError}
                  display={'small'}
                />
              )}
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderCart()}
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>
                      <strong>{this.calculateTotal().toFixed(2)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row">
              <div className="col-md-12 checkout">
                <button className="btn btn-success" type="submit">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <Error
          message={'Error while retrieving cart!'}
          error={this.state.cartError}
        />
      );
    }
  }
}

export default Cart;
