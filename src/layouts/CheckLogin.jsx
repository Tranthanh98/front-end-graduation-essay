import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { withStyles } from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import Configs from "../app.config";

class CheckLogin extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _checkLogin = () => {
    this.ajaxGet({
      url: "/api/account/checkLogin",
      success: (apiResult) => {
        sensitiveStorage.setUserId(apiResult.data.userId);
        sensitiveStorage.setUserRole(apiResult.data.role);
        if (apiResult.data.role == Configs.TEACHER_ROLE) {
          this.goTo("/teacher/lich-giang-day");
        } else if (apiResult.data.role == Configs.STUDENT_ROLE) {
          this.goTo("/student/dashboard");
        } else this.goTo("/login");
      },
      unsuccess: (apiResult) => {
        sensitiveStorage.removeUserId();
        sensitiveStorage.removeUserRole();
        this.goTo("/login");
      },
    });
  };
  componentDidMount() {
    this._checkLogin();
  }
  renderBody() {
    return "";
  }
}

export default withStyles({})(CheckLogin);
