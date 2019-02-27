import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class ErrorAlert extends Component {
    render() {
        return (
            <Alert bsStyle="danger">
                <strong>Wrong username/password</strong>
            </Alert>
        );
    }

}
export default ErrorAlert;