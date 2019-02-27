import React, { Component } from 'react';
import ReactTable from 'react-table';
import DatePicker from "react-datepicker";
import { Form, FormGroup, Jumbotron, ControlLabel, Button, Modal, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import moment from 'moment';

import 'react-table/react-table.css';
import "react-datepicker/dist/react-datepicker.css";

import '../../assets/CSS/Maintenance.css';
import path from '../../assets/path/Path';
import progressOptions from '../../assets/Progress/Progress';
import SuccessAlert from '../../components/Alerts/SuccesAlert';
import AuthService from '../../components/Authentication/Authentication';
import TokenExpired from '../../components/Alerts/TokenExpired';
import WrongInputAlert from '../Alerts/WrongInputAlert';

class Maintenance extends Component {

    constructor(props) {
        super(props);

        this.Auth = new AuthService();
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);

        this.state = {

            showProductModal: false,
            maintenanceAlertMessage: "",

            tableData: [{
                maintenance: {
                    id: "",
                    startDate: "",
                    endDate: "",
                    status: "",
                    fault: "",
                    user: {
                        id: "",
                        username: "",
                        password: "",
                        userRole: ""
                    },
                    product: {
                        id: "",
                        description: "",
                        type: "",
                        brand: {
                            id: "",
                            name: ""
                        },
                        client: {
                            id: '',
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: ""
                        }
                    },
                    modifications: [
                        {
                            id: "",
                            name: "",
                            price: ""
                        }
                    ]
                }
            }],

            selectedTableRow: {
                id: "",
                startDate: "",
                endDate: "",
                status: "",
                fault: "",
                user: {
                    id: "",
                    username: "",
                    password: "",
                    userRole: ""
                },
                product: {
                    id: "",
                    description: "",
                    type: "",
                    brand: {
                        id: "",
                        name: ""
                    },
                    client: {
                        id: '',
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: ""
                    }
                },
                modifications: [
                    {
                        id: "",
                        name: "",
                        price: ""
                    }
                ]
            },
            selectedProgress: "",

            latestProduct: "",
            latestUser: "",

            modificationList: [],
            selectedModification: [],

            userList: [],
            selectedUser: [],

            startDate: new Date(),
            endDate: new Date()
        }
    }

    componentDidMount() {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        axios.get(path + '/maintenances/work', { headers: headers })
            .then(response => {
                this.setState({ tableData: response.data })
                console.log(this.state.tableData)
            }).catch(error => {
                console.log(error);
                if(error.response.status === 403) {
                    this.setState({ maintenanceAlertMessage: "expired"});
                };
            });

        axios.get(path + '/modifications', { headers: headers })
            .then(response => {
                return response.data
            }).then(data => {
                let modificationsFromApi = data.map(Modification => { return { id: Modification.id, name: Modification.name } });
                this.setState({ modificationList: modificationsFromApi });
                console.log(this.state.modificationList)
            }).catch(error => {
                console.log(error);
            });

        axios.get(path + '/users', { headers: headers })
            .then(response => {
                return response.data
            }).then(data => {
                let usersFromApi = data.map(User => { return { id: User.id, username: User.username } });
                this.setState({ userList: usersFromApi });
                console.log(this.state.userList)
            }).catch(error => {
                console.log(error);
            });

    }

    handleClose() {
        this.setState({ showMaintenanceModal: false });
    }

    handleShow() {
        this.setState({ showMaintenanceModal: true });
    }

    handleStartDateChange(startDate) {

        this.setState({
            startDate: startDate
        })
    }

    handleEndDateChange(endDate) {

        this.setState({
            endDate: endDate,
        })
    }

    handleModificationChange = (selectModification) => {
        this.setState({ selectedModification: selectModification });
    }

    handleUserChange = (selectUser) => {
        this.setState({ selectedUser: selectUser });
    }

    handleProgressChange = (selectProgress) => {
        this.setState({ selectedProgress: selectProgress });
    }

    addMaintenanceHandler = () => {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        axios.get(path + '/products', {
            headers: headers
        }).then(response => {
            let maxId = Math.max.apply(Math, response.data.map(Product => { return Product.id; }))
            let latestProductObj = response.data.find(Product => { return Product.id === maxId })
            this.setState({ latestProduct: latestProductObj }, () => {
                console.log(this.state.latestProduct.id)
            })

            axios.get(path + '/users', {
                headers: headers
            }).then(response => {
                let latestUserObj = response.data.find(User => { return User.username === "admin" })
                this.setState({ latestUser: latestUserObj }, () => {
                    console.log(this.state.latestUser.id)
                })


                let maintenanceData = {
                    startDate: "",
                    endDate: "",
                    status: "RECORDED",
                    fault: "",
                    productId: this.state.latestProduct.id,
                    userId: this.state.latestUser.id,
                    modificationsId: []
                };

                axios.post(path + '/maintenance', maintenanceData, { headers: headers }).then(response => {
                    let tableData = [...this.state.tableData];
                    tableData.push(response.data);
                    this.setState({ tableData });
                    console.log(response);
                }).catch(error => {
                });

            }).catch(error => {
                console.log(error)
            });

        }).catch(error => {
            console.log(error)
        });
    }


    editMaintenanceHandler = () => {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        console.log("elvileg ezek a selectedmodifications: ", this.state.selectedModification)

        let updatedMaintenance = {
            startDate: moment(this.state.startDate, 'YYYY-MM-DD'),
            endDate: moment(this.state.endDate, 'YYYY-MM-DD'),
            status: this.state.selectedProgress.value,
            fault: this.faultInput.value,
            productId: this.state.selectedTableRow.product.id,
            userId: this.state.selectedUser.id,
            modificationsId: this.state.selectedModification.map(Modification => Modification.id)
        }

        axios.put(path + '/maintenance/' + this.state.selectedTableRow.id,
            updatedMaintenance, { headers: headers })
            .then(response => {
                console.log(response);
                this.setState({
                    maintenanceAlertMessage: "success",
                    selectedTableRow: response.data,
                });
                axios.get(path + '/maintenances/work', { headers: headers }).then(response => {
                    this.setState({ tableData: response.data })
                    console.log(this.state.tableData)
                }).catch(error => {
                    console.log(error)

                });

            }).catch(error => {
                console.log(error);
                console.log(this.state.selectedTableRow)
                this.setState({ maintenanceAlertMessage: "wrongInput" });
                if(error.response.status === 403) {
                    this.setState({ maintenanceAlertMessage: "expired"});
                };
            });

    }

    render() {

        const { tableData } = this.state;

        const columns = [
            {
                Header: 'Product Info',
                columns: [
                    {
                        Header: 'Brand',
                        accessor: 'product.brand.name'
                    }, {
                        Header: 'Type',
                        accessor: 'product.type'
                    }, {
                        Header: 'Description',
                        accessor: 'product.description'
                    }, {
                        Header: 'Assigned',
                        accessor: 'user.username'
                    }, {
                        Header: 'Status',
                        accessor: 'status'
                    }
                ]
            }
        ]

        return (
            <div>
                <div className="MainServiceScreen">
                    <Jumbotron className="ClientJumbotronPadding">
                        <h1 className="ClientHeader">Clients: </h1>
                        <Form horizontal>
                            <FormGroup>
                                <ControlLabel>Name</ControlLabel>
                            </FormGroup>
                            <FormGroup className="InputFormGroup">
                                <ControlLabel>{this.state.selectedTableRow.product.client.firstName + " " + this.state.selectedTableRow.product.client.lastName}</ControlLabel>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Email</ControlLabel>
                            </FormGroup>
                            <FormGroup className="InputFormGroup">
                                <ControlLabel>{this.state.selectedTableRow.product.client.email}</ControlLabel>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Phone</ControlLabel>
                            </FormGroup>
                            <FormGroup className="InputFormGroup">
                                <ControlLabel>{this.state.selectedTableRow.product.client.phone}</ControlLabel>
                            </FormGroup>
                            <FormGroup >
                                <Button className="MaintenanceAddButton" onClick={this.addMaintenanceHandler}>Add</Button>
                            </FormGroup>
                        </Form>
                    </Jumbotron>
                    <Jumbotron className="MaintenanceJumbotronPadding">

                        <h1 className="MaintenanceHeader">Maintenance: </h1>
                        <div className="MaintenanceParagraph">
                            <Form horizontal>
                                <FormGroup>
                                    <ControlLabel className="StartDateHeader">Start date</ControlLabel>{' '}
                                    <ControlLabel className="FaultHeader">Fault</ControlLabel>{' '}
                                    <ControlLabel className="PriceHeader">Price</ControlLabel>
                                </FormGroup>
                                <FormGroup className="InputFormGroup">
                                    <ControlLabel className="StartDateData">{this.state.selectedTableRow.startDate}</ControlLabel>{' '}
                                    <ControlLabel className="FaultData">{this.state.selectedTableRow.fault}</ControlLabel>{' '}
                                    <ControlLabel className="PriceData">{this.state.selectedTableRow.modifications
                                        .reduce((prev, next) =>
                                            prev + next.price, 0
                                        )}
                                    </ControlLabel>
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel className="EndDateHeader">End date</ControlLabel>{' '}
                                    <ControlLabel className="pull-right">Modification</ControlLabel>
                                </FormGroup>
                                <FormGroup className="InputFormGroup">
                                    <ControlLabel className="EndDateData">{this.state.selectedTableRow.endDate}</ControlLabel>
                                    <ControlLabel className="pull-right">

                                        {this.state.selectedTableRow.modifications
                                            .map(Modification => {
                                                return <li key={Modification.id} className="ModificationsListItems">{Modification.name + ' '}</li>
                                            })}
                                    </ControlLabel>
                                </FormGroup>
                                <FormGroup className="EditButton">
                                    <Button className="MaintenanceEditButton" onClick={this.handleShow}>Edit</Button>
                                </FormGroup>
                            </Form>
                        </div>

                    </Jumbotron>
                </div>


                <div>
                    <ReactTable

                        data={tableData}
                        columns={columns}
                        defaultPageSize={10}
                        getTrProps={(state, rowInfo) => {
                            if (rowInfo !== undefined) {
                                return {
                                    onClick: (e, handleOriginal) => {
                                        this.setState({
                                            selectedTableRow: rowInfo.original,
                                            maintenanceAlertMessage: ""
                                        })
                                        console.log("ez van a selectedRowban:", this.state.selectedTableRow)
                                    },
                                    style: {
                                        cursor: 'pointer',
                                        background: rowInfo.original.id === this.state.selectedTableRow.id ? '#00afec' : '#20333e',
                                        color: rowInfo.original.id === this.state.selectedTableRow.id ? 'white' : 'white'
                                    }
                                }
                            } else {
                                return {}
                            }
                        }
                        }

                        defaultSorted={[
                            {
                                id: "name"
                            }
                        ]} className="-striped -highlight" />
                </div>

                <div className="modal-backdrop-asd">
                    <Modal
                        bsSize="small"
                        show={this.state.showMaintenanceModal}
                        onHide={this.handleClose}
                        container={this}
                        aria-labelledby="contained-modal-title"
                        dialogClassName="custom-modal">
                        <Modal.Header closeButton>
                            <Modal.Title id="contianed-modal-title">Maintenance</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormGroup className="BrandAndType">
                                <ControlLabel className="MaintenanceEditSelectedInfo">{this.state.selectedTableRow.product.brand.name}</ControlLabel>{' '}
                                <ControlLabel className="MaintenanceEditSelectedInfo">{this.state.selectedTableRow.product.type}</ControlLabel>
                            </FormGroup>
                            <FormGroup className="Description">
                                <ControlLabel className="MaintenanceEditSelectedInfo">{this.state.selectedTableRow.product.description}</ControlLabel>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel className="MaintenanceEditSelectedInfo">Start Date</ControlLabel>{' '}
                                <DatePicker
                                    className="DatePicker"
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDateChange}
                                    defaultvalue={this.state.selectedTableRow.startDate}
                                />
                                <ControlLabel className="MaintenanceEditSelectedInfo">End Date</ControlLabel>{' '}
                                <DatePicker
                                    className="DatePicker"
                                    selected={this.state.endDate}
                                    onChange={this.handleEndDateChange}
                                    defaultvalue={this.state.selectedTableRow.endDate} />
                            </FormGroup>
                            <FormGroup>
                                <FormControl className="FaultsInput" placeholder="Faults" inputRef={input => this.faultInput = input} defaultValue={this.state.selectedTableRow.fault} />
                            </FormGroup>
                            <FormGroup>
                                <Select
                                    className="SelectedModificationDropdown"
                                    placeholder="Select a Modification"
                                    defaultValue={this.state.selectedTableRow.modifications}
                                    onChange={this.handleModificationChange}
                                    options={this.state.modificationList}
                                    getOptionLabel={Modification => Modification.name}
                                    getOptionValue={Modification => Modification.id}
                                    isMulti={true}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Select
                                    className="SelectedModificationDropdown"
                                    placeholder="Select a User"
                                    defaultValue={this.state.selectedTableRow.user}
                                    onChange={this.handleUserChange.bind(this)}
                                    options={this.state.userList}
                                    getOptionLabel={User => User.username}
                                    getOptionValue={User => User.id}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Select
                                    className="SelectedProgressDropdown"
                                    placeholder="Select a Progress"
                                    defaultValue={this.state.selectedTableRow.status}
                                    onChange={this.handleProgressChange.bind(this)}
                                    options={progressOptions}
                                />
                            </FormGroup>
                        </Modal.Body>

                        <Modal.Footer>
                            <FormGroup className="MaintenanceAlertMessage">
                                {this.state.maintenanceAlertMessage === "success" ? <SuccessAlert /> : null}
                                {this.state.maintenanceAlertMessage === "wrongInput" ? <WrongInputAlert /> : null}
                                {this.state.alertMessage === "expired" ? <TokenExpired /> : null}
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    className="pull-left"
                                    onClick={this.editMaintenanceHandler}>Save</Button>
                            </FormGroup>
                            <FormGroup>
                                <Button onClick={this.handleClose}>Close</Button>
                            </FormGroup>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div >
        )
    }
}

export default Maintenance;