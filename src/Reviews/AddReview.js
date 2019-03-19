import React, { Component } from 'react';
import {
  AnonymousCredential,
  RemoteMongoClient
} from 'mongodb-stitch-browser-sdk';

export default class AddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWritingReview: false,
      rating: 5,
      comment: '',
      addReviewError: undefined
    };

    this.toggleWriteReview = this.toggleWriteReview.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.addReview = this.addReview.bind(this);
  }

  toggleWriteReview() {
    this.setState({
      isWritingReview: !this.state.isWritingReview
    });
  }

  handleRatingChange(event) {
    this.setState({ rating: event.target.value });
  }

  handleCommentChange(event) {
    this.setState({ comment: event.target.value });
  }

  addReview() {
    const review = {
      userId: this.props.client.auth.currentUser.id,
      productId: this.props.productId,
      name: this.props.client.auth.currentUser.name
        ? this.props.client.auth.currentUser.name
        : 'Anonymous User',
      comment: this.state.comment,
      stars: this.state.rating,
      date: new Date().getTime()
    };

    const reviewsDb = this.props.client
      .getServiceClient(RemoteMongoClient.factory, 'mm-reviews')
      .db('mongomart');
    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() => reviewsDb.collection('reviews').insertOne(review))
      .then(response => {
        this.setState({ addReviewError: null, isWritingReview: false });
      })
      .catch(err => {
        this.setState({ addReviewError: err });
        console.error(err);
      });
  }

  render() {
    if (!this.state.isWritingReview) {
      return (
        <button type="button" onClick={this.toggleWriteReview}>
          Add review
        </button>
      );
    } else {
      return (
        <div className="new-review">
          <button
            type="button"
            onClick={this.toggleWriteReview}
            className="cancel-new-review"
          >
            Cancel
          </button>
          <p>
            <label>
              Rating:
              <select
                defaultValue={5}
                name="rating"
                className="new-review-rating"
                value={this.state.value}
                onChange={this.handleRatingChange}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
          </p>
          <p>
            <textarea
              rows="1"
              cols="50"
              name="comment"
              placeholder="Your comment..."
              value={this.state.comment}
              onChange={this.handleCommentChange}
            />
          </p>
          <button
            type="button"
            onClick={this.addReview}
            className="add-new-review"
          >
            Add Review
          </button>
        </div>
      );
    }
  }
}
