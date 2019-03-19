import React from 'react';
import ProductRatingStar from './ProductRatingStar';

const ProductRating = props => {
  return [...Array(5).keys()].map(i => (
    <ProductRatingStar num={i + 1} stars={props.stars} key={i} />
  ));
};

export default ProductRating;
