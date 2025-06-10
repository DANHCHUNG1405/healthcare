import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { CommonUtils } from "../../../utils";
import { FormattedMessage } from "react-intl";
class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      prescription: "",
      diagnosis: "",
      patientName: "",
      bookingId: "",
    };
  }

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
        patientName: this.props.dataModal.patientName || "",
        bookingId: this.props.dataModal.bookingId || "",
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataModal !== prevProps.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
        patientName: this.props.dataModal.patientName || "",
        bookingId: this.props.dataModal.bookingId || "",
      });
    }
  }

  handleOnchangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleOnchangeImage = async (event) => {
    let file = event.target.files?.[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        prescription: base64, // ✅ dùng prescription
      });
    }
  };

  handleSendRemedy = () => {
    console.log("Sending remedy with data:", this.state);
    this.props.sendRemedy(this.state);
  };

  render() {
    let { isOpenModal, closeRemedyModal } = this.props;

    return (
      <Modal
        isOpen={isOpenModal}
        className="booking-modal-container"
        size="md"
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title">
            <FormattedMessage id="doctor.modal.title" />
          </h5>
          <button type="button" className="close" onClick={closeRemedyModal}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="doctor.modal.email" />
              </label>
              <input
                className="form-control"
                type="email"
                value={this.state.email}
                onChange={this.handleOnchangeEmail}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="doctor.modal.prescription" />
              </label>
              <input
                className="form-control-file"
                type="file"
                onChange={this.handleOnchangeImage}
              />
            </div>
            <div className="col-12 form-group mt-3">
              <label>
                <FormattedMessage id="doctor.modal.diagnosis" />
              </label>
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
            <FormattedMessage id="doctor.modal.send" />
          </Button>
          <Button color="secondary" onClick={closeRemedyModal}>
            <FormattedMessage id="doctor.modal.cancel" />
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default connect(mapStateToProps)(RemedyModal);
