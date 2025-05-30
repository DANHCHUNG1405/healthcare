import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <div className="footer-container">
          <div className="footer-left">
            <p>
              &copy; {new Date().getFullYear()} Do Danh Chung.{" "}
              <FormattedMessage
                id="homefooter.more-info"
                defaultMessage="More information, please contact me."
              />
            </p>
          </div>
          <div className="footer-right">
            <a
              href="https://www.facebook.com/share/1Ax5Z1xLhk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
          </div>
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
