import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import { handleLoginApi } from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errorMessage: "",
    };
  }

  componentDidMount() {
    const { isLoggedIn, userInfo } = this.props;
    if (isLoggedIn && userInfo) {
      this.redirectToRoleBasedPage(userInfo.roleId);
    }
  }

  redirectToRoleBasedPage = (roleId) => {
    switch (roleId) {
      case "R1":
        this.props.navigate("/system/user-redux");
        break;
      case "R2":
        this.props.navigate("/doctor/manage-schedule");
        break;
      default:
        this.props.navigate("/home");
        break;
    }
  };

  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleLogin = async () => {
    this.setState({ errorMessage: "" });

    try {
      const data = await handleLoginApi(
        this.state.username,
        this.state.password
      );

      if (data && data.errCode !== 0) {
        this.setState({ errorMessage: data.message });
      }

      if (data && data.errCode === 0) {
        localStorage.setItem("accessToken", data.user.accessToken);

        // Optional: reset user login state in persist
        let persistUser = {
          isLoggedIn: "true",
          userInfo: JSON.stringify(data.user),
        };
        localStorage.setItem("persist:user", JSON.stringify(persistUser));

        this.props.userLoginSuccess(data.user);
        this.redirectToRoleBasedPage(data.user.roleId);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        this.setState({
          errorMessage: error.response.data.message,
        });
      } else {
        this.setState({
          errorMessage: "An error occurred. Please try again.",
        });
      }
    }
  };

  handleShowPassword = () => {
    this.setState((prevState) => ({
      isShowPassword: !prevState.isShowPassword,
    }));
  };

  handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.handleLogin();
    }
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Login</div>
            <div className="col-12 form-group login-input">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleOnChangeUsername}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Password</label>
              <div className="custom-input-password">
                <input
                  className="form-control"
                  type={this.state.isShowPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={this.handleOnChangePassword}
                  onKeyDown={this.handleKeyDown}
                />
                <span onClick={this.handleShowPassword}>
                  <i
                    className={
                      this.state.isShowPassword
                        ? "fas fa-eye-slash"
                        : "far fa-eye"
                    }
                  ></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{ color: "red" }}>
              {this.state.errorMessage}
            </div>
            <div className="col-12">
              <button className="btn-login" onClick={this.handleLogin}>
                Login
              </button>
            </div>
            {/* <div className="col-12">
              <span className="forgot-password">Forgot your password?</span>
            </div> */}
            <div className="col-12 text-center mt-3">
              {/* <span className="text-other-login">Or Login with:</span> */}
            </div>
            <div className="col-12 social-login">
              {/* <i className="fab fa-google-plus-g google"></i>
              <i className="fab fa-facebook-f facebook"></i> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
