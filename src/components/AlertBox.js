import React, { Component } from 'react';
import '../style/AlertBox.css';
import { nextClosingTime } from '../gcal';

class AlertBox extends Component {
  render() {
    return (
      <div className="alert-container">
        {nextClosingTime && (
          <div>
            <div className="alert-box">
              Office Hours is closing at {nextClosingTime}
            </div>
            <div className="alert-subbox">
              Ask questions on Piazza or come another day!
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default AlertBox;

