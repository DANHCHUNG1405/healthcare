import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";
import _ from "lodash";

class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
    };
  }

  componentDidMount() {
    let user = this.props.currentUser;
    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        password: "user.password",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrInput = ["email", "password", "firstName", "lastName", "address"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("Missing data: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.creatNewuser(this.state);
    }
  };

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === true) {
      this.props.editUser(this.state);
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.toggle}
        className={"modal-user-container"}
        size="lg"
      >
        <ModalHeader
          toggle={() => {
            this.toggle();
          }}
        >
          Edit a new user
        </ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Email</label>
              <input
                className=""
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "email")}
                value={this.state.email}
                disabled
              ></input>
            </div>
            <div className="input-container">
              <label>Password</label>
              <input
                className=""
                type="password"
                onChange={(e) => this.handleOnChangeInput(e, "password")}
                value={this.state.password}
                disabled
              ></input>
            </div>
            <div className="input-container">
              <label>First Name</label>
              <input
                className=""
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                value={this.state.firstName}
              ></input>
            </div>
            <div className="input-container">
              <label>Last Name</label>
              <input
                className=""
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                value={this.state.lastName}
              ></input>
            </div>
            <div className="input-container max-width-input">
              <label>Address</label>
              <input
                className=""
                type="text"
                onChange={(e) => this.handleOnChangeInput(e, "address")}
                value={this.state.address}
              ></input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={() => {
              this.handleSaveUser();
            }}
          >
            Save changes
          </Button>{" "}
          <Button
            color="secondary"
            className="px-3"
            onClick={() => {
              this.toggle();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
