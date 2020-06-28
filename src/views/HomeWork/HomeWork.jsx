/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
class HomeWork extends React.Component{
  render(){
    return(
      <Typography>
        Tính năng này đang trong quá trình phát triển. Vui lòng quay lại sau!
      </Typography>
    )
  }
}
export default HomeWork;
