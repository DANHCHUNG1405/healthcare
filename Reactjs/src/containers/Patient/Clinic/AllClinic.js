import React, { Component } from "react";
import { connect } from "react-redux";
import "./AllClinic.scss";
import HomeHeader from "../../../containers/HomePage/HomeHeader";
import { getAllClinic } from "../../../services/userService";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
class AllClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data || [],
      });
    }
  }

  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };

  render() {
    let { dataClinics } = this.state;
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="all-clinic-container">
          <div className="all-clinic-title">
            <FormattedMessage id="patient.list.clinic" />
          </div>
          <div className="all-clinic-grid">
            {dataClinics &&
              dataClinics.length > 0 &&
              dataClinics.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="clinic-card"
                    onClick={() => this.handleViewDetailClinic(item)}
                  >
                    <div
                      className="clinic-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="clinic-name">{item.name}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(connect(null, null)(AllClinic));
