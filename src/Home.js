import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import queryString from 'query-string';

import Category from './Category';
import Error from './Error';
import ProductListItem from './ProductList/ProductListItem';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      categoriesError: undefined,
      items: [],
      productsError: undefined
    };
  }

  componentDidMount() {
    this.fetchProducts(this.props.match.params.category);
    this.fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.category !== prevProps.match.params.category) {
      this.fetchProducts(this.props.match.params.category);
    }
  }

  fetchCategories() {
    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.props.db
          .collection('item')
          .aggregate([
            {
              $group: {
                _id: '$category',
                num: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ])
          .toArray()
      )
      .then(categories => {
        var category = {
          _id: 'All',
          num: 23
        };
        categories.unshift(category);

        this.setState({
          categories: categories,
          categoriesError: null
        });
      })
      .catch(err => {
        this.setState({
          categoriesError: err
        });
        console.log(err);
      });
  }

  fetchProducts(category) {
    const query = category && category !== 'All' ? { category: category } : {};
    const options = { sort: { _id: 1 } };

    this.props.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.props.db
          .collection('item')
          .find(query, options)
          .asArray()
      )
      .then(items => {
        this.setState({
          items: items,
          productsError: null
        });
      })
      .catch(err => {
        this.setState({
          productsError: err
        });
        console.error(err);
      });
  }

  getCurrPage() {
    const params = queryString.parse(this.props.location.search);
    if (params.page) {
      return parseInt(params.page);
    } else {
      return 0;
    }
  }

  renderCategories() {
    if (!this.state.categoriesError) {
      // const category = this.props.match.params.category;
      return this.state.categories.map(category => (
        <Category category={category} key={category._id} />
      ));
    } else {
      return <Error error={this.state.categoriesError} />;
    }
  }

  renderProducts() {
    if (!this.state.productsError) {
      const currPage = this.getCurrPage();
      const skip = currPage * 5;
      const limit = skip + 5;

      return this.state.items.map((item, i) => {
        if (i >= skip && i < limit) {
          return <ProductListItem item={item} key={item._id} />;
        }
        return null;
      });
    } else {
      return <Error error={this.state.productsError} />;
    }
  }

  renderPagination() {
    const pages = Math.ceil(this.state.items.length / 5);
    return [...Array(pages).keys()].map(i => {
      const category = this.props.match.params.category;
      let link = category ? '/category/' + category : '/';
      link += '?page=' + i;
      const linkElm = <Link to={link}>{i + 1}</Link>;

      const activeClass = this.getCurrPage() === i ? 'active' : 'inactive';

      return (
        <li className={activeClass} key={i}>
          {linkElm}
        </li>
      );
    });
  }

  render() {
    const category = this.props.match.params.category;
    const categoryName = category ? category : 'All';

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-12">
            <ol className="breadcrumb">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="active">{categoryName}</li>
            </ol>
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">
            <div className="list-group">{this.renderCategories()}</div>
          </div>

          <div className="col-md-10">
            {this.renderProducts()}
            <div className="row text-center">
              <div className="col-lg-12">
                <ul className="pagination">{this.renderPagination()}</ul>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
