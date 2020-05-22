/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
// import RTL from "layouts/RTL.js";
import Login from './layouts/Login';
import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();

class Root extends React.Component{
  // componentDidMount(){
  //   window.open("http://localhost:4200/teacher/lich-giang-day", "_self");
  // }
  render(){
    return(
      <Router history={hist}>
        <Switch>
          <Route path="/teacher" component={Admin} />
          <Route path="/login" component={Login} />
          <Redirect to={{pathname : '/teacher/lich-giang-day'}}/>
          {/* <Redirect from="/" to="/login" /> */}
        </Switch>
      </Router>
    )
  }
}
export default Root;

ReactDOM.render(
  <Root/>,
  document.getElementById("root")
);
