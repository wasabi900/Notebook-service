import React, { Component } from 'react';
import { Form, FormControl, Col, ControlLabel, FormGroup, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import path from '../../assets/path/Path';

import 'react-table/react-table.css';
import '../../assets/CSS/Products.css';
import SuccessAlert from '../../components/Alerts/SuccesAlert';
import ErrorAlert from '../../components/Alerts/ErrorAlert';
import AuthService from '../../components/Authentication/Authentication';
import TokenExpired from '../../components/Alerts/TokenExpired';
import WrongInputAlert from '../../components/Alerts/WrongInputAlert';

class Products extends Component {

    constructor(props) {
        super(props);

        this.Auth = new AuthService();
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);


        this.state = {
            showBrandModal: false,
            addBrandAlertMessage: "",
            productAlertMessage: "",

            product: {
                id: "",
                description: "",
                type: "",
                brand: {
                    id: "",
                    name: ""
                },
                client: [{
                    email: "",
                    firstName: "",
                    id: "",
                    lastName: "",
                    phone: ""
                }]
            },

            latestClient: "",

            brandList: [],
            selectedBrand: ""
        };
    }



    handleShow() {
        this.setState({ showBrandModal: true });
    }

    handleClose() {
        this.setState({ showBrandModal: false, addBrandAlertMessage: "" });
    }

    componentWillMount() {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        axios.get(path + '/brands', { headers: headers })
            .then(response => {
                return response.data
            }).then(data => {
                let brandsFromApi = data.map(Brand => { return { id: Brand.id, name: Brand.name } });
                this.setState({ brandList: [{ id: '', name: '(Select the Brand)' }].concat(brandsFromApi) });
            }).catch(error => {
                console.log(error);
                if(error.response.status === 403) {
                    this.setState({ addBrandAlertMessage: "expired"});
                };
            });
    }

    addBrandHandler = () => {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        var data = {
            name: this.brandInput.value,
        };

        axios.post(path + '/brand', data, {headers:headers})
            .then((response) => {
                console.log(response.data);
                let brandList = [...this.state.brandList];
                brandList.push(response.data);
                this.setState({ brandList });
                this.setState({ addBrandAlertMessage: "success" });
                console.log("ez a brandlist state: ", this.state.brandList)
            })
            .catch((error) => {
                console.log(error);
                this.setState({ addBrandAlertMessage: "error" });
                if(error.response.status === 403) {
                    this.setState({ addBrandAlertMessage: "expired"});
                };
            });
    }

    addJobHandler = () => {

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.Auth.getToken()
        }

        console.log("selectedBrand: ", this.state.selectedBrand)
        var clientData = {
            firstName: this.firstnameInput.value,
            lastName: this.lastnameInput.value,
            email: this.emailInput.value,
            phone: this.phoneInput.value
        };

        axios.post(path + '/client', clientData, {headers:headers})
            .then(response => {
                console.log(response.violationMessage)
                return response.data;
            }).then(data => {
                var productData = {
                    description: this.descriptionInput.value,
                    brandId: this.state.selectedBrand,
                    type: this.typeInput.value,
                    clientId: data.id,
                };

                axios.post(path + '/product', productData, {headers:headers})
                    .then((response) => {
                        console.log(response);
                        this.setState({ productAlertMessage: "success" })
                    }).catch((error) => {
                        console.log(error);
                        if(error.response.status === 403) {
                            this.setState({ productAlertMessage: "expired"});
                        };
                        if(error.response.status === 500) {
                            this.setState({ productAlertMessage: "error"});
                        };
                    });
            }).catch(error => {
                console.log(error.response.data.errors[0].violationMessage)
                this.setState({ productAlertMessage: "error" });
                if(error.response.status === 403) {
                    this.setState({ productAlertMessage: "expired"});
                };
                if(error.response.status === 500) {
                    this.setState({ productAlertMessage: "error"});
                };
            });
    }

    render() {

        return (
            <div>
                <Form className="ClientInputs" horizontal>
                    <FormGroup >
                        <Col
                            className="ProductTextModal"
                            componentClass={ControlLabel} sm={1}>
                            Brand
                                            </Col>
                        <Col sm={10}>
                            <select
                                className="SelectBrandDropdown"
                                value={this.state.selectedBrand}
                                onChange={(selectBrand) => this.setState({ selectedBrand: selectBrand.target.value })}>
                                {this.state.brandList.map((Brand) =>
                                    <option key={Brand.id} value={Brand.id}>{Brand.name}</option>)}
                            </select>{' '}
                            <Button 
                                className="AddBrandButton"
                                bsStyle="primary" 
                                onClick={this.handleShow}>Add brand
                            </Button>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col
                            className="TypeTop"
                            componentClass={ControlLabel} sm={1}>
                            Type
                        </Col>
                        <Col 
                        sm={10}
                        className="TypeTopInput">
                            <FormControl
                                inputRef={input => this.typeInput = input}
                                type="type"
                                placeholder="Product type"
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col
                            className="ProductTextModal"
                            componentClass={ControlLabel} sm={1}>
                            Description
                                            </Col>
                        <Col
                            sm={10}
                            className="ProductInputTextField">
                            <FormControl
                                inputRef={input => this.descriptionInput = input}
                                type="description"
                                placeholder="Description"
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col
                            className="ProductTextModal"
                            componentClass={ControlLabel} sm={1}>
                            Client
                                             </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col
                            className="ClientModal"
                            componentClass={ControlLabel} sm={2}>
                            First Name
                                            </Col>
                        <Col sm={10}>
                            <FormControl
                                inputRef={input => this.firstnameInput = input}
                                type="firstName"
                                placeholder="First name" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col
                            className="ClientModal"
                            componentClass={ControlLabel} sm={2}>
                            Last Name
                                            </Col>
                        <Col sm={10}>
                            <FormControl
                                inputRef={input => this.lastnameInput = input}
                                type="lastName"
                                placeholder="Last name" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col
                            className="ClientModal"
                            componentClass={ControlLabel} sm={2}>
                            Email
                                            </Col>
                        <Col sm={10}>
                            <FormControl
                                inputRef={input => this.emailInput = input}
                                type="email"
                                placeholder="E-mail" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col
                            className="ClientModal"
                            componentClass={ControlLabel} sm={2}>
                            Phone
                                            </Col>
                        <Col sm={10}>
                            <FormControl
                                inputRef={input => this.phoneInput = input}
                                type="phone"
                                placeholder="Phone" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Button
                            onClick={this.addJobHandler}
                            className="SubmitJobButton">Submit
                        </Button>
                        <FormGroup className="ProductAlertMessage">
                            {this.state.productAlertMessage === "success" ? <SuccessAlert /> : null}
                            {this.state.productAlertMessage === "error" ? <WrongInputAlert /> : null}
                            {this.state.productAlertMessage === "expired" ? <TokenExpired /> : null}
                        </FormGroup>
                    </FormGroup>
                </Form>

                <Modal
                    bsSize="small"
                    show={this.state.showBrandModal}
                    onHide={this.handleClose}
                    container={this}
                    aria-labelledby="contained-modal-title">
                    <Modal.Header closeButton>
                        <Modal.Title id="contianed-modal-title">Add brand</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <FormControl
                                inputRef={input => this.brandInput = input}
                                type="brandname" />
                            <Button className="AddBrandButtonInModal"onClick={() => { this.addBrandHandler() }}>Add</Button>
                        </FormGroup>
                        <FormGroup className="addBrandAlertMessage">
                            {this.state.addBrandAlertMessage === "success" ? <SuccessAlert /> : null}
                            {this.state.addBrandAlertMessage === "error" ? <ErrorAlert /> : null}
                            {this.state.addBrandAlertMessage === "expired" ? <TokenExpired /> : null}
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Products;
