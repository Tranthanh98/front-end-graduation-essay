import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import Webcam from "react-webcam";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Configs from "app.config";
import TrainImage from "views/student/components/TrainImage";

class TrainingFace extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      trainImages: [],
    };
    this.webcamRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user",
    };
    this.studentId = sensitiveStorage.getStudentId();
  }
  _onTrainFace = (e) => {
    const { classes, trainingImages, onUpdateTrainImages } = this.props;
    var i = this.webcamRef.current.getScreenshot();
    var a = i.split(",");
    var data = {
      studentId: this.studentId,
      base64Image: a[1],
    };
    this.ajaxPost({
      url: "/api/student/TrainStudentFace",
      data: data,
      success: (r) => {
        trainingImages.push(r.data);
        this.setState({}, () => {
          onUpdateTrainImages();
        });
      },
      unsuccess: (r) => {
        console.log(r);
      },
    });
  };
  _deleteTrainImage = (imageId) => {
    const { classes, trainingImages, onUpdateTrainImages } = this.props;
    this.ajaxGet({
      url: `/api/file/DeleteFile?fileId=${imageId}`,
      success: (apiResult) => {
        const _trainingImages = trainingImages.filter(
          (t) => t.fileId != imageId
        );
        let a = trainingImages.length;
        for (let i = 1; i <= a; i++) {
          trainingImages.pop();
        }
        trainingImages.push(_trainingImages);
        this.setState({}, () => {
          onUpdateTrainImages();
        });
      },
      unsuccess: (apiResult) => {
        console.log(apiResult);
      },
    });
  };
  _onDeleteTrainImage = (imageId) => {
    const a = window.confirm("Bạn muốn xóa ảnh này?");
    if (a) {
      this._deleteTrainImage(imageId);
    }
  };
  renderBody() {
    const { classes, trainingImages } = this.props;
    console.log("training face");
    return (
      <Grid container style={{ overflowY: "auto" }}>
        <Grid item xs={12}>
          <Typography variant="h5" className={classes.title}>
            Train Face
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.webcam}>
          <Webcam
            audio={false}
            width={800}
            ref={this.webcamRef}
            screenshotFormat="image/jpg"
            videoConstraints={this.videoConstraints}
          />
          <IconButton
            onClick={this._onTrainFace}
            className={classes.captureButton}
          >
            <PhotoCameraIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.subTitle}>
            {`Ảnh đã train (${trainingImages.length})`}
          </Typography>
          <div className={classes.imageWrapper}>
            {trainingImages.map((t) => (
              <TrainImage
                imageId={t.fileId}
                key={t.fileId + "1"}
                onDelete={this._onDeleteTrainImage}
              />
            ))}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles({
  webcam: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    margin: "16px",
  },
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
  image: {
    cursor: "pointer",
  },
  imageWrapper: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto",
    margin: "0 8px",
  },
})(TrainingFace);
