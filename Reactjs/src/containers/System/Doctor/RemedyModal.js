import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./RemedyModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { toast } from "react-toastify";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
      diagnosis: "",
      patientName: "", // <-- Thêm trường patientName vào state
    };
  }
  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
        patientName: this.props.dataModal.patientName || "", // <-- Set patientName từ props
      });
    }
  }

  componentDidUpdate(prevProps, preState, snapshot) {
    if (this.props.dataModal !== prevProps.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
        patientName: this.props.dataModal.patientName || "", // <-- Set patientName khi props thay đổi
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
  };

  handleSendRemedy = () => {
    // Gửi cả email, imgBase64, diagnosis, patientName
    console.log("Sending remedy with data:", this.state);
    this.props.sendRemedy(this.state);
  };

  render() {
    let { isOpenModal, closeRemedyModal } = this.props;

    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="md"
          centered
        >
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
                  onChange={this.handleOnchangeEmail}
                />
              </div>
              <div className="col-6 form-group">
                <label>Chọn file đơn thuốc</label>
                <input
                  className="form-control-file"
                  type="file"
                  onChange={this.handleOnchangeImage}
                />
              </div>
              <div className="col-12 form-group mt-3">
                <label>Chẩn đoán</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={this.state.diagnosis}
                  onChange={(e) => this.setState({ diagnosis: e.target.value })}
                ></textarea>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSendRemedy}>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
