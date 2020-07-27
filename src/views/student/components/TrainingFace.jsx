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
import Image from "views/student/components/Image";

class TrainingFace extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      trainImages: [],
      fileImage: null,
      openCamera: false
    };
    this.webcamRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "environment",
    };
    this.studentId = sensitiveStorage.getStudentId();
    // this.openCamera = false;
  }
  _onTrainFace = (e) => {
    const { classes, trainingImages } = this.props;
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
  uploadImage= (event) =>{
    event.stopPropagation();
    event.preventDefault();

    let files=event.target.files;
    let file = files[0];

    let fileReader = new FileReader();
    console.log('file reader :', fileReader);
    fileReader.onloadend = async(e) =>{
      this.setState({
        fileImage : [fileReader.result][0]
      })
    }
    fileReader.onerror = (e)=>{
      console.log('error', e);
    }
    // this.setState({
    //   data : file
    // })
    if(file && file.type.match('image.*')){
      fileReader.readAsDataURL(file)
    }
  }
  trainingImageUpload=()=>{
    let { classes, trainingImages } = this.props;
    let imgBase64 = this.state.fileImage.split(",");
    let data = {
      studentId: this.studentId,
      base64Image: imgBase64[1],
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
  }
  renderBody() {
    const { classes, trainingImages } = this.props;
    console.log("training face");
    return (
      <Grid container style={{ overflowY: "auto" }}>
        <Grid item xs={12}>
          <div className={classes.uploadFile}>
            <Button onClick={() => {this.setState({openCamera: !this.state.openCamera})}} 
                    color="primary"
                    variant="outlined">Chụp</Button>
            <label style={{cursor:"pointer"}} for="upload">Hoặc <a>tải ảnh</a> lên</label>
            {/* <p>Hoặc tải ảnh lên</p> */}
            <input type="file" className={classes.inputFile} id="upload" onChange={this.uploadImage}/>
          </div>
        </Grid>
        {
         this.state.openCamera ? (
          <Grid item={12} className={classes.webcam}>
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
          ): 
           (
             <Grid item xs={12}>
                  <div className={classes.uploadFile}>
                    <img width="90%" src={this.state.fileImage} alt=""/>
                  </div>
                  <div className={classes.uploadFile}>
                    {
                      this.state.fileImage != null ? 
                      (
                        <Button color="primary"
                            variant="contained" 
                            onClick={this.trainingImageUpload}
                            >Training
                        </Button>
                      ) : null
                    }
                  </div>
                  
             </Grid>
           )
        }
        {/* <Grid item xs={12} className={classes.webcam}>
          
          
          {
            this.state.openCamera ? (
              <>
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
              </>
            ) : 
              (
                <>
                  <img src={this.state.fileImage} alt=""/>
                  <Button color="primary"
                          variant="contained" 
                          onClick={this.trainingImageUpload}
                          >Training
                  </Button>
                </>
              )
          }
           */}
        {/* </Grid> */}
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.subTitle}>
            {`Ảnh đã train (${trainingImages.length})`}
          </Typography>
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
  inputFile:{
    opacity: 0,
    position: "absolute",
    zIndex: -1
  },
  uploadFile:{
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
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
