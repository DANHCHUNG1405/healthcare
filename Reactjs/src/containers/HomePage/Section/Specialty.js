import React, { Component } from "react";
import { connect } from "react-redux";
import "./Specialty.scss";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";

class Specialty extends Component {
  render() {
    return (
      <div className="section-share section-specialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Chuyên khoa phổ biến</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="bg-image section-specialty" />
                <div>Cơ xương khớp</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty2" />
                <div>Châm cứu</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty3" />
                <div>Cột sống</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty4" />
                <div>Tai mũi họng </div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty5" />
                <div>Thần kinh</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-specialty6" />
                <div>Tiêu hóa</div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
