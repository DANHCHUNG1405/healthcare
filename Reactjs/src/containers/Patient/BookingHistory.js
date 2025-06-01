import React, { Component } from "react";
import HomeHeader from "../HomePage/HomeHeader";
import "./BookingHistory.scss";
import {
  getBookingHistoryByEmail,
  sendOtpToEmail,
  verifyOtpCode,
} from "../../services/userService";

const statusLabels = {
  S1: "Chờ xác nhận",
  S2: "Đặt thành công",
  S3: "Đã khám",
};

class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: "email", // email | otp | result
      email: "",
      otp: "",
      verified: false,
      history: [],
      loading: false,
      errMsg: "",
    };
  }

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleChangeOtp = (event) => {
    this.setState({ otp: event.target.value });
  };

  sendOtp = async () => {
    const { email } = this.state;
    if (!email) {
      this.setState({ errMsg: "Vui lòng nhập email!" });
      return;
    }

    this.setState({ loading: true, errMsg: "" });

    try {
      const res = await sendOtpToEmail(email);
      if (res.data.errCode === 0) {
        this.setState({ step: "otp", errMsg: "" });
      } else {
        this.setState({ errMsg: res.data.message || "Không thể gửi OTP." });
      }
    } catch (e) {
      this.setState({ errMsg: "Đã xảy ra lỗi khi gửi OTP." });
    } finally {
      this.setState({ loading: false });
    }
  };

  verifyOtp = async () => {
    const { email, otp } = this.state;
    if (!otp) {
      this.setState({ errMsg: "Vui lòng nhập mã OTP!" });
      return;
    }

    this.setState({ loading: true, errMsg: "" });

    try {
      const res = await verifyOtpCode(email, otp);
      if (res.data.errCode === 0) {
        this.setState({ step: "result", verified: true, errMsg: "" });
      } else {
        this.setState({ errMsg: res.data.message || "OTP không đúng." });
      }
    } catch (e) {
      this.setState({ errMsg: "Đã xảy ra lỗi khi xác minh OTP." });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleLookup = async () => {
    const { email } = this.state;
    this.setState({ loading: true, errMsg: "", history: [] });

    try {
      const res = await getBookingHistoryByEmail(email);
      if (res.errCode === 0) {
        this.setState({ history: res.data });
      } else {
        this.setState({
          errMsg: res.data.errMessage || "Không tìm thấy lịch sử.",
        });
      }
    } catch (error) {
      this.setState({ errMsg: "Có lỗi xảy ra khi tra cứu." });
    } finally {
      this.setState({ loading: false });
    }
  };

  renderEmailStep = () => {
    const { email, loading } = this.state;
    return (
      <>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={this.handleChangeEmail}
        />
        <button onClick={this.sendOtp} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi mã OTP"}
        </button>
      </>
    );
  };

  renderOtpStep = () => {
    const { otp, loading } = this.state;
    return (
      <>
        <p>Vui lòng kiểm tra email và nhập mã OTP:</p>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={this.handleChangeOtp}
        />
        <button onClick={this.verifyOtp} disabled={loading}>
          {loading ? "Đang xác minh..." : "Xác minh"}
        </button>
        <button
          onClick={() => this.setState({ step: "email", errMsg: "", otp: "" })}
        >
          Nhập lại email
        </button>
      </>
    );
  };

  renderResultStep = () => {
    const { loading, history } = this.state;
    return (
      <>
        <button onClick={this.handleLookup} disabled={loading}>
          {loading ? "Đang tra cứu..." : "Xem lịch sử đặt lịch"}
        </button>
        <div className="booking-list">
          {history.map((item) => (
            <div key={item.id} className="booking-item">
              <p>
                <strong>Bác sĩ:</strong> {item.doctorData?.lastName}{" "}
                {item.doctorData?.firstName}
              </p>
              <p>
                <strong>Ngày khám:</strong> {item.date}
              </p>
              <p>
                <strong>Ca:</strong> {item.timeTypeDataPatient?.valueVi}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {statusLabels[item.statusId] || item.statusId}
              </p>
            </div>
          ))}
        </div>
      </>
    );
  };

  render() {
    const { step, errMsg } = this.state;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="booking-history-container">
          <h2>Xem lịch sử đặt lịch</h2>
          {errMsg && <p className="error-message">{errMsg}</p>}

          {step === "email" && this.renderEmailStep()}
          {step === "otp" && this.renderOtpStep()}
          {step === "result" && this.renderResultStep()}
        </div>
      </>
    );
  }
}

export default BookingHistory;
