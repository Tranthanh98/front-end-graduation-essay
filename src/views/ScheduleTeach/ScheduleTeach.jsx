import React from "react";
// react plugin for creating charts
// import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
// import Icon from "@material-ui/core/Icon";
// @material-ui/icons
// import Store from "@material-ui/icons/Store";
// import Warning from "@material-ui/icons/Warning";
// import DateRange from "@material-ui/icons/DateRange";
// import LocalOffer from "@material-ui/icons/LocalOffer";
// import Update from "@material-ui/icons/Update";
// import ArrowUpward from "@material-ui/icons/ArrowUpward";
// import AccessTime from "@material-ui/icons/AccessTime";
// import Accessibility from "@material-ui/icons/Accessibility";
// import BugReport from "@material-ui/icons/BugReport";
// import Code from "@material-ui/icons/Code";
// import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
// import Tasks from "components/Tasks/Tasks.js";
// import CustomTabs from "components/CustomTabs/CustomTabs.js";
// import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
// import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

// import { bugs, website, server } from "variables/general.js";

// import {
//   dailySalesChart
// } from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Typography } from "@material-ui/core";
import localStorage from '../../core/services/LocalStorage';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { withRouter } from "react-router-dom";
import BaseComponent from '../../core/BaseComponent/BaseComponent';
import * as httpClient from '../../core/HttpClient';
import { getDayOfYear } from "date-fns/esm";
import {EnumStatusClass} from '../../core/Enum';
import Table from "components/Table/Table.js";


class ScheduleTeach extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      scheduleTeach : [],
      nowDate : new Date(),
      errorMessage : "",
      dataAllClass : []
    }
  }
  async componentDidMount(){
    // await Promise.all([
      await this._onChangeDate(new Date)
      await this.getAllClassOfTeacher()
    // ])
  }
  getAllClassOfTeacher = async() => {
    let data = {
      teacherId : this.getUserId()
    }
    let response = await httpClient.sendPost('/get-all-class-of-teacher', data);
    if(this.validateApi(response)){
      this.setState({
        dataAllClass : response.data.Data
      })
    }
    console.log("gett all class", response);
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
  _handleViewDetailClass = (item) =>{
    this.goTo("/teacher/quan-ly-sinh-vien", {MaMon : item.maMon, tenMon : item.tenMon})
  }
  _renderTableRow = () =>{
    const {classes} = this.props;
    return this.state.dataAllClass.map((item, index)=>{
      return [
        <Typography>{item.maMon}</Typography>,
        <Typography>{item.tenMon}</Typography>,
        <Typography>{item.soBuoiDaDay}</Typography>,
        <Typography>{item.totalStudent}</Typography>,
        <Typography className={classes.hover} color="secondary" onClick={() => this._handleViewDetailClass(item)}>Xem chi tiết</Typography>
      ]
    })
  }
  joinClassRoom = async(item)=>{
    const {ma_mon, ten_mon, date} = item;
    if(item.status == 3){
      alert("Bạn không thể tham gia lớp học này vào ngày hôm nay !");
      return;
    }
    else if(item.status == 2){
      alert("Lớp học đang mở!");
      return;
    }
    else{
      let check = window.confirm("Bạn muốn mở lớp học này ?");
      if(check){
        const data = {
          idClass : item.id,
          status : EnumStatusClass.happenning,
          teacherId : this.getUserId(),
          date : this.formatDateTime(new Date, "YYYY-MM-DD")
        }
        this.updateStateLoader(true);
        let response = await httpClient.sendPost('/update-status-class', data);
        console.log("res update status : ", response);
        
        if(!this.validateApi(response)){
          this.setState({
            errorMessage : response.data.errorMessage
          });
          return;
        }
        this.setState({
          scheduleTeach : response.data.Data
        })
        let dataGetStudent = {
          MaMon : ma_mon,
          teacherId : this.getUserId(),
          date : this.formatDateTime(new Date(), "YYYY-MM-DD")
        }
        let responseStudent = await httpClient.sendPost('/get-student-rollcall', dataGetStudent);
        this.updateStateLoader(false);
          
        item.listStudent = responseStudent.data.Data
        localStorage.setItem('DAY_HOC', item);
        this.props.updateNowClass(item);
        console.log('item thanh test :', item);
        this.goTo('/teacher/diem-danh', {id : ma_mon, tenMon : ten_mon, idLopHoc : item.id});
      }
      else{
        return;
      }
    }
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
                      <div className={classes.card} onClick={() => this.joinClassRoom(item)}>
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
                            <Typography>Trạng thái: {EnumStatusClass[item.status]}</Typography>
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
          <GridItem xs={12} sm={12} md={12}>
            {this.state.dataAllClass != null ? (
              <Table
                tableHeaderColor="primary"
                tableHead={["Mã Môn", "Tên Môn", "Đã dạy (buổi)", "Sĩ số", ""]}
                tableData={this._renderTableRow()}
                />
            ) : (<Typography>Bạn không dạy lớp học nào!</Typography>)
            }
          </GridItem>
        </GridContainer>
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
  hover : {
    cursor : "pointer"
  },
  ...styles
}
export default withStyles(styleLocal)(ScheduleTeach);