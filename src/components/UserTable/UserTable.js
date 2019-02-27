import React, { Component } from 'react';
import ReactTable from 'react-table';
import axios from 'axios';

import '../../assets/CSS/UserTable.css';
import NavBar from '../NavBar/NavBar';
import path from '../../assets/path/Path';
import AuthService from '../Authentication/Authentication';

class UserTable extends Component {
    constructor() {
        super();
        this.Auth = new AuthService();
        this.state = {
            tableData: [{
                id: '',
                username: '',
                userRole: ''
            }],
        };
    }

    componentDidMount() {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        axios.get(path + '/users', {
            headers: headers
        }).then(response => {
            this.setState({ tableData: response.data });
            console.log(response);
        });
    }

    render() {
        const { tableData } = this.state;

        const columns = [
            {
                Header: 'User Id',
                accessor: 'id'
            }, {
                Header: 'User name',
                accessor: 'username'
            }, {
                Header: 'Role',
                accessor: 'userRole'
            }]

        return (
            <div>
                <NavBar />
                    
                        <ReactTable
                            data={tableData}
                            columns={columns}
                            defaultPageSize={10}
                            defaultSorted={[
                                {
                                    id: "name"
                                }
                            ]}
                            className="-striped -highlight -usersTable" />
                    
            </div>
        )
    }
}

export default UserTable;