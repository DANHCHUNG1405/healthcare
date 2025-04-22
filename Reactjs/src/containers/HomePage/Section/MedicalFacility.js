import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
class MedicalFacility extends Component {
  render() {
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Cơ sở y tế nổi bật</span>
            <button className="btn-section">Xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="bg-image section-medical-facility" />
                <div>Bệnh viện Thu Cúc</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medical-facility2" />
                <div>Bệnh viện Việt Đức</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medical-facility3" />
                <div>Phòng khám đa khoa Medlatech Thanh Xuân</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medical-facility4" />
                <div>Bệnh viện K</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medical-facility5" />
                <div>Trung tâm xét nghiệm Diag</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-medical-facility6" />
                <div>Phòng khám bệnh viện đại học y dược 1</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
