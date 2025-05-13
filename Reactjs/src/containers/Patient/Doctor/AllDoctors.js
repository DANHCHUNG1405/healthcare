import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../../containers/HomePage/HomeHeader";
import "./AllDoctors.scss";
import { getAllDoctors } from "../../../services/userService";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";

class AllDoctors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDoctors: [],
    };
  }

  async componentDidMount() {
    let res = await getAllDoctors();
    if (res && res.errCode === 0) {
      this.setState({
        allDoctors: res.data,
      });
    }
  }

  render() {
    let { allDoctors } = this.state;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="all-doctors-container">
          <div className="title">Danh sách tất cả bác sĩ</div>
          <div className="detail-doctor-body">
            {allDoctors &&
              allDoctors.length > 0 &&
              allDoctors.map((doctor, index) => {
                return (
                  <div className="each-doctor" key={index}>
                    <div className="dt-content-left">
                      <ProfileDoctor
                        doctorId={doctor.id}
                        isShowDescriptionDoctor={true}
                        isShowLinkDetail={true}
                        isShowPrice={false}
                      />
                    </div>
                    <div className="dt-content-right">
                      <DoctorSchedule doctorIdFromParent={doctor.id} />
                      <DoctorExtraInfor doctorIdFromParent={doctor.id} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

export default connect(mapStateToProps)(AllDoctors);
