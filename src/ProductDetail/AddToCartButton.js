import React from 'react';

const AddToCartButton = props => {
  if (!props.isAddedToCart) {
    return (
      <button
        className="btn btn-primary"
        type="submit"
        onClick={props.onAddToCart}
      >
        Add to cart
        <span className="glyphicon glyphicon-chevron-right" />
      </button>
    );
  } else {
    return (
      <button className="btn btn-primary success" type="submit" disabled>
        Added item to cart
      </button>
    );
  }
};

export default AddToCartButton;
