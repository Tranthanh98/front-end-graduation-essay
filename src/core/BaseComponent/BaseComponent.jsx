import React from "react";
import { sensitiveStorage } from "../services/SensitiveStorage";
// import { css } from "@emotion/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from "moment";
// import Modal from '@material-ui/core/Modal';
// import Fade from '@material-ui/core/Fade';
import CustomModal from "components/Modal/CustomModal";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";
import Configs from "app.config";
import { UserRole } from "core/Enum";
import AlertifyManager from "components/AlertifyManager/AlertifyManager";

class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.modal = {};
    let self = this;
    this._alertifyManager = React.createRef();
    this.render = () => {
      return (
        <>
          <Backdrop
            style={{ zIndex: 9999, color: "#fff" }}
            open={self.state.statusLoader ? self.state.statusLoader : false}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <CustomModal onClose={this.closeModal} {...self.state.modal} />
          <AlertifyManager innerRef={this._alertifyManager} />
          {this.renderBody()}
        </>
      );
    };
  }
  renderBody() {
    throw "method render body must be override";
  }
  closeModal = () => {
    this.setState({ modal: { open: false } });
  };
  openModal = (option) => {
    this.setState({ modal: { open: true, ...option } });
  };
  renderBodyModal() {
    return <div>testing</div>;
  }
  goTo = (url, param = "") => {
    this.props.history.push({
      pathname: url,
      state: param,
    });
  };
  login = (apiResult) => {
    const user = apiResult.data;
    if (user.role == UserRole.teacher) {
      sensitiveStorage.setUserId(user.id);
      sensitiveStorage.setUserRole(user.role);
      sensitiveStorage.setTeacherId(user.teacher.id);
      this.goTo("/teacher/lich-giang-day");
    } else if (user.role == UserRole.student) {
      sensitiveStorage.setUserId(user.id);
      sensitiveStorage.setUserRole(user.role);
      sensitiveStorage.setStudentId(user.student.id);
      this.goTo("/student/information");
    } else this._error("Bạn không thể đăng nhâp vào hệ thống.");
  };
  logout = () => {
    sensitiveStorage.removeUserId();
    sensitiveStorage.removeUserRole();
    this.goTo("/login");
  };
  validateApi = (response) => {
    if (response.data.isSuccess) {
      return true;
    }
    return false;
  };
  updateStateLoader = (status) => {
    this.setState({
      statusLoader: status,
    });
  };
  success(content) {
    return this._alertifyManager.current.addNewAlertify(content, "success");
  }
  warning(content) {
    return this._alertifyManager.current.addNewAlertify(content, "warning");
  }
  error(content) {
    return this._alertifyManager.current.addNewAlertify(content, "error");
  }
  getUserId() {
    return sensitiveStorage.getUserId();
  }
  formatDateTime = (value, formatType = "DD/MM/YYYY") => {
    return moment(value).format(formatType);
  };
  getDate() {
    let nowDate = new Date();
    return `${nowDate.getFullYear()}-${nowDate.getMonth() +
      1}-${nowDate.getDate()}`;
  }
  _sendAjax = (_method, params) => {
    if (!params.url) {
      throw "expected `url` parameter";
    }
    if (typeof params.blockUI == "undefined") {
      params.blockUI = false;
    }
    // const baseUrl = window.applicationBaseUrl ? window.applicationBaseUrl : "";
    const serviceHost = Configs.serviceHost;
    let fullUrl =
      params.url.indexOf("http") == 0 ? params.url : serviceHost + params.url;
    $.ajax({
      url: fullUrl,
      data: params.data,
      method: _method,
      dataType: params.noDataType ? undefined : "json",
      headers: {
        ...params.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
      contentType: params.noContentType
        ? undefined
        : "application/json; charset=utf-8",
      success: (result, status, xhr) => {
        let xhrParse = JSON.parse(xhr.getResponseHeader("X-Responded-JSON"));
        if (xhrParse && xhrParse.status == 401) {
          if (typeof params.error === "function") {
            params.error(xhr, status, "Unauthorized Access");
          }
        }
        if (result.isSuccess === true) {
          typeof params.success === "function" &&
            params.success(result, status, xhr);
        } else if (result.isSuccess === false) {
          typeof params.unsuccess === "function" &&
            params.unsuccess(result, status, xhr);
        }
      },
      error: (jqXHR, textStatus, errorThrown) => {
        typeof params.error === "function" &&
          params.error(jqXHR, textStatus, errorThrown);
      },
    });
  };

  JSONStringify(obj) {
    return JSON.stringify(obj);
  }

  ajaxPost(options) {
    options.data = this.JSONStringify(options.data);
    this._sendAjax("POST", options);
  }

  ajaxGet(options) {
    this._sendAjax("GET", options);
  }
}
export default BaseComponent;
