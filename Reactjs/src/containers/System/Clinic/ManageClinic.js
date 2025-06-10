import React, { Component } from "react";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import { createNewClinic } from "../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      address: "",
    };
  }
  async componentDidMount() {}

  async componentDidUpdate(prevProps, preState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  showHideDetailInfor = (status) => {
    this.setState({
      isShowDetailInfor: status,
    });
  };

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
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
      this.setState({
        imageBase64: base64,
      });
    }
    // event.target.value = null;
  };

  handleSaveNewClinic = async () => {
    let res = await createNewClinic({
      ...this.state,
    });
    if (res && res.errCode === 0) {
      console.log(
        "🚀 ~ file: ManageClinic.js:70 ~ ManageClinic ~ handleSaveNewClinic= ~ res",
        res
      );
      toast.success("Add new clinic succeeds");
      this.setState({
        name: "",
        imageBase64: "",
        address: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      toast.error("Add new clinic error");
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
            ></input>
          </div>
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-clinic.pictureClinic" />
            </label>
            <input
              type="file"
              className="form-control-file"
              onChange={(event) => this.handleOnchangeImage(event)}
            ></input>
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
            ></input>
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
              onClick={() => this.handleSaveNewClinic()}
            >
              <FormattedMessage id="admin.manage-clinic.save" />
            </button>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
