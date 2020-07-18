import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
  TextField,
} from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";
import { DayOfWeek } from "core/Enum";

class SubjectDetail extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.studentId = sensitiveStorage.getStudentId();
  }
  renderBody() {
    const { classes, studying } = this.props;
    console.log("subject detail");
    return (
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          {studying.class.subject.name}
        </Typography>
        <div className={classes.content}>
          <TextField value={studying.class.teacher.name} label="Giảng viên" />
          <TextField
            value={`${DayOfWeek[studying.class.day]} (${
              studying.class.startSession
            }-${studying.class.startSession +
              studying.class.quantityOfSession -
              1})`}
            label="Thời gian"
          />
        </div>
      </div>
    );
  }
}

export default withStyles({
  root: {},
  title: {
    padding: "15px 30px 10px",
    borderBottom: "1px solid #ccc",
    textTransform: "uppercase",
  },
  content: {
    padding: "10px 15px",
  },
})(SubjectDetail);
