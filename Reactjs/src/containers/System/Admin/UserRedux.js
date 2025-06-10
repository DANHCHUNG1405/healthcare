import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManageUser from "./TableManageUser";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      roleArr: [],
      positionArr: [],
      previewImageURL: "", // Đổi tên previewImgURL thành previewImageURL cho nhất quán
      isOpen: false,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "", // Giá trị ban đầu nên là rỗng
      position: "", // Giá trị ban đầu nên là rỗng
      role: "", // Giá trị ban đầu nên là rỗng
      avatar: "",
      action: CRUD_ACTIONS.CREATE, // Đặt action mặc định là CREATE
      userEditId: "",
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("Current state:", this.state); // Debugging: Check current state
    // console.log("Previous props:", prevProps); // Debugging: Check previous props
    // console.log("Current props:", this.props); // Debugging: Check current props

    // Cập nhật genderArr khi genderRedux thay đổi và đặt giá trị mặc định (rỗng)
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: "", // Đặt giá trị ban đầu là rỗng
      });
    }

    // Cập nhật roleArr khi roleRedux thay đổi và đặt giá trị mặc định (rỗng)
    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
        role: "", // Đặt giá trị ban đầu là rỗng
      });
    }

    // Cập nhật positionArr khi positionRedux thay đổi và đặt giá trị mặc định (rỗng)
    if (prevProps.positionRedux !== this.props.positionRedux) {
      let positionArr = this.props.positionRedux;
      this.setState({
        positionArr: positionArr,
        position: "", // Đặt giá trị ban đầu là rỗng
      });
    }

    // Reset form khi danh sách người dùng thay đổi (ngụ ý thêm/sửa/xóa thành công)
    // Hoặc khi chuyển từ edit sang create
    if (
      prevProps.listUsers !== this.props.listUsers &&
      this.state.action === CRUD_ACTIONS.CREATE // Chỉ reset khi đang ở chế độ tạo mới
    ) {
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        gender: "", // Reset về rỗng
        position: "", // Reset về rỗng
        role: "", // Reset về rỗng
        avatar: "",
        action: CRUD_ACTIONS.CREATE,
        previewImageURL: "", // Đổi tên cho nhất quán
      });
    }
  }

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImageURL: objectUrl, // Đổi tên cho nhất quán
        avatar: base64,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImageURL) return; // Đổi tên cho nhất quán
    this.setState({
      isOpen: true,
    });
  };

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action } = this.state;

    // Lấy giá trị email hiện tại trong trường hợp chỉnh sửa
    // vì trường email bị disabled khi edit, nên nó không được cập nhật qua onChangeInput
    const currentEmail =
      this.state.action === CRUD_ACTIONS.EDIT
        ? this.state.email
        : this.state.email;

    if (action === CRUD_ACTIONS.CREATE) {
      this.props.createNewUser({
        email: currentEmail, // Sử dụng email hiện tại
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
    if (action === CRUD_ACTIONS.EDIT) {
      this.props.editAUserRedux({
        id: this.state.userEditId,
        email: currentEmail, // Sử dụng email hiện tại
        // password: this.state.password, // Không gửi password khi edit trừ khi có trường đổi password riêng
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
      "gender", // Thêm vào để validate
      "role", // Thêm vào để validate
      "position", // Thêm vào để validate
    ];

    // Chỉ validate password khi tạo mới
    if (this.state.action === CRUD_ACTIONS.CREATE) {
      arrCheck.splice(1, 0, "password"); // Chèn password vào vị trí thứ 2
    }

    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("This input is required: " + arrCheck[i]);
        break;
      }
    }
    return isValid;
  };

  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleEditUserFromParent = (user) => {
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }
    this.setState({
      email: user.email,
      password: "HARDCODE", // Giữ lại HARDCODE hoặc để rỗng, không nên hiển thị password thật
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender, // Giá trị keyMap của gender
      position: user.positionId, // Giá trị keyMap của position
      role: user.roleId, // Giá trị keyMap của role
      avatar: "", // Không giữ avatar cũ trong state để tránh gửi lại image quá lớn
      previewImageURL: imageBase64, // Ảnh preview
      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };

  render() {
    let genders = this.state.genderArr;
    let roles = this.state.roleArr;
    let positions = this.state.positionArr;
    let language = this.props.language;
    let isGetGenders = this.props.isLoadingGender;

    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
    } = this.state;

    return (
      <div className="user-redux-container">
        <div className="title">
          <FormattedMessage id="manage-user.title" />
        </div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <FormattedMessage id="manage-user.add" />
                <div className="col-12">
                  {isGetGenders === true ? "Loading genders" : ""}
                </div>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.email" />
                </label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    this.onChangeInput(event, "email");
                  }}
                  disabled={
                    this.state.action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.password" />
                </label>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    this.onChangeInput(event, "password");
                  }}
                  disabled={
                    this.state.action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.first-name" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    this.onChangeInput(event, "firstName");
                  }}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.last-name" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={lastName}
                  onChange={(event) => {
                    this.onChangeInput(event, "lastName");
                  }}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.phone-number" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={phoneNumber}
                  onChange={(event) => {
                    this.onChangeInput(event, "phoneNumber");
                  }}
                />
              </div>
              <div className="col-9">
                <label>
                  <FormattedMessage id="manage-user.address" />
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={address}
                  onChange={(event) => {
                    this.onChangeInput(event, "address");
                  }}
                />
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.gender" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "gender");
                  }}
                  value={gender}
                >
                  {/* Option rỗng/placeholder */}
                  <option value="">
                    {language === LANGUAGES.VI
                      ? "Chọn giới tính"
                      : "Select Gender"}
                  </option>
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {" "}
                          {/* Sửa từ item.key thành item.keyMap */}
                          {language === LANGUAGES.EN
                            ? item.valueEn
                            : item.valueVi}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.position" />
                </label>
                <select
                  className="inputState form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "position");
                  }}
                  value={position}
                >
                  {/* Option rỗng/placeholder */}
                  <option value="">
                    {language === LANGUAGES.VI
                      ? "Chọn chức danh"
                      : "Select Position"}
                  </option>
                  {positions &&
                    positions.length > 0 &&
                    positions.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.role" />
                </label>
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "role");
                  }}
                  value={role}
                >
                  {/* Option rỗng/placeholder */}
                  <option value="">
                    {language === LANGUAGES.VI ? "Chọn vai trò" : "Select Role"}
                  </option>
                  {roles &&
                    roles.length > 0 &&
                    roles.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LANGUAGES.EN
                            ? item.valueEn
                            : item.valueVi}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <label>
                  <FormattedMessage id="manage-user.image" />
                </label>
                <div className="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => this.handleOnchangeImage(event)}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    <FormattedMessage id="manage-user.load" />
                    <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImageURL})`, // Sửa tên state
                    }}
                    onClick={() => this.openPreviewImage()}
                  ></div>
                </div>
              </div>
              <div className="col-12 my-3">
                <button
                  className={
                    this.state.action === CRUD_ACTIONS.EDIT
                      ? "btn btn-warning"
                      : "btn btn-primary"
                  }
                  onClick={() => this.handleSaveUser()}
                >
                  {this.state.action === CRUD_ACTIONS.EDIT ? (
                    <FormattedMessage id="manage-user.edit" />
                  ) : (
                    <FormattedMessage id="manage-user.save" />
                  )}
                </button>
              </div>
              <div className="col-12 mb-5">
                <TableManageUser
                  handleEditUserFromParentKey={this.handleEditUserFromParent}
                  action={this.state.action}
                />
              </div>
            </div>
          </div>
        </div>
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImageURL} // Sửa tên state
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
