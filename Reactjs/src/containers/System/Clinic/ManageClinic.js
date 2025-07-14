import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from "../../../utils";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import {
  createNewClinic,
  getAllClinic,
  updateClinic,
  deleteClinic,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      address: "",
      clinicList: [],
      isEditMode: false,
      updateClinicId: null,
      showModal: false,
      selectedClinicId: null,
      selectedClinicName: "",
    };
  }

  async componentDidMount() {
    await this.loadAllClinics();
  }

  loadAllClinics = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({ clinicList: res.data });
    }
  };

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({ ...stateCopy });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({ imageBase64: base64 });
    }
  };

  handleSaveClinic = async () => {
    let { isEditMode, updateClinicId, ...clinicData } = this.state;
    let res;
    if (isEditMode) {
      res = await updateClinic({ id: updateClinicId, ...clinicData });
    } else {
      res = await createNewClinic(clinicData);
    }

    if (res && res.errCode === 0) {
      toast.success(`${isEditMode ? "Updated" : "Added"} clinic successfully`);
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        address: "",
        isEditMode: false,
        updateClinicId: null,
      });
      this.loadAllClinics();
    } else {
      toast.error(`${isEditMode ? "Update" : "Add"} clinic failed`);
    }
  };

  handleupdateClinic = (clinic) => {
    this.setState({
      name: clinic.name,
      address: clinic.address,
      descriptionHTML: clinic.descriptionHTML,
      descriptionMarkdown: clinic.descriptionMarkdown,
      imageBase64: clinic.image,
      isEditMode: true,
      updateClinicId: clinic.id,
    });
  };

  openDeleteModal = (clinic) => {
    this.setState({
      showModal: true,
      selectedClinicId: clinic.id,
      selectedClinicName: clinic.name,
    });
  };

  confirmDeleteClinic = async () => {
    let res = await deleteClinic(this.state.selectedClinicId);
    if (res && res.errCode === 0) {
      toast.success("Deleted clinic");
      this.setState({ showModal: false, selectedClinicId: null });
      this.loadAllClinics();
    } else {
      toast.error("Delete failed");
    }
  };

  render() {
    return (
      <div className="manage-clinic-container">
        <div className="ms-title">
          <FormattedMessage id="admin.manage-clinic.title" />
        </div>

        <div className="add-new-clinic row">
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-clinic.nameClinic" />
            </label>
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-clinic.pictureClinic" />
            </label>
            <input
              type="file"
              className="form-control-file"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-clinic.addressClinic" />
            </label>
            <input
              type="text"
              className="form-control"
              value={this.state.address}
              onChange={(event) => this.handleOnChangeInput(event, "address")}
            />
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              className="btn-save-new-clinic"
              onClick={() => this.handleSaveClinic()}
            >
              <FormattedMessage id="admin.manage-clinic.save" />
            </button>
          </div>
        </div>

        <div className="col-12 mt-4 clinic-table">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="admin.manage-clinic.nameColumn" />
                </th>
                <th>
                  <FormattedMessage id="admin.manage-clinic.addressColumn" />
                </th>
                <th>
                  <FormattedMessage id="admin.manage-clinic.actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.clinicList.map((clinic, index) => (
                <tr key={index}>
                  <td>{clinic.name}</td>
                  <td>{clinic.address}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => this.handleupdateClinic(clinic)}
                      className="btn btn-warning btn-sm"
                    >
                      <FormattedMessage id="admin.manage-clinic.edit" />
                    </button>
                    <button
                      onClick={() => this.openDeleteModal(clinic)}
                      className="btn btn-danger btn-sm"
                    >
                      <FormattedMessage id="admin.manage-clinic.delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {this.state.showModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <h3>
                <FormattedMessage
                  id="admin.manage-clinic.confirm-delete-title"
                  defaultMessage="Confirm Deletion"
                />
              </h3>
              <p>
                <FormattedMessage
                  id="admin.manage-clinic.confirm-delete-message"
                  defaultMessage="Are you sure you want to delete this clinic?"
                />
                <br />
                <strong>{this.state.selectedClinicName}</strong>
              </p>
              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={() => this.setState({ showModal: false })}
                >
                  <FormattedMessage
                    id="admin.manage-clinic.cancel"
                    defaultMessage="Cancel"
                  />
                </button>
                <button
                  className="danger-button"
                  onClick={this.confirmDeleteClinic}
                >
                  <FormattedMessage
                    id="admin.manage-clinic.confirm"
                    defaultMessage="Delete"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(ManageClinic);
