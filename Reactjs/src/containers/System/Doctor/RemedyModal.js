import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./RemedyModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
// import * as actions from '../../../../store/actions'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { toast } from "react-toastify";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
    };
  }
  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  componentDidUpdate(prevProps, preState, snapshot) {
    if (this.props.dataModal !== prevProps.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  handleOnchangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imgBase64: base64,
      });
    }
    // event.target.value = null;
  };

  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };
  render() {
    // toggle={ }
    let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;

    return (
      <>
        {/* <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button> */}
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="md"
          centered
        >
          {/* <ModalHeader toggle={closeRemedyModal}>Modal title</ModalHeader> */}
          <div className="modal-header">
            <h5 className="modal-title">Gửi hóa đơn khám bênh thành công</h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={closeRemedyModal}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <ModalBody>
            <div className="row">
              <div className="col-6 form-group">
                <label>Email bệnh nhân</label>
                <input
                  className="form-control"
                  type="email"
                  value={this.state.email}
                  onChange={(event) => this.handleOnchangeEmail(event)}
                />
              </div>
              <div className="col-6 form-group">
                <div className="">
                  <label>Chọn file đơn thuốc</label>
                  <input
                    className="form-control-file"
                    type="file"
                    onChange={(event) => this.handleOnchangeImage(event)}
                  ></input>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => this.handleSendRemedy()}>
              Send
            </Button>{" "}
            <Button color="secondary" onClick={closeRemedyModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    // genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchGenders: () => dispatch(actions.fetchGenderStart())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
