import React from 'react';

const Error = props => {
  if (props.error) {
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
  } else {
    return null;
  }
};

export default Error;
