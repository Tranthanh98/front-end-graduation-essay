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
import Image from "views/general/Image";
import GetImage from "views/general/GetImage";

class TrainingFace extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      trainImages: [],
    };
    this.webcamRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "environment",
    };
    this.studentId = sensitiveStorage.getStudentId();
    this.upLoadFileRef = React.createRef();
  }
  _onGetImage = (image) => {
    this._trainFace(image);
  };
  _trainFace = (image) => {
    const { trainingImages } = this.props;
    var a = image.split(",");
    var data = {
      studentId: this.studentId,
      base64Image: a[1],
    };
    this.ajaxPost({
      url: "/api/student/TrainStudentFace",
      data: data,
      success: (r) => {
        trainingImages.push(r.data);
        this.setState({});
      },
      unsuccess: (r) => {
        console.log(r);
      },
    });
  };
  _deleteTrainImage = (imageId) => {
    const { classes, trainingImages } = this.props;
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
        _trainingImages.forEach((t) => {
          trainingImages.push(t);
        });
        this.setState({});
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
          <GetImage onGetImage={this._onGetImage} />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.subTitle}>
            <Typography variant="h6">
              {`Ảnh đã train (${trainingImages.length})`}
            </Typography>
          </div>
          <div className={classes.imageWrapper}>
            {trainingImages.map((t) => (
              <Image
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
  control: {
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
    display: "flex",
    justifyContent: "space-between",
  },
  image: {
    cursor: "pointer",
  },
  imageWrapper: {
    display: "flex",
    flexWrap: "wrap",
    overflowY: "auto",
    margin: "0 8px",
  },
})(TrainingFace);
