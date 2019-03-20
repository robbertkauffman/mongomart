import React from 'react';

const Error = props => {
  if (props.error) {
    if (props.display && props.display === 'small') {
      return (
        <div className="error error-small">
          <p>{props.message && <span>{props.message}</span>}</p>
          <p>
            {props.error.name}: {props.error.errorCodeName} &mdash;{' '}
            {props.error.message}
          </p>
        </div>
      );
    } else {
      return (
        <div className="row error">
          <div className="col-md-12">
            {props.message && <h2>{props.message}</h2>}
            <p>
              {props.error.name}: {props.error.errorCodeName}
            </p>
            <p>{props.error.message}</p>
          </div>
        </div>
      );
    }
  } else {
    return null;
  }
};

export default Error;
