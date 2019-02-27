import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class WrongInputAlert extends Component {
    render() {
        return (
            <Alert bsStyle="danger">
                <strong>Wrong Input!</strong>
            </Alert>
        );
    }

}
export default WrongInputAlert;