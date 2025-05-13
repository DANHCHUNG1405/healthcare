import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
      isDoctor: false,
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();

    const { userInfo } = this.props;
    if (userInfo && userInfo.roleId === "R2") {
      const doctorId = userInfo.id;
      const doctorLabel = this.buildDoctorLabel(userInfo);
      this.setState({
        selectedDoctor: {
          label: doctorLabel,
          value: doctorId,
        },
        isDoctor: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({
          ...item,
          isSelected: false,
        }));
      }
      this.setState({
        rangeTime: data,
      });
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  buildDoctorLabel = (userInfo) => {
    let { language } = this.props;
    if (!userInfo) return "";
    let labelVi = `${userInfo.lastName} ${userInfo.firstName}`;
    let labelEn = `${userInfo.firstName} ${userInfo.lastName}`;
    return language === LANGUAGES.VI ? labelVi : labelEn;
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({ currentDate: date[0] });
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (!currentDate) {
      toast.error("Invalid date!");
      return;
    }

    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor!");
      return;
    }

    let formatedDate = moment(currentDate).format("YYYY-MM-DD");
    if (!formatedDate || formatedDate === "Invalid date") {
      toast.error("Invalid date format!");
      return;
    }

    let selectedTime = rangeTime.filter((item) => item.isSelected === true);
    if (selectedTime && selectedTime.length > 0) {
      selectedTime.map((schedule) => {
        let object = {};
        object.doctorId = selectedDoctor.value;
        object.date = formatedDate;
        object.timeType = schedule.keyMap;
        result.push(object);
      });
    } else {
      toast.error("Invalid selected time!");
      return;
    }

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formatedDate: formatedDate,
    });

    if (res && res.errCode === 0) {
      toast.success("Save info succeeded!");
    } else {
      toast.error("Error in saveBulkScheduleDoctor");
    }
  };

  render() {
    let { rangeTime, selectedDoctor, listDoctors, currentDate, isDoctor } =
      this.state;
    let { language } = this.props;
    let today = new Date();

    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              {isDoctor ? (
                <input
                  type="text"
                  className="form-control"
                  value={selectedDoctor.label}
                  disabled
                />
              ) : (
                <Select
                  value={selectedDoctor}
                  onChange={this.handleChangeSelect}
                  options={listDoctors}
                />
              )}
            </div>
            <div className="col-6">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                onChange={this.handleOnchangeDatePicker}
                className="form-control"
                value={currentDate}
                minDate={today}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={this.handleSaveSchedule}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
