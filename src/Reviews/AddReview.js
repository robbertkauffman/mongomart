import React, { Component } from 'react';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

import Error from '../Error';

export default class AddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      name: '',
      comment: '',
      addReviewError: undefined
    };

    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.addReview = this.addReview.bind(this);
  }

  handleRatingChange(event) {
    this.setState({ rating: event.target.value });
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleCommentChange(event) {
    this.setState({ comment: event.target.value });
  }

  addReview() {
    const review = {
      userid: this.props.client.auth.currentUser.id,
      productId: this.props.productId,
      name: this.state.name,
      comment: this.state.comment,
      stars: this.state.rating,
      date: new Date().getTime()
    };

    const db = this.props.client
      .getServiceClient(RemoteMongoClient.factory, 'mm-reviews')
      .db('mongomart');
    this.props.clientAuthenticated
      .then(() => db.collection('reviews').insertOne(review))
      .then(() => {
        this.setState({ addReviewError: null, isWritingReview: false });
        this.props.onAddReview(review);
        this.disableAddReviewButton();
      })
      .catch(err => {
        this.setState({ addReviewError: err });
        console.error(err);
      });
  }

  disableAddReviewButton() {
    this.refs.addReviewButton.setAttribute('disabled', '');
    this.refs.addReviewButton.textContent = 'Added review';
    this.refs.addReviewButton.className =
      this.refs.addReviewButton.className + ' success';
  }

  render() {
    return (
      <div className="well add-review">
        <h4>Add a Review:</h4>
        <div className="form-group">
          <label className="expand">
            Review:
            <textarea
              name="review"
              className="form-control"
              rows="3"
              placeholder="Your comment..."
              value={this.state.comment}
              onChange={this.handleCommentChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Name:
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter display name"
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label className="radio-inline">
            <input
              type="radio"
              name="stars"
              id="stars"
              value="1"
              onChange={this.handleRatingChange}
            />{' '}
            1 star
          </label>
          <label className="radio-inline">
            <input
              type="radio"
              name="stars"
              id="stars"
              value="2"
              onChange={this.handleRatingChange}
            />{' '}
            2 star
          </label>
          <label className="radio-inline">
            <input
              type="radio"
              name="stars"
              id="stars"
              value="3"
              onChange={this.handleRatingChange}
            />{' '}
            3 star
          </label>
          <label className="radio-inline">
            <input
              type="radio"
              name="stars"
              id="stars"
              value="4"
              onChange={this.handleRatingChange}
            />{' '}
            4 star
          </label>
          <label className="radio-inline">
            <input
              type="radio"
              name="stars"
              id="stars"
              value="5"
              onChange={this.handleRatingChange}
              checked
            />{' '}
            5 star
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          ref="addReviewButton"
          onClick={this.addReview}
        >
          Submit Review
        </button>
        {this.state.addReviewError && (
          <Error
            message={'Error while adding review!'}
            error={this.state.addReviewError}
            display={'small'}
          />
        )}
      </div>
    );
  }
}
