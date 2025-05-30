import React, { Component } from "react";
import axios from "axios";
import HomeHeader from "../HomePage/HomeHeader";
import "./BookingHistory.scss";
import { getBookingHistoryByEmail } from "../../services/userService";
const statusLabels = {
  S1: "Chờ xác nhận",
  S2: "Đặt thành công",
  S3: "Đã khám",
};
class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      history: [],
      loading: false,
      errMsg: "",
    };
  }

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleLookup = async () => {
    const { email } = this.state;
    if (!email) {
      this.setState({ errMsg: "Vui lòng nhập email!" });
      return;
    }

    this.setState({ loading: true, errMsg: "", history: [] });

    try {
      const res = await getBookingHistoryByEmail(email);
      if (res.errCode === 0) {
        console.log("Dữ liệu lịch sử nhận được:", res.data);
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

  render() {
    const { email, history, loading, errMsg } = this.state;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="booking-history-container">
          <h2>Xem lịch sử đặt lịch</h2>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={this.handleChangeEmail}
          />
          <button onClick={this.handleLookup} disabled={loading}>
            {loading ? "Đang tra cứu..." : "Xem lịch sử"}
          </button>

          {errMsg && <p className="error-message">{errMsg}</p>}

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
        </div>
      </>
    );
  }
}

export default BookingHistory;
