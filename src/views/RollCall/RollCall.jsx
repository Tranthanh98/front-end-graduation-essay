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
import WebcamRollCall from '../../components/Webcam/Webcam';

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

class RollCall extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      maLop : "",
      tabledData : [],
      isShowSearchClass : false,
      errorMessage : "",
      isShowTable : false,
      fileImage : null,
      tenMon : ""
    }
  }
  async componentDidMount(){
    console.log('props roll call :', this.props.color)
    if(this.props.location.state != null){
      console.log('param :',this.props.location.state.id);
      let data = {
        MaMon : this.props.location.state.id,
        teacherId : this.getUserId(),
        date : this.formatDateTime(new Date(), "YYYY-MM-DD")
      }
      console.log('data send get student :', data);
      this.updateStateLoader(true);
      let response = await httpClient.sendPost('/get-student-by-class', data);
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
      console.log('response student :', response);
      // this.setState({
      //   tabledData : response.data.Data,
      //   isShowTable : true
      // })
    }
    else{
      this.setState({
        isShowSearchClass : true
      })
    }
  }
  getDataStudentOfClass = async(item) =>{
    this.setState({
      tenMon : item.ten_mon
    })
    let data = {
      MaMon : item.ma_mon,
      teacherId : this.getUserId(),
      date : this.formatDateTime(new Date, "YYYY-MM-DD")
    }
    this.updateStateLoader(true);
    let response = await httpClient.sendPost('/get-student-by-class', data);
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
  _trainingFace = async(item) =>{
    let data = {
      Mssv : item.Mssv,
      stringImage : this.state.fileImage
    }
    this.updateStateLoader(true);
    let response = await httpClient.sendPost('/training-face', data);
    this.updateStateLoader(false);
    if(!this.validateApi(response)){
      this.setState({
        errorMessage : response.data.errorMessage
      })
    }
    console.log('training face res :', response);
  }
  _renderTableRow = () => {
    return this.state.tabledData.map((item,index)=>{
      return [
        <Typography>{item.Mssv}</Typography>,
        <Typography>{item.NameStudent}</Typography>,
        <Typography>
          <Checkbox
            color="primary"/>
        </Typography>,
        <Typography>
          6
        </Typography>,
        <Typography>
          <Button disabled={this.state.fileImage !== null ? false : true} onClick={()=>this._trainingFace(item)} color="secondary">
            Training
          </Button>
        </Typography>
      ]
    })
  }
  loadImage = async(image) => {
    this.setState({
      fileImage : image
    })
    let listMssv = this.state.tabledData.map(item =>{
      return item.Mssv
    });
    let data = {
      stringImage : image,
      listMssv : listMssv,
      Mssv : null
    }
    let response = await httpClient.sendPost('roll-call-student', data);
    console.log('face recognition : ', response);
    await this.setState({
      fileImage : response.data.Data.imageAfterRecognition
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
                Môn học : {this.props.location.state ? this.props.location.state.tenMon : this.state.tenMon}
              </h4>
              <p className={classes.cardCategoryWhite}>
                Here is a subtitle for this table
              </p>
            </CardHeader>
          </Card>
        </GridItem>
        {
          this.state.isShowSearchClass == true ? (
            <>
              <GridItem xs={12} sm={3}>
                <Typography>
                  Chọn lớp học của bạn : 
                </Typography>
              </GridItem>
              <GridItem xs={12} sm={3}>
                <SearchEngine updateDataClass={this.getDataStudentOfClass}/>
              </GridItem>
            </>
          ): null
        }
        {
          this.state.isShowTable === true ? (
            <>
              <GridItem xs={12}>
                <WebcamRollCall fileImage={this.state.fileImage} updateImage={this.loadImage} color={this.props.color}/>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 className={classes.cardTitleWhite}>Simple Table</h4>
                      <p className={classes.cardCategoryWhite}>
                        Here is a subtitle for this table
                      </p>
                    </CardHeader>
                    <CardBody>
                      <Table
                        tableHeaderColor="primary"
                        tableHead={["MSSV", "Tên SV", "Điểm danh", "Số ảnh training",""]}
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
export default withStyles(styles)(RollCall);