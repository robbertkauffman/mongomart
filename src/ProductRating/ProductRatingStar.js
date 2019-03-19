import React from 'react';

const ProductRatingStar = props => {
  const stars = props.stars;
  const num = props.num;
  if (stars >= num) {
    return <span className="glyphicon glyphicon-star" />;
  } else {
    return <span className="glyphicon glyphicon-star-empty" />;
  }
};

export default ProductRatingStar;
