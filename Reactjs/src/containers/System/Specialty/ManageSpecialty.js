import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils } from "../../../utils";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import {
  createNewSpecialty,
  getAllSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from "../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      listSpecialties: [],
      isEditing: false,
      editingId: null,
      showDeleteModal: false,
      deletingSpecialtyId: null,
    };
  }

  async componentDidMount() {
    this.fetchAllSpecialties();
  }

  fetchAllSpecialties = async () => {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({ listSpecialties: res.data });
    }
  };

  handleOnChangeInput = (event, id) => {
    this.setState({ [id]: event.target.value });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnchangeImage = async (event) => {
    let file = event.target.files[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({ imageBase64: base64 });
    }
  };

  handleSaveNewSpecialty = async () => {
    let {
      name,
      imageBase64,
      descriptionHTML,
      descriptionMarkdown,
      isEditing,
      editingId,
    } = this.state;

    if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    let res;
    if (isEditing) {
      res = await updateSpecialty({
        id: editingId,
        name,
        imageBase64,
        descriptionHTML,
        descriptionMarkdown,
      });
    } else {
      res = await createNewSpecialty({
        name,
        imageBase64,
        descriptionHTML,
        descriptionMarkdown,
      });
    }

    if (res && res.errCode === 0) {
      toast.success(
        isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!"
      );
      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        isEditing: false,
        editingId: null,
      });
      await this.fetchAllSpecialties();
    } else {
      toast.error(res.errMessage || "Lỗi thao tác");
    }
  };

  handleEditSpecialty = (specialty) => {
    this.setState({
      name: specialty.name,
      imageBase64: specialty.image,
      descriptionHTML: specialty.descriptionHTML,
      descriptionMarkdown: specialty.descriptionMarkdown,
      isEditing: true,
      editingId: specialty.id,
    });
  };

  openDeleteModal = (id) => {
    this.setState({
      showDeleteModal: true,
      deletingSpecialtyId: id,
    });
  };

  closeDeleteModal = () => {
    this.setState({
      showDeleteModal: false,
      deletingSpecialtyId: null,
    });
  };

  confirmDeleteSpecialty = async () => {
    const { deletingSpecialtyId } = this.state;
    if (deletingSpecialtyId) {
      let res = await deleteSpecialty({ id: deletingSpecialtyId });
      if (res && res.errCode === 0) {
        toast.success("Xóa thành công!");
        this.fetchAllSpecialties();
      } else {
        toast.error("Xóa thất bại");
      }
      this.closeDeleteModal();
    }
  };

  render() {
    let {
      listSpecialties,
      name,
      descriptionMarkdown,
      isEditing,
      showDeleteModal,
    } = this.state;

    return (
      <div className="manage-specialty-container">
        <div className="ms-title">
          <FormattedMessage id="admin.manage-specialty.title" />
        </div>

        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-specialty.nameSpecialty" />
            </label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-specialty.pictureSpecialty" />
            </label>
            <input
              type="file"
              className="form-control-file"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              className="btn-save-new-specialty"
              onClick={this.handleSaveNewSpecialty}
            >
              {isEditing ? (
                <FormattedMessage id="admin.manage-specialty.update" />
              ) : (
                <FormattedMessage id="admin.manage-specialty.save" />
              )}
            </button>
          </div>
        </div>

        <div className="col-12 mt-5 specialty-table">
          <h5 className="text-left mb-4">
            <FormattedMessage id="admin.manage-specialty.listTitle" />
          </h5>

          <table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="admin.manage-specialty.nameSpecialty" />
                </th>
                <th style={{ width: "160px" }}>
                  <FormattedMessage id="admin.manage-specialty.actions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {listSpecialties &&
                listSpecialties.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-warning"
                          onClick={() => this.handleEditSpecialty(item)}
                        >
                          <FormattedMessage id="admin.manage-specialty.edit" />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.openDeleteModal(item.id)}
                        >
                          <FormattedMessage id="admin.manage-specialty.delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {showDeleteModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <h3>
                <FormattedMessage
                  id="admin.manage-specialty.confirmDeleteTitle"
                  defaultMessage="Xác nhận xóa chuyên khoa"
                />
              </h3>
              <p>
                <FormattedMessage
                  id="admin.manage-specialty.confirmDeleteMessage"
                  defaultMessage="Bạn có chắc chắn muốn xóa chuyên khoa này không?"
                />
              </p>
              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={this.closeDeleteModal}
                >
                  <FormattedMessage
                    id="admin.manage-specialty.cancel"
                    defaultMessage="Không"
                  />
                </button>
                <button
                  className="danger-button"
                  onClick={this.confirmDeleteSpecialty}
                >
                  <FormattedMessage
                    id="admin.manage-specialty.confirm"
                    defaultMessage="Có"
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

export default connect(mapStateToProps)(ManageSpecialty);
