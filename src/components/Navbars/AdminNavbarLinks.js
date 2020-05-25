import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import { withRouter, Redirect } from "react-router-dom";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import BaseComponent from '../../core/BaseComponent/BaseComponent';
import * as httpClient from '../../core/HttpClient';
import { sensitiveStorage } from "../../core/services/SensitiveStorage";

const useStyles = makeStyles(styles);

class AdminNavbarLinks extends BaseComponent {
  //const classes = useStyles();
  constructor(props){
    super(props);
    this.state = {
      openNotification : null,
      openProfile : null,

    }
  }
  // const [openNotification, setOpenNotification] = React.useState(null);
  // const [openProfile, setOpenProfile] = React.useState(null);
  handleClickNotification = event => {
    if (this.state.openNotification && this.state.openNotification.contains(event.target)) {
      this.setOpenNotification(null);
    } else {
      this.setOpenNotification(event.currentTarget);
    }
  };
  setOpenNotification = value => {
    this.setState({
      openNotification : value
    })
  }
  setOpenProfile = value =>{
    this.setState({
      openProfile : value
    })
  }
  handleCloseNotification = () => {
    this.setOpenNotification(null);
  };
  handleClickProfile = event => {
    if (this.state.openProfile && this.state.openProfile.contains(event.target)) {
      this.setOpenProfile(null);
    } else {
      this.setOpenProfile(event.currentTarget);
    }
  };
  handleCloseProfile = () => {
    this.setOpenProfile(null);
  };
  _hanldeLogout = () => {
    console.log("test logout")
    this.logout();
  }
  renderBody(){
    const {classes} = this.props;
    return (
      <div>
        <div className={classes.searchWrapper}>
          <CustomInput
            formControlProps={{
              className: classes.margin + " " + classes.search
            }}
            inputProps={{
              placeholder: "Search",
              inputProps: {
                "aria-label": "Search"
              }
            }}
          />
          <Button color="white" aria-label="edit" justIcon round>
            <Search />
          </Button>
        </div>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-label="Dashboard"
          className={classes.buttonLink}
        >
          <Dashboard className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Dashboard</p>
          </Hidden>
        </Button>
        <div className={classes.manager}>
          <Button
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={this.state.openNotification ? "notification-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleClickNotification}
            className={classes.buttonLink}
          >
            <Notifications className={classes.icons} />
            <span className={classes.notifications}>5</span>
            <Hidden mdUp implementation="css">
              <p onClick={this.handleCloseNotification} className={classes.linkText}>
                Notification
              </p>
            </Hidden>
          </Button>
          <Poppers
            open={Boolean(this.state.openNotification)}
            anchorEl={this.state.openNotification}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !this.state.openNotification }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="notification-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseNotification}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleCloseNotification}
                        className={classes.dropdownItem}
                      >
                        Mike John responded to your email
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleCloseNotification}
                        className={classes.dropdownItem}
                      >
                        You have 5 new tasks
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleCloseNotification}
                        className={classes.dropdownItem}
                      >
                        You{"'"}re now friend with Andrew
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleCloseNotification}
                        className={classes.dropdownItem}
                      >
                        Another Notification
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleCloseNotification}
                        className={classes.dropdownItem}
                      >
                        Another One
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
        <div className={classes.manager}>
          <Button
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={this.state.openProfile ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleClickProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
          </Button>
          <Poppers
            open={Boolean(this.state.openProfile)}
            anchorEl={this.state.openProfile}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !this.state.openProfile }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleCloseProfile}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={this.handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Cài đặt
                      </MenuItem>
                      <Divider light />
                      <MenuItem
                        onClick={ async() => {
                          console.log("test thành");
                          this.updateStateLoader(true);
                          let response = await httpClient.sendPost("/logout-teacher", {token : sensitiveStorage.getToken()});
                          this.updateStateLoader(false);
                          if(this.validateApi(response)){
                            this.logout()
                            this.goTo("/login")
                          }
                          
                        }}
                        className={classes.dropdownItem}
                      >
                        Đăng xuất
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
      </div>
    );
  }
}
export default withRouter(withStyles(styles)(AdminNavbarLinks));