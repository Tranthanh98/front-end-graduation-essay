import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/logo-khtn.png";
import localStorage from '../core/services/LocalStorage';
import {sensitiveStorage} from '../core/services/SensitiveStorage';
import * as httpClient from '../core/HttpClient';
import BaseComponent from '../core/BaseComponent/BaseComponent';
import {EnumStatusClass} from '../core/Enum';

let ps;
class Admin extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      image : bgImage,
      color : "blue",
      fixedClasses : "dropdown",
      mobileOpen : false,
      nowClass : null
    }
    this.mainPanel = React.createRef();
    // this.scheduleRefs = React.createRef();
  }
  switchRoutes =() => {
    return(
      <Switch>
        {routes.map((prop, key) => {
          const authSensitive = sensitiveStorage.getToken();
          const authLocalStorage = localStorage.getItem("LOGIN_TEACHER");
          const {token, userId} = this.props;
          // console.log('auth :', auth);
          // console.log('token :', token);
          let Component = prop.component;

          if (authSensitive != null || authLocalStorage != null) {
            return (
              <Route
                path={prop.layout + prop.path}
                render={(props) => <Component {...props} 
                                    nowClass={this.state.nowClass} 
                                    updateNowClass={this.updateNowClass}
                                    color={this.state.color}/>}
                key={key}
              />
            );
          }
          else{
            return (<Redirect to={{pathname :"/login"}} />)
          }
        })}
        
      </Switch>
    )
  };


  handleImageClick = image => {
    this.setState({
      image : image
    })
  };
  handleColorClick = color => {
    this.setState({
      color: color
    })
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({
        fixedClasses : "dropdown show"
      })
    } else {
      this.setState({
        fixedClasses : "dropdown"
      })
    }
  };
  handleDrawerToggle = () => {
    this.setState({
      mobileOpen : !this.state.mobileOpen
    })
  };
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({
        mobileOpen : false
      })
    }
  };
  async componentDidMount(){
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", this.resizeFunction);

    if(localStorage.getItem("DAY_HOC")){
      let date = new Date(localStorage.getItem("DAY_HOC").date);
      let nowDate = new Date(this.getDate())
      if(date < nowDate){
        
        let data = {
          idClass : localStorage.getItem("DAY_HOC").id,
          status : EnumStatusClass.closed,
          teacherId : this.getUserId(),
          date : this.formatDateTime(new Date(localStorage.getItem("DAY_HOC").date), "YYYY-MM-DD")
        }
        let response = await httpClient.sendPost('/update-status-class', data);
        if(this.validateApi(response)){
          localStorage.removeItem("DAY_HOC");
        }
        
      }
    }

    let self = this;
    return function cleanup() {
      
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", self.resizeFunction);
    };
  }
  updateNowClass = async(value) =>{
    if(value == null){
      let data = {
        idClass : localStorage.getItem("DAY_HOC").id,
        status : EnumStatusClass.closed,
        teacherId : this.getUserId(),
        date : this.formatDateTime(new Date(localStorage.getItem("DAY_HOC").date), "YYYY-MM-DD")
      }
      let response = await httpClient.sendPost('/update-status-class', data);
      if(this.validateApi(response)){
        localStorage.removeItem("DAY_HOC");
      }
    }
    this.setState({
      nowClass : value
    })
  }
  renderBody(){
    const {classes }= this.props;
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"Roll Call System"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.mobileOpen}
          color={this.state.color}
          // {...rest}
        />
        <div className={classes.mainPanel} ref={this.mainPanel}>
          <Navbar
            routes={routes}
            nowClass={this.state.nowClass}
            updateNowClass={this.updateNowClass}
            handleDrawerToggle={this.handleDrawerToggle}
          />

            <div className={classes.content}>
              <div className={classes.container}>{this.switchRoutes()}</div>
            </div>
          <Footer />
          <FixedPlugin
            handleImageClick={this.handleImageClick}
            handleColorClick={this.handleColorClick}
            bgColor={this.state.color}
            bgImage={this.state.image}
            handleFixedClick={this.handleFixedClick}
            fixedClasses={this.state.fixedClasses}
          />
        </div>
      </div>
    );
  }
  
}
export default withStyles(styles)(Admin);
