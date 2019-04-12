import React from 'react';

const NotifyMeButton = props => {
  if (props.client.auth.currentUser.loggedInProviderName === 'anon-user') {
    return (
      <p>
        Please login to create a notification for when the product comes back in
        stock.
      </p>
    );
  }

  if (!props.errorStatus) {
    return (
      <button
        className="btn btn-primary"
        type="submit"
        onClick={() => props.handleSetNotification()}
      >
        Notify me <br />
        when in stock&nbsp;
        <span className="glyphicon glyphicon-bell" />
      </button>
    );
  } else {
    return (
      <button className="btn btn-primary success" type="submit" disabled>
        Added notification
        <span className="glyphicon glyphicon-bell" />
      </button>
    );
  }
};

export default NotifyMeButton;
