import React from 'react';
import { Link } from 'react-router-dom';
import SelectQuantity from './SelectQuantity';

const CartItem = props => {
  const item = props.item;

  if (!item) {
    return null;
  }

  const itemLink = '/item/' + item._id;
  const imgUrl = process.env.PUBLIC_URL + item.img_url;

  return (
    <tr>
      <td>
        <Link to={itemLink}>{item.title && item.title}</Link>
      </td>
      <td className="muted center_text">
        <Link to={itemLink}>
          <img width="300" src={imgUrl} alt={item.title} />
        </Link>
      </td>
      <td>
        <SelectQuantity
          selectedQuantity={item.quantity}
          updateQuantity={props.updateQuantity}
          itemId={props.itemId}
          userId={props.userId}
        />
      </td>
      <td>{item.price}</td>
      <td>{(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  );
};

export default CartItem;
