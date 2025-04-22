import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

// import * as actions from "../store/actions";
import * as actions from "../../store/actions";
import "./Login.scss";
import { FormattedMessage } from "react-intl";
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
    this.setState({
      errorMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        // console.log('data:', data)
        this.setState({
          errorMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        localStorage.setItem("accessToken", data.user.accessToken);
        let localUserData = JSON.parse(localStorage.getItem("persist:user"));
        localUserData.isLoggedIn = "true";
        localStorage.setItem("persist:user", JSON.stringify(localUserData));
        this.props.userLoginSuccess(data.user);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          this.setState({
            errorMessage: error.response.data.message,
          });
        }
      }

      // console.log(error)
    }
  };
  handleShowPassowrd = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };
  // testCount = () => {
  //     this.setState({
  //         count: this.state.count + 1
  //     })
  // }
  handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.handleLogin();
    }
  };
  render() {
    return (
      <>
        {/* <div>
                    <MyComponent
                    // count={this.state.count}
                    />
                </div>
                <div><button onClick={() => this.testCount()} >Click</button></div> */}
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
                  onChange={(event) => this.handleOnChangeUsername(event)}
                />
              </div>
              <div className="col-12 form-group login-input">
                <label>Password</label>
                <div className="custom-input-password">
                  <input
                    className="form-control"
                    type={this.state.isShowPassword ? "text" : "password"}
                    placeholder="Enter your passowrd"
                    value={this.state.password}
                    onChange={(event) => this.handleOnChangePassword(event)}
                    onKeyDown={(event) => this.handleKeyDown(event)}
                  />
                  <span onClick={() => this.handleShowPassowrd()}>
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
                <button
                  className="btn-login"
                  onClick={() => this.handleLogin()}
                >
                  Login
                </button>
              </div>
              <div className="col-12">
                <span className="forgot-password">Forgot your password?</span>
              </div>
              <div className="col-12 text-center mt-3">
                <span className="text-other-login">Or Login with:</span>
              </div>
              <div className="col-12 social-login">
                <i className="fab fa-google-plus-g google"></i>
                <i className="fab fa-facebook-f facebook"></i>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
