import React from 'react';
import { NavLink } from 'react-router-dom';

const Category = props => {
  const category = props.category;

  if (!category) {
    return null;
  }

  const category_link = '/category/' + category._id;

  return (
    <NavLink
      to={category_link}
      className="list-group-item"
      activeClassName="active"
    >
      {category.num && <span className="badge">{category.num}</span>}
      {category._id}
    </NavLink>
  );
};

export default Category;
