import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';

import CartItem from './CartItem';
import Error from '../Error';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {
        items: []
      },
      cartError: undefined
    };
    this.updateQuantity = this.updateQuantity.bind(this);
  }

  componentDidMount() {
    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.props.db
          .collection('cart')
          .find({ userId: this.props.client.auth.currentUser.id })
          .first()
      )
      .then(cart => {
        if (cart && cart.items) {
          this.setState({
            cart: cart,
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
      const newVal = event.target.value;
      this.props.client.auth
        .loginWithCredential(new AnonymousCredential())
        .then(() =>
          this.props.db.collection('cart').updateOne(
            {
              userId: this.props.client.auth.currentUser.id,
              'items._id': itemId
            },
            { $set: { 'items.$.quantity': newVal } }
          )
        )
        .then(response => {
          if (
            response &&
            response.modifiedCount &&
            response.modifiedCount === 1
          ) {
            this.setState({ selectedQuantity: newVal });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  renderCart() {
    return this.state.cart.items.map(item => (
      <CartItem
        item={item}
        userId={this.state.userId}
        updateQuantity={e => this.updateQuantity(item._id, e)}
        key={item._id}
      />
    ));
  }

  calculateTotal() {
    return this.state.cart.items.reduce(
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
                    <td>{this.calculateTotal().toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row">
              <div className="col-md-12">
                <button className="btn btn-success" type="submit">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return <Error error={this.state.cartError} />;
    }
  }
}

export default Cart;
