import React, { Component } from 'react';

import Error from '../Error';

export default class UpdateStockButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdatedStock: false,
      updateStockError: undefined
    };
  }

  handleUpdateStock() {
    const args = [this.props.item._id, this.props.item.stock];
    this.props.client
      .callFunction('updateStock', args)
      .then(result => {
        if (result) {
          this.onUpdateStockSuccess();
        } else {
          this.onUpdateStockError(null);
        }
      })
      .catch(err => {
        this.onUpdateStockError(err);
      });
  }

  onUpdateStockSuccess() {
    if (
      this.props.doAfterUpdateStock &&
      typeof this.props.doAfterUpdateStock === 'function'
    ) {
      this.props.doAfterUpdateStock();
    }
    this.setState({ updateStockError: null, isUpdatedStock: true });
  }

  onUpdateStockError(err) {
    console.log(err);
    this.setState({ updateStockError: err, isUpdatedStock: false });
  }

  render() {
    if (!this.state.updateStockError) {
      if (!this.state.isUpdatedStock) {
        return (
          <button
            className="update-stock covert-button"
            type="submit"
            onClick={() => this.handleUpdateStock()}
          >
            Update stock
          </button>
        );
      } else {
        return (
          <button
            className="update-stock covert-button success"
            type="submit"
            onClick={() => this.handleUpdateStock()}
          >
            Updated stock
          </button>
        );
      }
    } else {
      return (
        <Error
          className="update-stock"
          message={'Error while updating stock!'}
          error={this.state.updateStockError}
          display={'small'}
        />
      );
    }
  }
}
