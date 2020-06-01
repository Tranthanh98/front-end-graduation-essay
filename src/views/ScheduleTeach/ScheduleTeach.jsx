import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Typography } from "@material-ui/core";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withRouter } from "react-router-dom";
import BaseComponent from '../../core/BaseComponent/BaseComponent';
import * as httpClient from '../../core/HttpClient';
import { getDayOfYear } from "date-fns/esm";

class ScheduleTeach extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      scheduleTeach : [],
      nowDate : new Date(),
      errorMessage : ""
    }
  }
  async componentDidMount(){
    let a = this.formatDateTime(new Date);
    console.log('a test:', a);
    let data = {
      teacherId : this.getUserId(),
      date : this.formatDateTime(new Date, "YYYY-MM-DD")
    }
    this.updateStateLoader(true);
    let response = await httpClient.sendPost('/get-class-by-day', data);
    this.updateStateLoader(false);
    if(!this.validateApi(response)){
      const {errorMessage} = response.data;
      console.log("error get class :", errorMessage);
      
      this.setState({
        errorMessage
      })
      return;
    }
    this.setState({
      scheduleTeach :  response.data.Data
    })
    console.log('data :', response);
  }
  _onChangeDate = async(dateValue)=>{
    this.setState({
      nowDate : dateValue
    })
    let day = this.formatDateTime(dateValue, "YYYY-MM-DD");
    console.log('day api :', day);
    let data = {
      teacherId : this.getUserId(),
      date : day
    }
    this.updateStateLoader(true);
    let response = await httpClient.sendPost('/get-class-by-day', data);
    this.updateStateLoader(false);
    if(!this.validateApi(response)){
      const {errorMessage} = response.data;
      console.log("error get class :", errorMessage);
      
      this.setState({
        errorMessage
      })
      return;
    }
    console.log("response success : ", response)
    this.setState({
      scheduleTeach :  response.data.Data,
      errorMessage : ""
    })
    
    console.log('date ', dateValue);
  }
  joinClassRoom = (id, date)=>{
    if(new Date() < new Date(date)){
      alert("Bạn không thể tham gia lớp học này vào ngày hôm nay !");
      return;
    }
    console.log("value :", {id});
    this.goTo('/teacher/diem-danh', {id});
    // return (
    //   <Redirect to="/teacher/diem-danh"/>
    // )
    // this.props.history.push("/teacher/diem-danh/"+valueId)
  }
  renderBody(){
    const {classes} = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12}  ms={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Chọn ngày"
                  format="dd/MM/yyyy"
                  value={this.state.nowDate}
                  onChange={this._onChangeDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
            </MuiPickersUtilsProvider>
          </GridItem>
          {
            this.state.errorMessage !== "" ? (
              <Typography color="error">
                {this.state.errorMessage}
              </Typography>
            ) : (
                this.state.scheduleTeach.map((item, index) => {
                  let color = "warning";
                  if(index % 2 == 0){
                    color = "success"
                  }
                  else if(index % 3 ==0){
                    color = "danger"
                  }
                  return (
                    <GridItem key={index + item.id} xs={12} sm={6} md={3}>
                      <div className={classes.card} onClick={() => this.joinClassRoom(item.ma_mon, item.date)}>
                        <Card>
                          <CardHeader color={color} stats icon>
                            <CardIcon color={color}>
                              {/* <Icon>content_copy</Icon> */}
                              <Typography component="h2" variant={item.time.length > 9 ? "h6" : "h4"}>{item.time}</Typography>
                            </CardIcon>
                            
                          </CardHeader>
                          <div className={classes.paddingCardContent}>
                            <p className={classes.cardCategory}>Phòng: {item.phong_hoc}</p>
                            <strong style={{color:"black"}}>Sĩ số: {item.totalSV}</strong>
                            <h3 className={classes.cardTitle}>
                              {item.ten_mon}
                            </h3>
                          </div>
                          <CardFooter stats>
                            <div className={classes.stats}>
                              <Typography>
                                Click để tham gia lớp học
                              </Typography>
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    </GridItem>
                  )
                })
            )
          }
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                  options={dailySalesChart.options}
                  listener={dailySalesChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Daily Sales</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in today sales.
                </p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          {/* <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={emailsSubscriptionChart.data}
                  type="Bar"
                  options={emailsSubscriptionChart.options}
                  responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                  listener={emailsSubscriptionChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                <p className={classes.cardCategory}>Last Campaign Performance</p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                  options={completedTasksChart.options}
                  listener={completedTasksChart.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Completed Tasks</h4>
                <p className={classes.cardCategory}>Last Campaign Performance</p>
              </CardBody>
              <CardFooter chart>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem> */}
        </GridContainer>
        {/* <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <CustomTabs
              title="Tasks:"
              headerColor="primary"
              tabs={[
                {
                  tabName: "Bugs",
                  tabIcon: BugReport,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[0, 3]}
                      tasksIndexes={[0, 1, 2, 3]}
                      tasks={bugs}
                    />
                  )
                },
                {
                  tabName: "Website",
                  tabIcon: Code,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[0]}
                      tasksIndexes={[0, 1]}
                      tasks={website}
                    />
                  )
                },
                {
                  tabName: "Server",
                  tabIcon: Cloud,
                  tabContent: (
                    <Tasks
                      checkedIndexes={[1]}
                      tasksIndexes={[0, 1, 2]}
                      tasks={server}
                    />
                  )
                }
              ]}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"]
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer> */}
      </div>
    );
  }
}
const styleLocal = {
  card : {
    cursor : "pointer"
  },
  paddingCardContent : {
    padding : "5px"
  },
  ...styles
}
export default withStyles(styleLocal)(ScheduleTeach);