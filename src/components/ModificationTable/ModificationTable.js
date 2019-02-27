import React, { Component } from 'react';
import ReactTable from 'react-table';
import { Form, FormGroup, FormControl, Button, Col, ControlLabel, Jumbotron } from 'react-bootstrap';

import axios from 'axios';

import 'react-table/react-table.css';
import '../../assets/CSS/ModificationTable.css';
import path from '../../assets/path/Path';
import NavBar from '../NavBar/NavBar';
import AuthService from '../Authentication/Authentication';
import SuccessAlert from '../../components/Alerts/SuccesAlert';
import WrongInputAlert from '../../components/Alerts/WrongInputAlert';
import TokenExpired from '../../components/Alerts/TokenExpired';

class ModificationTable extends Component {
    constructor(props) {
        super(props);
        this.Auth = new AuthService()
        this.state = {
            tableData: [{
                id: '',
                name: '',
                price: ''
            }],
            maintenanceAlertMessage: ""
        };
    }

    componentWillMount() {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        axios.get(path + '/modifications', {
            headers: headers
        }).then((response) => {
            this.setState({ tableData: response.data });
            console.log(response.data);
        });
    }

    addModificationHandler = () => {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        var data = {
            name: this.newModification.value,
            price: this.newModificationPrice.value
        };

        axios.post(path + '/modification', data, { headers: headers }
        ).then((response) => {
            console.log(response);
            let tableData = [...this.state.tableData];
            tableData.push(data);
            this.setState({ tableData, maintenanceAlertMessage: "success" });
        })
            .catch((error) => {
                console.log(error);
                this.setState({ maintenanceAlertMessage: "error" });
                if (error.response.status === 403) {
                    this.setState({ maintenanceAlertMessage: "expired" });
                };
            });
    }



    render() {

        const { tableData } = this.state;

        const columns = [
            {
                Header: 'Name',
                accessor: 'name'
            }, {
                Header: 'Price',
                accessor: 'price'
            }]

        return (
            <div>
                <NavBar />
                <div>
                    <Jumbotron className="ModificationInputJumbotron">
                        <Form horizontal className="ModificationInputFormHorizontal">
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Modification
                                </Col>
                                <Col sm={10} className="ModificationInputRow">
                                    <FormControl
                                        inputRef={input => this.newModification = input}
                                        type="modification"
                                        placeholder="Modification" />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Price
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        inputRef={input => this.newModificationPrice = input}
                                        type="price"
                                        placeholder="Price" />
                                </Col>
                            </FormGroup>
                            <FormGroup className="AddButton">
                                <Col sm={2}>
                                    <Button onClick={() => { this.addModificationHandler() }}>Add</Button>
                                </Col>
                                <Col sm={10} className="ModificationAlertMessage">
                                
                                    {this.state.maintenanceAlertMessage === "success" ? <SuccessAlert /> : null}
                                    {this.state.maintenanceAlertMessage === "error" ? <WrongInputAlert /> : null}
                                    {this.state.maintenanceAlertMessage === "expired" ? <TokenExpired /> : null}
                                </Col>
                            </FormGroup>
                        </Form>
                    </Jumbotron>
                </div>
                <div>
                    <Jumbotron className="ModificationReactTableJumbotron">
                        <ReactTable
                            data={tableData}
                            columns={columns}
                            minRows={10}
                            defaultPageSize={10}
                            defaultSorted={[
                                {
                                    id: "name"
                                }
                            ]}
                            className="-striped -highlight" />
                    </Jumbotron>
                </div>
            </div>
        )
    }
}

export default ModificationTable; 