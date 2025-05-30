import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import logo from "../../assets/logo.PNG";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from "react-router";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: 0,
      placeholderTexts: [
        "Tìm kiếm chuyên khoa",
        "Tìm kiếm cơ sở y tế",
        "Tìm kiếm bác sĩ",
      ],
    };
  }

  componentDidMount() {
    this.placeholderInterval = setInterval(() => {
      this.setState((prevState) => ({
        placeholderIndex:
          (prevState.placeholderIndex + 1) % prevState.placeholderTexts.length,
      }));
    }, 3000);
  }

  componentWillUnmount() {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push("/home");
    }
  };

  handleViewDoctor = () => {
    if (this.props.history) {
      this.props.history.push("/all-doctors");
    }
  };

  handleViewSpecialty = () => {
    if (this.props.history) {
      this.props.history.push("/all-specialty");
    }
  };

  handleViewClinic = () => {
    if (this.props.history) {
      this.props.history.push("/all-clinic");
    }
  };
  handleSearchClick = () => {
    if (this.props.history) {
      this.props.history.push("/search");
    }
  };
  handleViewBookingHistory = () => {
    if (this.props.history) {
      this.props.history.push("/booking-history");
    }
  };

  render() {
    let { language } = this.props;
    let { placeholderIndex, placeholderTexts } = this.state;

    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <img
                className="header-logo"
                src={logo}
                onClick={() => this.returnToHome()}
                alt="logo"
              />
            </div>
            <div className="center-content">
              <div
                className="child-content"
                onClick={() => this.handleViewSpecialty()}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.speciality" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.searchdoctor" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleViewClinic()}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.health-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="homeheader.select-room" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleViewDoctor()}
              >
                <div>
                  <b>
                    <FormattedMessage id="homeheader.doctor" />
                  </b>
                </div>
                <div>
                  <FormattedMessage id="homeheader.select-doctor" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="history" onClick={this.handleViewBookingHistory}>
                <i className="fas fa-question-circle"></i>
                Lịch hẹn
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                  VN
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>

        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>
              <div className="search" onClick={this.handleSearchClick}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder={placeholderTexts[placeholderIndex]}
                />
              </div>
            </div>
            <div className="content-down">
              {/* Nội dung banner content-down nếu cần */}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfor: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
