import React from 'react';

const NotifyMeButton = props => {
  if (!props.errorStatus) {
    return (
      <button
        className="btn btn-primary"
        type="submit"
        onClick={() => props.handleSetNotification(props.profile)}
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
