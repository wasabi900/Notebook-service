import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class TokenExpired extends Component {
    render() {
        return (
            <Alert bsStyle="danger">
                <strong>Login Again!</strong>
            </Alert>
        );
    }

}
export default TokenExpired;