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
      // Giả sử res.errCode là đủ để kiểm tra thành công, nếu API trả về res.data.errCode thì cần điều chỉnh lại
      if (res.errCode === 0) {
        this.setState({ step: "otp", errMsg: "" });
      } else {
        // Kiểm tra xem `res.message` có tồn tại không, nếu không thì dùng fallback.
        this.setState({ errMsg: res.message || "Không thể gửi OTP." });
      }
    } catch (e) {
      console.error("Error sending OTP:", e); // Thêm log để dễ debug
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
      if (res.errCode === 0) {
        this.setState({ verified: true, errMsg: "" }); // Cập nhật verified thành true

        // Gọi handleLookup ngay lập tức để tải lịch sử
        await this.handleLookup(); // <-- THÊM DÒNG NÀY
        this.setState({ step: "result" }); // Chuyển sang bước result sau khi lookup hoàn tất
      } else {
        // Kiểm tra xem `res.message` có tồn tại không, nếu không thì dùng fallback.
        this.setState({ errMsg: res.message || "OTP không đúng." });
      }
    } catch (e) {
      console.error("Error verifying OTP:", e); // Thêm log để dễ debug
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
        // Kiểm tra xem `res.errMessage` có tồn tại không, nếu không thì dùng fallback.
        this.setState({
          errMsg: res.errMessage || "Không tìm thấy lịch sử.",
        });
      }
    } catch (error) {
      console.error("Error looking up booking history:", error); // Thêm log để dễ debug
      this.setState({ errMsg: "Có lỗi xảy ra khi tra cứu." });
    } finally {
      this.setState({ loading: false });
    }
  };

  // ... (renderEmailStep, renderOtpStep, renderResultStep, render giữ nguyên)

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
          className="secondary-button" // Thêm class cho nút phụ
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
        {loading && <p>Đang tải lịch sử...</p>} {/* Hiển thị thông báo tải */}
        {!loading && history.length === 0 && (
          <p>Không tìm thấy lịch sử đặt lịch nào.</p>
        )}{" "}
        {/* Thông báo khi không có lịch sử */}
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
        <button
          onClick={() =>
            this.setState({
              step: "email",
              email: "",
              otp: "",
              verified: false,
              history: [],
              errMsg: "",
            })
          }
          className="secondary-button" // Thêm class cho nút phụ
        >
          Tra cứu lịch sử mới
        </button>
      </>
    );
  };

  render() {
    const { step, errMsg } = this.state;
    console.log("step: ", this.state.step);

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
