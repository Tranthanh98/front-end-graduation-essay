
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
// import RTL from "layouts/RTL.js";
import Login from './layouts/Login';
import "assets/css/material-dashboard-react.css?v=1.8.0";
import Student from "layouts/Student";
import Admin from "layouts/Admin";
import BaseComponent from "core/BaseComponent/BaseComponent";

const hist = createBrowserHistory();

class Root extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  renderBody() {
    return (
      <Router history={hist}>
        <Switch>
          {/* <Route path="/" render={(props) => <CheckLogin {...props} />} /> */}
          <Route path="/teacher" render={(props) => <Admin {...props} />} />
          <Route path="/student" render={(props) => <Student {...props} />} />
          <Route path="/login" render={(props) => <Login {...props} />} />
          <Redirect to={{ pathname: "/login" }} />
        </Switch>
      </Router>
    )
  }
}
export default Root;

ReactDOM.render(
  <Root />,
  document.getElementById("root")
);
