import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import {
  getAllSpecialty,
  getAllClinic,
  getAllDoctors,
} from "../../services/userService";
import { withRouter } from "react-router";
import "./SearchPage.scss";
import ProfileDoctor from "../Patient/Doctor/ProfileDoctor";
class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      filterType: "all",
      dataSpecialty: [],
      dataClinics: [],
      dataDoctors: [],
      showDropdown: false,
    };
    this.dropdownRef = React.createRef();
  }

  async componentDidMount() {
    document.addEventListener("click", this.handleClickOutside);

    const [specialtyRes, clinicRes, doctorRes] = await Promise.all([
      getAllSpecialty(),
      getAllClinic(),
      getAllDoctors(),
    ]);

    if (
      specialtyRes?.errCode === 0 &&
      clinicRes?.errCode === 0 &&
      doctorRes?.errCode === 0
    ) {
      this.setState({
        dataSpecialty: specialtyRes.data || [],
        dataClinics: clinicRes.data || [],
        dataDoctors: doctorRes.data || [],
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (e) => {
    if (
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(e.target)
    ) {
      this.setState({ showDropdown: false });
    }
  };

  handleInputChange = (event) => {
    this.setState({ keyword: event.target.value });
  };

  handleSelectFilter = (value) => {
    this.setState({ filterType: value, showDropdown: false });
  };
  handleViewDetailSpecialty = (item) => {
    this.props.history.push(`/detail-specialty/${item.id}`);
  };
  handleViewDetailClinic = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };
  handleViewDetailDoctor = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  removeVietnameseTones = (str = "") => {
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  filterData = (data, type) => {
    const { keyword, filterType } = this.state;
    const cleanKeyword = this.removeVietnameseTones(keyword);

    if (!keyword) {
      return filterType === "all" || filterType === type ? data : [];
    }

    if (filterType !== "all" && filterType !== type) {
      return [];
    }

    return data.filter((item) => {
      const name =
        type === "doctor"
          ? this.removeVietnameseTones(
              `${item.firstName || ""} ${item.lastName || ""}`
            )
          : this.removeVietnameseTones(item.name || "");
      return name.includes(cleanKeyword);
    });
  };

  render() {
    const {
      keyword,
      filterType,
      dataSpecialty,
      dataClinics,
      dataDoctors,
      showDropdown,
    } = this.state;

    const filterOptions = [
      { value: "all", label: "Tất cả" },
      { value: "specialty", label: "Chuyên khoa" },
      { value: "clinic", label: "Cơ sở y tế" },
      { value: "doctor", label: "Bác sĩ" },
    ];

    const filteredSpecialties = this.filterData(dataSpecialty, "specialty");
    const filteredClinics = this.filterData(dataClinics, "clinic");
    const filteredDoctors = this.filterData(dataDoctors, "doctor");

    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="search-list-container">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={this.handleInputChange}
            />
            <div
              className="dropdown-filter"
              ref={this.dropdownRef}
              onClick={(e) => {
                e.stopPropagation();
                this.setState((prev) => ({ showDropdown: !prev.showDropdown }));
              }}
            >
              <span className="selected">
                {filterOptions.find((f) => f.value === filterType)?.label}
              </span>
              <span className="dropdown-icon">&#9662;</span>
              {showDropdown && (
                <div className="options">
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className="option"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleSelectFilter(option.value);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredSpecialties.length > 0 && (
            <div className="search-section">
              <div className="section-title">Chuyên khoa</div>
              <ul className="list-items">
                {filteredSpecialties.map((item, index) => (
                  <li
                    key={index}
                    className="list-item"
                    onClick={() => this.handleViewDetailSpecialty(item)}
                  >
                    <img src={item.image} alt="" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {filteredClinics.length > 0 && (
            <div className="search-section">
              <div className="section-title">Cơ sở y tế</div>
              <ul className="list-items">
                {filteredClinics.map((item, index) => (
                  <li
                    key={index}
                    className="list-item"
                    onClick={() => this.handleViewDetailClinic(item)}
                  >
                    <img src={item.image} alt="" />
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {filteredDoctors.length > 0 && (
            <div className="search-section">
              <div className="section-title">Bác sĩ</div>
              <ul className="list-items">
                {filteredDoctors.map((item, index) => (
                  <li
                    key={index}
                    className="list-item"
                    onClick={() => this.handleViewDetailDoctor(item)}
                  >
                    <ProfileDoctor
                      doctorId={item.id}
                      isShowDescriptionDoctor={false}
                      isShowLinkDetail={false}
                      isShowPrice={false}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default withRouter(connect(null, null)(SearchPage));
