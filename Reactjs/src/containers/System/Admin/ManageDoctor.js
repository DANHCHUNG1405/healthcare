import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import * as actions from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES } from "../../../utils";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { getDetailInforDoctor } from "../../../services/userService";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: null,
      description: "",
      listDoctors: [],
      hasOldData: false,

      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: null,
      selectedPayment: null,
      selectedProvince: null,
      selectedClinic: null,
      selectedSpecialty: null,
      note: "",
      clinicAddress: "", // <-- Đã thêm state này
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({ listDoctors: dataSelect });
    }

    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      let { resPayment, resPrice, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;
      this.setState({
        listPrice: this.buildDataInputSelect(resPrice, "PRICE"),
        listPayment: this.buildDataInputSelect(resPayment, "PAYMENT"),
        listProvince: this.buildDataInputSelect(resProvince, "PROVINCE"),
        listSpecialty: this.buildDataInputSelect(resSpecialty, "SPECIALTY"),
        listClinic: this.buildDataInputSelect(resClinic, "CLINIC"),
      });
    }

    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPayment, resPrice, resProvince, resSpecialty, resClinic } =
        this.props.allRequiredDoctorInfor;

      this.setState({
        listDoctors: dataSelect,
        listPrice: this.buildDataInputSelect(resPrice, "PRICE"),
        listPayment: this.buildDataInputSelect(resPayment, "PAYMENT"),
        listProvince: this.buildDataInputSelect(resProvince, "PROVINCE"),
        listSpecialty: this.buildDataInputSelect(resSpecialty, "SPECIALTY"),
        listClinic: this.buildDataInputSelect(resClinic, "CLINIC"),
      });
    }
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      switch (type) {
        case "USERS":
          result = inputData.map((item) => ({
            label:
              language === LANGUAGES.VI
                ? `${item.lastName} ${item.firstName}`
                : `${item.firstName} ${item.lastName}`,
            value: item.id,
          }));
          break;
        case "PRICE":
          result = inputData.map((item) => ({
            label:
              language === LANGUAGES.VI ? item.valueVi : `${item.valueEn} USD`,
            value: item.keyMap,
          }));
          break;
        case "PAYMENT":
        case "PROVINCE":
          result = inputData.map((item) => ({
            label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
            value: item.keyMap,
          }));
          break;
        case "SPECIALTY":
        case "CLINIC":
          result = inputData.map((item) => ({
            label: item.name,
            value: item.id,
            address: item.address, // <-- Đảm bảo rằng bạn có trường 'address' ở đây
          }));
          break;
        default:
          break;
      }
    }
    return result;
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleSaveContentMarkdown = () => {
    let {
      hasOldData,
      contentHTML,
      contentMarkdown,
      description,
      selectedOption,
      selectedPrice,
      selectedPayment,
      selectedProvince,
      note,
      selectedClinic,
      selectedSpecialty,
    } = this.state;

    if (!selectedOption) {
      alert("Please select a doctor!");
      return;
    }

    this.props.saveDetailDoctor({
      contentHTML,
      contentMarkdown,
      description,
      doctorId: selectedOption.value,
      action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: selectedPrice ? selectedPrice.value : "",
      selectedPayment: selectedPayment ? selectedPayment.value : "",
      selectedProvince: selectedProvince ? selectedProvince.value : "",
      note,
      clinicId: selectedClinic ? selectedClinic.value : "",
      specialtyId: selectedSpecialty ? selectedSpecialty.value : "",
    });
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    if (!selectedOption) {
      this.resetForm();
      return;
    }

    let res = await getDetailInforDoctor(selectedOption.value);

    if (res && res.errCode === 0 && res.data) {
      let markdown = res.data.Markdown || {};
      let doctorInfo = res.data.Doctor_Infor || {};

      const {
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        specialtyId = "",
        clinicId = "",
      } = doctorInfo;

      let selectedPayment = this.state.listPayment.find(
        (item) => item.value === paymentId
      );
      let selectedPrice = this.state.listPrice.find(
        (item) => item.value === priceId
      );
      let selectedProvince = this.state.listProvince.find(
        (item) => item.value === provinceId
      );
      let selectedSpecialty = this.state.listSpecialty.find(
        (item) => item.value === specialtyId
      );
      let selectedClinic = this.state.listClinic.find(
        (item) => item.value === clinicId
      );

      // <-- Lấy địa chỉ phòng khám từ selectedClinic (đã có trường 'address' trong buildDataInputSelect cho CLINIC)
      let clinicAddress = selectedClinic ? selectedClinic.address : "";

      this.setState({
        contentHTML: markdown.contentHTML || "",
        contentMarkdown: markdown.contentMarkdown || "",
        description: markdown.description || "",
        hasOldData:
          markdown.contentHTML ||
          markdown.contentMarkdown ||
          markdown.description
            ? true
            : false,
        note,
        selectedPayment: selectedPayment || null,
        selectedPrice: selectedPrice || null,
        selectedProvince: selectedProvince || null,
        selectedSpecialty: selectedSpecialty || null,
        selectedClinic: selectedClinic || null,
        clinicAddress: clinicAddress, // <-- Cập nhật state địa chỉ
      });
    } else {
      this.resetForm();
    }
  };

  resetForm = () => {
    this.setState({
      contentHTML: "",
      contentMarkdown: "",
      description: "",
      hasOldData: false,
      note: "",
      selectedPayment: null,
      selectedPrice: null,
      selectedProvince: null,
      selectedSpecialty: null,
      selectedClinic: null,
      clinicAddress: "", // <-- Reset địa chỉ khi không có dữ liệu cũ hoặc chọn lại
    });
  };

  handleChangeSelectDoctorInfor = (selectedOption, name) => {
    // Khi người dùng chọn phòng khám, cập nhật cả selectedClinic và clinicAddress
    if (name.name === "selectedClinic") {
      this.setState({
        selectedClinic: selectedOption,
        clinicAddress: selectedOption ? selectedOption.address : "", // Cập nhật địa chỉ ngay lập tức
      });
    } else {
      this.setState({ [name.name]: selectedOption });
    }
  };

  handleOnChangeText = (event, id) => {
    this.setState({ [id]: event.target.value });
  };

  render() {
    let { hasOldData } = this.state;
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id={"admin.manage-doctor.title"} />
        </div>
        <div className="more-infor">
          <div className="content-left">
            <label>
              <FormattedMessage id={"admin.manage-doctor.select-doctor"} />
            </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              }
              name={"selectedOption"}
              isClearable
            />
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id={"admin.manage-doctor.intro"} />
            </label>
            <textarea
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id={"admin.manage-doctor.price"} />
            </label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPrice}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.price"} />
              }
              name="selectedPrice"
              isClearable
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id={"admin.manage-doctor.payment"} />
            </label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPayment}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.payment"} />
              }
              name="selectedPayment"
              isClearable
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id={"admin.manage-doctor.province"} />
            </label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listProvince}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.province"} />
              }
              name="selectedProvince"
              isClearable
            />
          </div>

          <div className="col-4 form-group">
            <label>
              <FormattedMessage id={"admin.manage-doctor.note"} />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id={"admin.manage-doctor.specialty"} />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listSpecialty}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.specialty"} />
              }
              name="selectedSpecialty"
              isClearable
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id={"admin.manage-doctor.select-clinic"} />
            </label>
            <Select
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listClinic}
              placeholder={
                <FormattedMessage id={"admin.manage-doctor.select-clinic"} />
              }
              name="selectedClinic"
              isClearable
            />
          </div>
          {/* <-- ĐÃ THÊM PHẦN NÀY CHO ĐỊA CHỈ PHÒNG KHÁM */}
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.addressClinic" />
            </label>
            <input
              type="text"
              className="form-control"
              value={this.state.clinicAddress}
              disabled // Để không cho phép chỉnh sửa
            />
          </div>
          {/* <-- KẾT THÚC PHẦN THÊM */}
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <button
          className={
            hasOldData ? "save-content-doctor" : "create-content-doctor"
          }
          onClick={this.handleSaveContentMarkdown}
        >
          {hasOldData ? (
            <FormattedMessage id={"admin.manage-doctor.save"} />
          ) : (
            <FormattedMessage id={"admin.manage-doctor.add"} />
          )}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
