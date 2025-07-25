import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import HomePage from "./HomePage/HomePage";
import CustomScrollbars from "../components/CustomScrollbars";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import Doctor from "../routes/Doctor";
import { path } from "../utils";

import Home from "../routes/Home";

import Login from "./Auth/Login";
import Header from "./Header/Header";
import System from "../routes/System";

import { CustomToastCloseButton } from "../components/CustomToast";
import ConfirmModal from "../components/ConfirmModal";
import DetailDoctor from "./Patient/Doctor/DetailDoctor";
import VerifyEmail from "./Patient/VerifyEmail";
import DetailSpecialty from "./Patient/Specialty/DetailSpecialty";
import DetailClinic from "./Patient/Clinic/DetailClinic";
import AllDoctors from "./Patient/Doctor/AllDoctors";
import AllSpecialty from "./Patient/Specialty/AllSpecialty";
import AllClinic from "./Patient/Clinic/AllClinic";
import SearchPage from "./HomePage/SearchPage";
import BookingHistory from "./Patient/BookingHistory";
class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <ConfirmModal />

            <span className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />
                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route path={path.SEARCH} component={SearchPage} />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route path={path.ALL_DOCTORS} component={AllDoctors} />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route path={path.ALL_SPECIALTY} component={AllSpecialty} />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route path={path.ALL_CLINIC} component={AllClinic} />
                  <Route
                    path={path.VERIFY_EMAIL_BOOKING}
                    component={VerifyEmail}
                  />
                  <Route
                    path={path.BOOKING_HISTORY}
                    component={BookingHistory}
                  />
                </Switch>
              </CustomScrollbars>
            </span>

            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
