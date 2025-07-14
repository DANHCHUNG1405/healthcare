import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { FormattedMessage } from "react-intl";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      diagnosis: "",
      patientName: "",
      bookingId: "",
      medications: [{ name: "", dose: "", frequency: "", note: "" }],
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

  handleInputChange = (event, index, field) => {
    const newMedications = [...this.state.medications];
    newMedications[index][field] = event.target.value;
    this.setState({ medications: newMedications });
  };

  handleAddMedication = () => {
    this.setState({
      medications: [
        ...this.state.medications,
        { name: "", dose: "", frequency: "", note: "" },
      ],
    });
  };

  handleRemoveMedication = (index) => {
    const medications = [...this.state.medications];
    medications.splice(index, 1);
    this.setState({ medications });
  };

  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };

  render() {
    let { isOpenModal, closeRemedyModal } = this.props;
    const { email, diagnosis, medications } = this.state;

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
            <div className="col-12 form-group">
              <label>
                <FormattedMessage id="doctor.modal.email" />
              </label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div className="col-12 form-group">
              <label>
                <FormattedMessage id="doctor.modal.diagnosis" />
              </label>
              <textarea
                className="form-control"
                rows="3"
                value={diagnosis}
                onChange={(e) => this.setState({ diagnosis: e.target.value })}
              ></textarea>
            </div>

            <div className="col-12">
              <label>
                <strong>
                  <FormattedMessage id="doctor.modal.medication-title" />
                </strong>
              </label>
              {medications.map((med, index) => (
                <div
                  className="medication-card mb-3 p-3 border rounded"
                  key={index}
                >
                  <div className="form-row">
                    <div className="col-md-3 form-group">
                      <label>
                        <FormattedMessage id="doctor.modal.medication-name" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={med.name}
                        onChange={(e) =>
                          this.handleInputChange(e, index, "name")
                        }
                      />
                    </div>
                    <div className="col-md-3 form-group">
                      <label>
                        <FormattedMessage id="doctor.modal.medication-dose" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={med.dose}
                        onChange={(e) =>
                          this.handleInputChange(e, index, "dose")
                        }
                      />
                    </div>
                    <div className="col-md-3 form-group">
                      <label>
                        <FormattedMessage id="doctor.modal.medication-frequency" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={med.frequency}
                        onChange={(e) =>
                          this.handleInputChange(e, index, "frequency")
                        }
                      />
                    </div>
                    <div className="col-md-3 form-group">
                      <label>
                        <FormattedMessage id="doctor.modal.medication-note" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={med.note}
                        onChange={(e) =>
                          this.handleInputChange(e, index, "note")
                        }
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.handleRemoveMedication(index)}
                    >
                      <FormattedMessage id="doctor.modal.medication-remove" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-success mt-2"
                onClick={this.handleAddMedication}
              >
                + <FormattedMessage id="doctor.modal.medication-add" />
              </button>
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
