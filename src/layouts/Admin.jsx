import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { withStyles } from "@material-ui/core";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import { teacherRoutes } from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo-khtn.png";
import localStorage from "../core/services/LocalStorage";
import { sensitiveStorage } from "../core/services/SensitiveStorage";
import * as httpClient from "../core/HttpClient";
import BaseComponent from "../core/BaseComponent/BaseComponent";
import { EnumStatusClass } from "../core/Enum";

let ps;
class Admin extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: bgImage,
      color: "blue",
      fixedClasses: "dropdown",
      mobileOpen: false,
      nowClass: null,
    };
    this.mainPanel = React.createRef();
    this.scheduleRefs = React.createRef();
  }
  switchRoutes = () => {
    return (
      <Switch>
        {teacherRoutes.map((prop, key) => {
          let Component = prop.component;
          const userId = sensitiveStorage.getUserId();
          const userRole = sensitiveStorage.getUserRole();
          if (userId && userRole == 1) {
            return (
              <Route
                path={prop.layout + prop.path}
                render={(props) => (
                  <Component
                    {...props}
                    ref={
                      prop.path == "/lich-giang-day" ? this.scheduleRefs : null
                    }
                    nowClass={this.state.nowClass}
                    updateNowClass={this.updateNowClass}
                    color={this.state.color}
                  />
                )}
                key={key}
              />
            );
          } else {
            return <Redirect to={{ pathname: "/login" }} />;
          }
        })}
      </Switch>
    );
  };

  handleImageClick = (image) => {
    this.setState({
      image: image,
    });
  };
  handleColorClick = (color) => {
    this.setState({
      color: color,
    });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({
        fixedClasses: "dropdown show",
      });
    } else {
      this.setState({
        fixedClasses: "dropdown",
      });
    }
  };
  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({
        mobileOpen: false,
      });
    }
  };
  async componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);
    let data = {
      date: this.getDate(),
    };
    let dataRes = await httpClient.sendPost(
      "/close-class-have-not-closed",
      data
    );
    if (this.validateApi(dataRes)) {
      if (localStorage.getItem("DAY_HOC") != null) {
        let date = new Date(localStorage.getItem("DAY_HOC").date);
        let nowDate = new Date(this.getDate());
        console.log("date :" + date + " now date :" + nowDate);
        if (date < nowDate) {
          localStorage.removeItem("DAY_HOC");
          // this.updateNowClass(null);
        }
      }
    }
    let dataGetNowClass = {
      teacherId: this.getUserId(),
    };
    let nowClassOpen = await httpClient.sendPost(
      "get-now-class-opening",
      dataGetNowClass
    );
    if (this.validateApi(nowClassOpen)) {
      let item = nowClassOpen.data.Data.nowClass;
      item.listStudent = nowClassOpen.data.Data.listStudent;
      localStorage.setItem("DAY_HOC", item);
    } else {
      localStorage.removeItem("DAY_HOC");
    }
    let self = this;
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", self.resizeFunction);
    };
  }
  updateNowClass = async (value) => {
    if (value == null) {
      let data = {
        idClass: localStorage.getItem("DAY_HOC").id,
        status: EnumStatusClass.closed,
        teacherId: this.getUserId(),
        date: this.formatDateTime(
          new Date(localStorage.getItem("DAY_HOC").date),
          "YYYY-MM-DD"
        ),
      };
      let response = await httpClient.sendPost("/update-status-class", data);
      if (this.validateApi(response)) {
        localStorage.removeItem("DAY_HOC");
      }
    }
    console.log("ref schedule :", this.scheduleRefs);
    if (this.scheduleRefs.current != null) {
      this.scheduleRefs.current._onChangeDate(new Date());
    }

    this.setState({
      nowClass: value,
    });
  };
  renderBody() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={teacherRoutes}
          logoText={"Roll Call System"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          // {...rest}
        />
        <div className={classes.mainPanel} ref={this.mainPanel}>
          <Navbar
            routes={teacherRoutes}
            nowClass={this.state.nowClass}
            updateNowClass={this.updateNowClass}
            handleDrawerToggle={this.handleDrawerToggle}
          />
          <div className={classes.content}>
            <div className={classes.container}>{this.switchRoutes()}</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Admin);
