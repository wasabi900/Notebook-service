import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class SuccessAlert extends Component {
    render() {
        return (
            <Alert bsStyle="success">
                <strong>Success!</strong>
            </Alert>
        );
    }

}
export default SuccessAlert;