import React, { Component } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import Maintenance from '../../components/Maintenance/Maintenance';

class Service extends Component {
    render() {
        return (
            <div>
                <NavBar />
                <Maintenance />
            </div>
        );
    }
}

export default Service;