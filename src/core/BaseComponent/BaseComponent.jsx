import React from 'react';
import { withRouter } from 'react-router-dom';
import {sensitiveStorage} from '../services/SensitiveStorage';
// import { css } from "@emotion/core";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
// import Modal from '@material-ui/core/Modal';
// import Fade from '@material-ui/core/Fade';
import CustomModal from '../../components/Modal/CustomModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class BaseComponent extends React.Component{
    constructor(props){
        super(props);
        let self = this;
        this.render =()=>{
            return(
            <>
                <Backdrop style={{zIndex: 9999,
                    color: '#fff',}} open={self.state.statusLoader}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <CustomModal
                    open={self.state.openModal}
                    onClose={self.handleCloseModal}
                    content={self.renderBodyModal()}
                />
                {
                    this.renderBody()
                }
            </>
            )
        }
    }
    renderBody(){
        throw("method render body must be override");
    }
    handleCloseModal = ()=>{
        this.setState({
            openModal : false
        })
    }
    hanldeOpenModal = ()=>{
        this.setState({
            openModal : true
        })
    }
    renderBodyModal() {
        return <div>testing</div>;
    }
    goTo = (url, param = "") =>{
        this.props.history.push({
            pathname : url,
            state : param
        });
    }
    login = (response) =>{
        sensitiveStorage.setUserName(response.data.Data.name);
        sensitiveStorage.setUserId(response.data.Data.id)
        sensitiveStorage.setToken(response.data.Data.token);
    }
    logout = () =>{
        console.log("logout");
        sensitiveStorage.removeUserName();
        sensitiveStorage.removeToken();
        sensitiveStorage.removeUserId();
        if(localStorage.getItem("LOGIN_TEACHER")){
            localStorage.removeItem("LOGIN_TEACHER")
        }
    }
    validateApi = (response) =>{
        if(response.data.isSuccess){
            return true;
        }
        return false;
    }
    updateStateLoader = (status) =>{
        this.setState({
            statusLoader : status
        })
    }
    getUserId(){
        return sensitiveStorage.getUserId();
    }
    formatDateTime =(value,formatType = "DD/MM/YYYY")=>{
        return moment(value).format(formatType);
    }
    getDate(){
        let nowDate = new Date();
        return `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`;
    }
}
export default (BaseComponent);