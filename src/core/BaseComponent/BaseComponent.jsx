import React from 'react';
import { withRouter } from 'react-router-dom';
import {sensitiveStorage} from '../services/SensitiveStorage';
// import { css } from "@emotion/core";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


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
    goTo = (url, param = "") =>{
        this.props.history.push(`${url}/${param}`);
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
}
export default (BaseComponent);