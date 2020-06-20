import React from "react";
// @material-ui/core components
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import BaseComponent from "core/BaseComponent/BaseComponent";

import * as httpClient from '../../core/HttpClient';
import lodash, { property } from 'lodash';
import { Typography } from "@material-ui/core";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class UserProfile extends BaseComponent {
  constructor(props){
    super(props);
    this.state = {
      teacherInformation : {
        address : "",
        birthday : "", 
        email : "", 
        khoa : "", 
        name : "", 
        numberPhone: "",
        userName : "", 
        password : ""
      },
      isDisable : true,
      isDisablePass : true
    }
    this.cloneTeacherInformation = {};
  }
  async componentDidMount(){
    let data = {
      teacherId : this.getUserId()
    }
    let res = await httpClient.sendPost('get-inf-teacher', data);
    this.setState({
      teacherInformation : res.data.Data
    }, () => {
      this.cloneTeacherInformation = lodash.cloneDeep(this.state.teacherInformation);
    })
  }
  _handleOnchangeName = (e)=>{
    console.log(e.target.value);
    this.cloneTeacherInformation.name = e.target.value;
    this.setState({
      teacherInformation : this.cloneTeacherInformation  
    })
  }
  _handleOnchangeUser = (e) =>{
    this.cloneTeacherInformation.userName = e.target.value;
    this.setState({
      teacherInformation : this.cloneTeacherInformation  
    })
  }
  _handleInPut = (e, property) =>{
    this.cloneTeacherInformation[property] = e.target.value;
    this.setState({
      teacherInformation : this.cloneTeacherInformation  
    })
  }
  renderBody(){
    const {classes} = this.props;
    let {teacherInformation} = this.state;
    let {address, birthday, email, khoa, name, numberPhone, userName, password} = teacherInformation;
      return (
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Thông tin giảng viên</h4>
                  <p className={classes.cardCategoryWhite}>Complete your profile</p>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="Tên giảng viên"
                        id="company-disabled"
                        
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: this.state.isDisable,
                          value:name,
                          onChange : (e)=>{this._handleInPut(e, "name")}
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="Địa chỉ email"
                        id="email-address"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: this.state.isDisable,
                          value : email,
                          onChange : (e)=>{this._handleInPut(e, "email")}
                        }}
                      />
                    </GridItem>
                    
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                          labelText="Username"
                          id="username"
                          value={userName}
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true,
                            value : userName,
                          }}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <CustomInput
                        labelText="Địa chỉ"
                        id="last-name"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: this.state.isDisable,
                          value : address,
                          onChange : (e) => this._handleInPut(e, "address")
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Năm sinh"
                        id="city"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: this.state.isDisable,
                          value : birthday,
                          onChange : (e) => this._handleInPut(e, "birthday")
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Số điện thoại"
                        id="country"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: this.state.isDisable,
                          value : numberPhone,
                          onChange : (e) => this._handleInPut(e, "numberPhone")
                        }}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                      <CustomInput
                        labelText="Khoa"
                        id="postal-code"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled: true,
                          value : khoa
                        }}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                      <Button onClick={()=> {this.setState({isDisable : !this.state.isDisable})}} color="primary">
                        {
                          this.state.isDisable ? "Chỉnh sửa" : "Lưu"
                        }
                      </Button>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card profile>
                <CardAvatar profile>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={avatar} alt="..." />
                  </a>
                </CardAvatar>
                <CardBody profile>
                  <Typography display="inline" align="center">Thay đổi password</Typography>
                  <CustomInput
                        labelText="Nhập mật khẩu cũ"
                        id="about-me"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          disabled : this.state.isDisablePass
                        }}
                      />
                    <CustomInput
                      labelText="Nhập mật khẩu mới"
                      id="about-me"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled : this.state.isDisablePass
                      }}
                    />
                    <CustomInput
                      labelText="Nhập lại mật khẩu mới"
                      id="about-me"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled : this.state.isDisablePass
                      }}
                    />
                  <Button onClick={()=>{this.setState({isDisablePass : !this.state.isDisablePass})}} color="primary" round>
                    Thay đổi
                  </Button>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      );
  } 
}
export default withStyles(styles)(UserProfile);
