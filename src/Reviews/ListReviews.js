import React from 'react';

import ProductRating from '../ProductRating/ProductRating';

const ListReviews = props => {
  if (!props.reviews || props.reviews.length === 0) {
    return <p>There are no reviews for this product yet...</p>;
  }

  return props.reviews.map((review, i) => {
    const date = new Date(review.date);
    const dateString =
      date.getUTCFullYear() +
      '/' +
      ('0' + (date.getUTCMonth() + 1)).slice(-2) +
      '/' +
      ('0' + date.getUTCDate()).slice(-2) +
      ' ' +
      ('0' + date.getUTCHours()).slice(-2) +
      ':' +
      ('0' + date.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + date.getUTCSeconds()).slice(-2);

    if (review.userId && review.userId === props.client.auth.currentUser.id) {
      review.editable = true;
    }

    return (
      <React.Fragment key={i}>
        <div>
          <div>
            <h4 className="media-heading review-header">
              {review.name}
              <small> {dateString}</small>
              {/* {review.editable && (
                <a href="#editReview" className="edit-review">
                  Edit
                </a>
              )} */}
            </h4>
            <div className="ratings">
              <ProductRating stars={review.stars} />
            </div>
            {review.comment}
          </div>
        </div>
        <hr />
      </React.Fragment>
    );
  });
};

export default ListReviews;
