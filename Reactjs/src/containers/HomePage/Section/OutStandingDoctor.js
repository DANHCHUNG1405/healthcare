import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";
import { withRouter } from "react-router";
import "./OutStandingDoctor.scss";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  componentDidMount() {
    this.props.loadTopDoctors();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("topDoctorsRedux:", this.props.topDoctorsRedux);

    if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux,
      });
    }
  }
  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };
  render() {
    let { language } = this.props;
    let arrDoctors = this.state.arrDoctors;
    arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);

    return (
      <div className=" section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.outstanding-doctor" />
            </span>
            <button
              className="btn-section"
              onClick={() => this.props.history.push("/all-doctors")}
            >
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = Buffer.from(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                  let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                  return (
                    <div
                      key={index}
                      className="section-customize"
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstanding-doctor"
                            style={{ backgroundImage: `url(${imageBase64})` }}
                          ></div>
                        </div>
                        <div className="position text-center">
                          <div>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                          </div>
                          <div className="specialty-name">
                            {item.Doctor_Infor &&
                              item.Doctor_Infor.specialtyData &&
                              item.Doctor_Infor.specialtyData.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorsRedux: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
