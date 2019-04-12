import React from 'react';

const AddReviewButton = props => {
  if (!props.isAddedReview) {
    return (
      <button
        type="submit"
        className="btn btn-primary"
        onClick={props.onAddReview}
      >
        Submit Review
      </button>
    );
  } else {
    return (
      <button type="submit" className="btn btn-primary success" disabled>
        Added Review
      </button>
    );
  }
};

export default AddReviewButton;
