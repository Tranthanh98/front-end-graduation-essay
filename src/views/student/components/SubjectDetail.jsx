import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";

class SubjectDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.studentId = sensitiveStorage.getStudentId();
  }
  renderBody() {
    const { classes } = this.props;
    console.log("subject detail");
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" className={classes.title}>
            Tên môn học
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.webcam}>
          sadjghkj
        </Grid>
      </Grid>
    );
  }
}

export default withStyles({
  webcam: { position: "relative", display: "flex", justifyContent: "center" },
  captureButton: {
    position: "absolute",
    bottom: 0,
    left: "calc(50% - 30px)",
    color: "#fff",
  },
  title: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "uppercase",
  },
  subTitle: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "capitalize",
    fontWeight: "normal",
  },
})(SubjectDetail);
