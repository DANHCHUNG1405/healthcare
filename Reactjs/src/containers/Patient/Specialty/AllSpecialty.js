import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import "./AllSpecialty.scss";
import { getAllSpecialty } from "../../../services/userService";
import HomeHeader from "../../HomePage/HomeHeader";
import { FormattedMessage } from "react-intl";
class AllSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSpecialty: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }

  handleViewDetailSpecialty = (item) => {
    this.props.history.push(`/detail-specialty/${item.id}`);
  };

  render() {
    let { dataSpecialty } = this.state;

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="all-specialty-container">
          <h2 className="all-specialty-title">
            <FormattedMessage id="patient.list.specialty" />
          </h2>
          <div className="all-specialty-grid">
            {dataSpecialty &&
              dataSpecialty.length > 0 &&
              dataSpecialty.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="specialty-card"
                    onClick={() => this.handleViewDetailSpecialty(item)}
                  >
                    <div
                      className="specialty-image"
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    <div className="specialty-name">{item.name}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(connect(null, null)(AllSpecialty));
