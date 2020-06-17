import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {withStyles} from '@material-ui/core';
import { withRouter, Redirect } from "react-router-dom";
import localStorage from '../core/services/LocalStorage';
import * as httpClient from '../core/HttpClient';
import BaseComponent from '../core/BaseComponent/BaseComponent'
import { sensitiveStorage } from 'core/services/SensitiveStorage';
import imageBackground from '../assets/img/hcmus-249896_960_720.jpg';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Roll Call System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = (theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${imageBackground})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});

class Login extends BaseComponent {
    constructor(props){
      super(props);
      this.state = {
        auth : false,
        userName : "",
        password : "",
        error : false,
        errorMessage : "",
        isRemember : false
      }
    }
  
    componentDidMount(){
      document.addEventListener("keypress", this.handleKeyEnter);
      if(sensitiveStorage.getToken() != null || localStorage.getItem("LOGIN_TEACHER")){
        this.props.history.push({pathname : "/teacher/lich-giang-day"});
      }
    }
    handleKeyEnter = (e) =>{
      if(this.state.userName != "" && this.state.password != "" && e.keyCode == 13){
        this._onClickLogin();
      }
      
    }
    _onClickLogin = async()=>{
      if(this.state.userName == "" || this.state.password == ""){
        // this.state.errorMessage = "Username và password không được để trống!";
        this.setState({
          error : true,
          errorMessage : "Username và password không được để trống!"
        })
        return;
      }
      let loginInfor = {
        userName : this.state.userName,
        password : this.state.password
      }
      this.updateStateLoader(true);
      let response = await httpClient.sendPost('/login-teacher', loginInfor);
      this.updateStateLoader(false);
      if(this.validateApi(response)){
        this.login(response);
        this.props.updateState(response.data.Data.id, response.data.Data.token)
        if(this.state.isRemember ===true){
          localStorage.setItem("LOGIN_TEACHER", response.data.Data.token);
        }
        else{
          localStorage.removeItem("LOGIN_TEACHER");
        }
        this.goTo('/teacher/lich-giang-day');
      }
      else{
        this.setState({
          error : true,
          errorMessage : response.data.errorMessage
        });
      }
      console.log('response', response);
    }
    _hanldeOnchangeUserName =(e)=>{
      this.setState({
        userName : e.target.value
      })
    }
    _hanldeOnChangePassword = (e)=>{
      this.setState({
        password : e.target.value
      })
    }
    _hanledRemember = (e) =>{
      this.setState({
        isRemember : !this.state.isRemember
      })
    }
    renderBody(){
        const theme = createMuiTheme();
        const {classes} = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/teacher/lich-giang-day' } }
        return (
            <Grid container component="main" className={classes.root}>
              <CssBaseline />
              <Grid item xs={false} sm={4} md={7} className={classes.image} />
              <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Đăng nhập giảng viên
                  </Typography>
                  {
                    this.state.error ? (
                    <Typography color="error">{this.state.errorMessage}</Typography>
                    ): null
                  }
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Tài khoản"
                      name="userName"
                      autoComplete="email"
                      value={this.state.userName}
                      onChange={(e)=> this._hanldeOnchangeUserName(e)}
                      autoFocus
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Mật khẩu"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={this.state.password}
                      onChange={(e)=> this._hanldeOnChangePassword(e)}
                    />
                    <FormControlLabel
                      control={<Checkbox value={this.state.isRemember} onChange={(e)=> this._hanledRemember(e)} color="primary" />}
                      label="Ghi nhớ"
                    />
                    <Button
                      onClick={this._onClickLogin}
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Đăng nhập
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link href="#" variant="body2">
                          Quên mật khẩu ?
                        </Link>
                      </Grid>
                    </Grid>
                    <Box mt={5}>
                      <Copyright />
                    </Box>
                  </form>
                </div>
              </Grid>
            </Grid>
          );
    }
}
export default withRouter(withStyles(useStyles)(Login));