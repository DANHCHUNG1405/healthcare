import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          <FormattedMessage id="homepage.communication" />
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/FyDQljKtWnI"
              title="CÀ PHÊ KHỞI NGHIỆP VTV1 - HEALTHCARE - HỆ THỐNG ĐẶT LỊCH KHÁM TRỰC TUYẾN"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="content-right">
            {/* <p>
              HealthCare is a medical appointment booking app that helps
              patients easily schedule consultations with doctors online. With
              HealthCare, users can search for doctors by specialty, view
              detailed profiles, and book appointments based on real-time
              availability. The app sends instant booking confirmations and
              reminders to ensure patients never miss an appointment. For
              clinics, HealthCare simplifies doctor schedule management and
              reduces patient wait times. Designed with a user-friendly
              interface and strong data security, HealthCare enhances the
              overall healthcare experience for both patients and medical
              professionals.
            </p> */}
            <p>
              <FormattedMessage id="homepage.description" />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
