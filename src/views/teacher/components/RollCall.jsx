import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
  Checkbox,
} from "@material-ui/core";
import Webcam from "react-webcam";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";
import Image from "views/general/Image";
import { isThisISOWeek } from "date-fns/esm";
import { ClassStatus } from "core/Enum";
import RCSTable from "views/general/RCSTable";
import GetImage from "views/general/GetImage";

class RollCall extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.webcamRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "environment",
    };
    this.studentId = sensitiveStorage.getStudentId();
    this.loadData = false;
  }
  _onGetImage = (image) => {
    this._rollCall(image);
  };
  _rollCall = (image) => {
    let { classSchedule } = this.props;
    var a = image.split(",");
    var data = {
      classScheduleId: classSchedule.id,
      base64Image: a[1],
    };
    this.ajaxPost({
      url: "/api/Class/RollCall",
      data: data,
      success: (r) => {
        r.data.forEach((d) => {
          let ok = false;
          classSchedule.rollCalls.forEach((rc) => {
            if (
              rc.studentId == d.studentId &&
              rc.classScheduleId == d.classScheduleId
            ) {
              Object.keys(rc).map((i) => {
                rc[i] = d[i];
              });
              ok = true;
            }
          });
          if (!ok) {
            classSchedule.rollCalls.push(d);
          }
        });
        this.setState({});
      },
      unsuccess: (r) => {
        console.log(r);
      },
    });
  };
  _updateClassSchedule = () => {
    let { classSchedule } = this.props;
    if (classSchedule.status == ClassStatus.schedule) {
      classSchedule.status = ClassStatus.opening;
    }
    this.ajaxPost({
      url: "/api/teacher/UpdateClassSchedule",
      data: classSchedule,
      success: (r) => {
        this.loadData = true;
        Object.keys(classSchedule).forEach((i) => {
          classSchedule[i] = r.data[i];
        });
        this.setState({});
      },
      unsuccess: (r) => {
        console.log(r);
      },
    });
  };
  componentDidMount() {
    this._updateClassSchedule();
  }
  _onChangeDiemDanh = (studying) => {
    const { classSchedule } = this.props;
    this.ajaxGet({
      url: `/api/teacher/ChangeRollCall?classScheduleId=${classSchedule.id}&studentId=${studying.student.id}`,
      success: (r) => {
        let rc = classSchedule.rollCalls.filter(
          (i) =>
            i.studentId == studying.student.id &&
            i.classScheduleId == classSchedule.id
        );
        if (rc.length > 0) {
          rc[0].isActive = r.data.isActive;
        } else {
          classSchedule.rollCalls.push(r.data);
        }
        this.setState({});
      },
      unsuccess: (r) => {
        console.log(r.messages[0]);
      },
    });
  };
  renderBody() {
    const { classes, classSchedule } = this.props;
    console.log("roll call");
    return (
      <Grid container style={{ overflowY: "auto" }}>
        <Grid item xs={12}>
          <GetImage onGetImage={this._onGetImage} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.subTitle}>
            Danh sách sinh viên
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {this.loadData ? (
            <RCSTable
              data={classSchedule.class.studyings}
              head={(Cell) => (
                <React.Fragment>
                  <Cell>Mã số sinh viên</Cell>
                  <Cell>Họ và tên</Cell>
                  <Cell>Điểm danh</Cell>
                  <Cell></Cell>
                </React.Fragment>
              )}
              body={(row, Cell) => {
                return (
                  <React.Fragment>
                    <Cell>{row.student.id}</Cell>
                    <Cell>{row.student.name}</Cell>
                    <Cell>
                      <Checkbox
                        checked={classSchedule.rollCalls.some(
                          (rc) => rc.studentId == row.student.id && rc.isActive
                        )}
                        onClick={() => {
                          this._onChangeDiemDanh(row);
                        }}
                      />
                    </Cell>
                    <Cell className={classes.celCenter}>
                      {classSchedule.rollCalls.some(
                        (rc) =>
                          rc.studentId == row.student.id && rc.imageId != null
                      ) ? (
                        <Image
                          imageId={
                            classSchedule.rollCalls.filter(
                              (rc) => rc.studentId == row.student.id
                            )[0].imageId
                          }
                          style={{ width: "36px", height: "36px", margin: "0" }}
                        />
                      ) : null}
                    </Cell>
                  </React.Fragment>
                );
              }}
            />
          ) : null}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles({
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
  image: {
    cursor: "pointer",
  },
  imageWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    margin: "0 8px",
  },
})(RollCall);
