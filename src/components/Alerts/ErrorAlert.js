import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class ErrorAlert extends Component {
    render() {
        return (
            <Alert bsStyle="danger">
                <strong>Already in the database!</strong>
            </Alert>
        );
    }

}
export default ErrorAlert;