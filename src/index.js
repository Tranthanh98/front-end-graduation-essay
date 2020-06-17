
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
// import RTL from "layouts/RTL.js";
import Login from './layouts/Login';
import "assets/css/material-dashboard-react.css?v=1.8.0";
import localStorage from './core/services/LocalStorage';
import httpClient from './core/HttpClient';

const hist = createBrowserHistory();

class Root extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      userId : "",
      token : "",
    }
  }
  updateState=(userId, token)=>{
    this.setState({
      userId,
      token
    })
  }

  render(){
    return(
      <Router history={hist}>
        <Switch>
          <Route path="/teacher" render={(props) => <Admin {...props} userId={this.state.userId} token={this.state.token}/>} />
          <Route path="/login" render={(props) => <Login {...props} updateState={this.updateState}/>} />
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
