import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

import Error from '../Error';
import AddToCart from './AddToCart';
import ListReviews from '../Reviews/ListReviews';
import AddReview from '../Reviews/AddReview';
import ProductRating from '../ProductRating/ProductRating';
import UpdateStockButton from './UpdateStockButton';

export default class ProductItemDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {},
      reviews: [],
      productError: undefined,
      reviewsError: undefined
    };
    this.handleAddReview = this.handleAddReview.bind(this);
  }

  componentDidMount() {
    this.fetchProduct();
    this.fetchReviews();
  }

  fetchProduct() {
    const itemId = parseInt(this.props.match.params.id);

    const db = this.props.client
      .getServiceClient(
        RemoteMongoClient.factory,
        this.props.stitchClusterNames.products
      )
      .db('mongomart');

    this.props.clientAuthenticated
      .then(() =>
        db
          .collection('item')
          .find({ _id: itemId }, { limit: 1 })
          .asArray()
      )
      .then(response => {
        if (response && response[0]) {
          this.setState({
            item: response[0],
            productError: null
          });
        }
      })
      .catch(err => {
        this.setState({
          productError: err
        });
        console.error(err);
      });
  }

  fetchReviews() {
    const itemId = parseInt(this.props.match.params.id);

    const db = this.props.client
      .getServiceClient(
        RemoteMongoClient.factory,
        this.props.stitchClusterNames.reviews
      )
      .db('mongomart');

    this.props.clientAuthenticated
      .then(() =>
        db
          .collection('reviews')
          .find({ productId: itemId })
          .asArray()
      )
      .then(response => {
        if (response) {
          this.setState({
            reviews: response,
            reviewsError: null
          });
        }
      })
      .catch(err => {
        this.setState({
          reviewsError: err
        });
        console.error(err);
      });
  }

  handleAddReview(review) {
    let updatedReviews = this.state.reviews;
    updatedReviews.push(review);
    this.setState({ reviews: updatedReviews });
  }

  render() {
    return (
      <React.Fragment>
        {this.renderProduct()}
        {this.renderReviews()}
      </React.Fragment>
    );
  }

  renderProduct() {
    const item = this.state.item;

    if (!item) {
      return null;
    }

    let stars = 0;
    let numReviews = 0;
    const reviews = this.state.reviews;

    if (reviews) {
      numReviews = reviews.length;

      for (let i = 0; i < numReviews; i++) {
        const review = reviews[i];
        stars += review.stars;
      }

      if (numReviews > 0) {
        stars = stars / numReviews;
      }
    }

    const categoryLink = '/category/' + item.category;
    const img_url = process.env.PUBLIC_URL + item.img_url;

    const doAfterUpdateStock = () => {
      this.fetchProduct();
    };

    if (!this.state.productError) {
      return (
        <React.Fragment>
          <div className="row">
            <div className="col-md-12">
              <ol className="breadcrumb">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li className="active">
                  <Link to={categoryLink}>{item.category}</Link>
                </li>
                <li className="active">{item.title}</li>
              </ol>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-header">
                {item.title}
                <small> {item.slogan}</small>
              </h1>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <img className="img-responsive product" src={img_url} alt="" />
            </div>

            <div className="col-md-4">
              <h3>Product Description</h3>

              <div className="ratings">
                <p className="pull-right">{numReviews} review(s)</p>
                <p>
                  <ProductRating stars={stars} />
                </p>
              </div>

              <p>{item.description}</p>
              <AddToCart {...this.props} item={item} />
              <UpdateStockButton
                {...this.props}
                doAfterUpdateStock={doAfterUpdateStock}
                item={item}
              />
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <Error
          message={'Error while retrieving product!'}
          error={this.state.productError}
        />
      );
    }
  }

  renderReviews() {
    if (!this.state.reviewsError) {
      return (
        <div className="row reviews">
          <div className="col-lg-12">
            <h3 className="page-header">Latest Reviews</h3>
          </div>
          <div className="col-lg-12">
            <ListReviews {...this.props} reviews={this.state.reviews} />
            <AddReview
              {...this.props}
              productId={this.state.item._id}
              onAddReview={this.handleAddReview}
            />
          </div>
        </div>
      );
    } else {
      return (
        <Error
          message={'Error while fetching reviews!'}
          error={this.state.reviewsError}
        />
      );
    }
  }
}
