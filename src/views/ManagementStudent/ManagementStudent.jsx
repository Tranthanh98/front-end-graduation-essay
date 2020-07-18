import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import AutoComplete from "components/AutoComplete/AutoComplete";
import {Typography, withStyles, Button} from '@material-ui/core';
import SearchEngine from '../../components/SeachEngine/SearchEngine';
import BaseComponent from '../../core/BaseComponent/BaseComponent';
import * as httpClient from '../../core/HttpClient';
import Checkbox from '@material-ui/core/Checkbox';
import lodash from 'lodash';
import ModalDetailStudent from './ModalDetailStudent';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

class ManagementStudent extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      MaMon : "",
      tabledData : [],
      isShowSearchClass : false,
      errorMessage : "",
      isShowTable : false,
      tenMon : "",
      informationStudent : null
    }
  }
  async componentDidMount(){
    if(this.props.location.state != null){
      const {MaMon, tenMon} = this.props.location.state
      let data = {
        ten_mon : tenMon,
        ma_mon :MaMon
      }
      await this.getDataStudentOfClass(data);
      
    }
  }
  getDataStudentOfClass = async(item) =>{
    this.setState({
      tenMon : item.ten_mon,
      MaMon : item.ma_mon
    })
    let data = {
      MaMon : item.ma_mon,
      teacherId : this.getUserId(),
      date : this.formatDateTime(new Date, "YYYY-MM-DD")
    }
    this.updateStateLoader(true);
    let response = await httpClient.sendPost('/get-all-student-subject', data);
    this.updateStateLoader(false);
    if(!this.validateApi(response)){
      const {errorMessage} = response.data;
      const isShowTable = response.data.isSuccess;
      console.log('errorMessage :', errorMessage);
      this.setState({
        errorMessage,
        isShowTable
      });
    }
    else{
      this.setState({
        tabledData : response.data.Data,
        isShowTable : true
      })
    }
    
  }
  viewDetail = async(item) =>{
    let data = {
      mssv : item.mssv,
      MaMon : this.state.MaMon,
      teacherId : this.getUserId()
    }
    let response = await httpClient.sendPost("/get-information-student", data);
    this.setState({
      informationStudent : response.data.Data
    })
    this.hanldeOpenModal();
  }
  renderBodyModal(){
    return (
      <ModalDetailStudent deleteImage={this._deleteImage} informationStudent={this.state.informationStudent}/>
    )
  }
  _deleteImage = (image) => {
    let cloneData = {...this.state.informationStudent};
    let index = cloneData.imageTrained.indexOf(image);
    console.log("index of image:", index);
    cloneData.imageTrained.splice(index, 1);
    this.setState({informationStudent: cloneData});
  }
  _renderTableRow = () => {
    return this.state.tabledData.map((item,index)=>{
      return [
        <Typography>{item.mssv}</Typography>,
        <Typography>{item.name_student}</Typography>,
        <Typography>{item.tenKhoa}</Typography>,
        <Typography>
          {item.totalFaceTrained}
        </Typography>,
        <Typography>
          <Button onClick={()=>this.viewDetail(item)} color="secondary">
            Xem chi tiết
          </Button>
        </Typography>
      ]
    })
  }
  renderBody(){
    const {classes} = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                Môn học : {this.state.tenMon}
              </h4>
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={3}>
          <Typography>
            Chọn lớp học của bạn : 
          </Typography>
        </GridItem>
        <GridItem xs={12} sm={3}>
          <SearchEngine updateDataClass={this.getDataStudentOfClass}/>
        </GridItem>
        {
          this.state.isShowTable === true ? (
            <>
              <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>Danh sách sinh viên của lớp học</h4>
                    </CardHeader>
                    <CardBody>
                      <Table
                        tableHeaderColor="primary"
                        tableHead={["MSSV", "Tên SV", "Khoa", "Số ảnh training",""]}
                        tableData={this._renderTableRow()}
                      />
                    </CardBody>
                  </Card>
              </GridItem>
            </>
          ) : (
            <Typography color="error">
              {this.state.errorMessage}
            </Typography>
          )
        }
      </GridContainer>
    );
  }
}
export default withStyles(styles)(ManagementStudent);