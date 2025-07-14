import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <div className="footer-container">
          <div className="footer-column column-left">
            <p className="company-name">
              <strong>Công ty Cổ phần Công nghệ HealthCare</strong>
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> Lô B4/D21, Khu đô thị
              mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà
              Nội, Việt Nam
            </p>
            <p>ĐKKD số. 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015</p>
            <p>
              <i className="fas fa-phone"></i> 024-7301-2468 (7h30 - 18h)
            </p>
            <p>
              <i className="fas fa-envelope"></i> support@healthcare.vn (7h30 -
              18h)
            </p>
            <p>
              <strong>Văn phòng tại TP Hồ Chí Minh</strong>
              <br />
              <i className="fas fa-map-marker-alt"></i> Tòa nhà H3, 384 Hoàng
              Diệu, Phường 6, Quận 4, TP.HCM
            </p>
          </div>

          <div className="footer-column column-right">
            <p>
              <strong>Đối tác bảo trợ nội dung</strong>
            </p>
            <p>
              <strong>Hello Doctor</strong>
              <br />
              Bảo trợ chuyên mục nội dung "sức khỏe tinh thần"
            </p>
            <p>
              <strong>Hệ thống y khoa chuyên sâu quốc tế Bernard</strong>
              <br />
              Bảo trợ chuyên mục nội dung "y khoa chuyên sâu"
            </p>
            <p>
              <strong>Doctor Check - Tầm Soát Bệnh Để Sống Thọ Hơn</strong>
              <br />
              Bảo trợ chuyên mục nội dung "sức khỏe tổng quát"
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Tải ứng dụng HealthCare cho điện thoại hoặc máy tính bảng:{" "}
            <a href="#">Android</a> - <a href="#">iPhone/iPad</a> -{" "}
            <a href="#">Khác</a>
          </p>
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

export default connect(mapStateToProps)(HomeFooter);
