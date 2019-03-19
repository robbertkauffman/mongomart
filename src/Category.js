import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Category(props) {
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
      <span className="badge">{category.num}</span>
      {category._id}
    </NavLink>
  );
}
