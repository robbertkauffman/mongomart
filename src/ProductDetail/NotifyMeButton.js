import React from 'react';

const NotifyMeButton = props => {
  if (props.client.auth.currentUser.loggedInProviderName === 'anon-user') {
    return (
      <p>
        Please login if you want to be notified when the product comes back in
        stock.
      </p>
    );
  }

  if (!props.isNotificationCreated) {
    return (
      <button
        className="btn btn-primary"
        type="submit"
        onClick={() => props.onSetNotification()}
      >
        Notify me <br />
        when in stock&nbsp;
        <span className="glyphicon glyphicon-bell" />
      </button>
    );
  } else {
    return (
      <button className="btn btn-primary success" type="submit" disabled>
        Added notification&nbsp;
      </button>
    );
  }
};

export default NotifyMeButton;
