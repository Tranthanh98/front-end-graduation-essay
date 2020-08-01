import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import {
  withStyles,
  Button,
  Grid,
  IconButton,
  Typography,
  Checkbox,
  Switch,
  FormControlLabel,
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
import $ from "jquery";
import { RollCallType } from "core/Enum";
import resizebase64 from 'resize-base64';

class RollCall extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { 
      review: true,
      width: window.innerWidth,
      imagePhone: ""
    };
    this.webcamRef = React.createRef();
    this.videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "environment",
      file: null,
    };
    this.studentId = sensitiveStorage.getStudentId();
    this.loadData = false;

    window.mobileCheck = function() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
    window.mobileAndTabletCheck = function() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
  }
  _onGetImageCapture = (image) => {
    this._rollCall(image);
  };
  _onGetImageUpload = (image) => {
    this._rollCallByImageUpload(image);
  };
  _rollCallByImageUpload = (image) => {
    let { classSchedule } = this.props;
    const data = new FormData();
    data.append(classSchedule.id.toString(), image);
    this.ajaxPost({
      url: "/api/Class/RollCallByImageUpload",
      data: data,
      noDataType: true,
      noProcessData: true,
      noContentType: true,
      success: (r) => {
        r.data.rollCalls.forEach((d) => {
          let ok = false;
          classSchedule.rollCalls.forEach((rc) => {
            if (
              rc.studentId == d.studentId &&
              rc.classScheduleId == d.classScheduleId
            ) {
              Object.keys(d).map((i) => {
                rc[i] = d[i];
              });
              ok = true;
            }
          });
          if (!ok) {
            classSchedule.rollCalls.push(d);
          }
        });
        this.setState({}, () => {
          if (this.state.review) {
            this.openModal({
              content: (
                <Image
                  width="auto"
                  height="auto"
                  src={`data:image/png;base64,${r.data.base64Image}`}
                />
              ),
              style: {
                maxWidth: "80vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
              },
            });
          }
        });
        this.success("Điểm danh thành công.");
      },
      unsuccess: (r) => {
        if (this.state.review) {
          this.openModal({
            content: (
              <Image
                width="auto"
                height="auto"
                src={`data:image/png;base64,${r.data.base64Image}`}
              />
            ),
            style: {
              maxWidth: "80vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
            },
          });
        }
        this.error(r.messages[0]);
      },
    });
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
        r.data.rollCalls.forEach((d) => {
          let ok = false;
          classSchedule.rollCalls.forEach((rc) => {
            if (
              rc.studentId == d.studentId &&
              rc.classScheduleId == d.classScheduleId
            ) {
              Object.keys(d).map((i) => {
                rc[i] = d[i];
              });
              ok = true;
            }
          });
          if (!ok) {
            classSchedule.rollCalls.push(d);
          }
        });
        this.setState({}, () => {
          if (this.state.review) {
            this.openModal({
              content: (
                <Image
                  width="auto"
                  height="auto"
                  src={`data:image/png;base64,${r.data.base64Image}`}
                />
              ),
              style: {
                maxWidth: "80vw",
                maxHeight: "80vh",
                width: "auto",
                height: "auto",
              },
            });
          }
        });
        this.success("Điểm danh thành công.");
      },
      unsuccess: (r) => {
        if (this.state.review) {
          this.openModal({
            content: (
              <Image
                width="auto"
                height="auto"
                src={`data:image/png;base64,${r.data.base64Image}`}
              />
            ),
            style: {
              maxWidth: "80vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
            },
          });
        }
        this.error(r.messages[0]);
      },
    });
  };
  _getClassScheduleFullData = () => {
    let { classSchedule } = this.props;
    this.ajaxGet({
      url: `/api/class/getClassScheduleFullData?classScheduleId=${classSchedule.id}`,
      success: (r) => {
        this.loadData = true;
        Object.keys(classSchedule).forEach((i) => {
          classSchedule[i] = r.data[i];
        });
        this.setState({});
      },
      unsuccess: (r) => {
        if (this.state.review) {
          this.openModal({
            content: (
              <Image
                width="auto"
                height="auto"
                src={`data:image/png;base64,${r.data.base64Image}`}
              />
            ),
            style: {
              maxWidth: "80vw",
              maxHeight: "80vh",
              width: "auto",
              height: "auto",
            },
          });
        }
        this.error(r.messages[0]);
      },
    });
  };
  componentDidMount() {
    this._getClassScheduleFullData();
    window.addEventListener('resize', this.resizeScreen);
  }
  resizeScreen = () =>{
    this.setState({
      width: window.innerWidth
    })
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
          rc[0].type = r.data.type;
        } else {
          classSchedule.rollCalls.push(r.data);
        }
        this.setState({}, () => {
          this.success(r.messages[0]);
        });
      },
      unsuccess: (r) => {
        this.error(r.messages[0]);
      },
    });
  };
  _closeClass = () => {
    const { classSchedule } = this.props;
    this.ajaxGet({
      url: `/api/class/closeClass?classScheduleId=${classSchedule.id}`,
      success: (r) => {
        classSchedule.status = r.data.status;
        this.setState({}, () => {
          this.success(r.messages[0]);
        });
      },
      error: (r) => {
        this.error(r.messages[0]);
      },
    });
  };
  _onClickCloseClassBtn = () => {
    const a = window.confirm("Bạn chắc chắn muốn đóng lớp học này?");
    if (a) {
      this._closeClass();
    }
  };
  getImagePhone = (e) =>{
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let _self = this;
    let resize_width = 1080;

    reader.onload = function(event) {
      var img = document.createElement('img');
      img.src = event.target.result;
      img.name = event.target.name;
      img.size = event.target.size;
      let srcEncoded;
      img.onload = (el) => {
        var elem = document.createElement('canvas');
        var scaleFactor = resize_width / el.target.width;
        elem.width = resize_width;
        elem.height = el.target.height * scaleFactor;
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
        srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);
        _self.setState({imagePhone : srcEncoded}, ()=> _self._rollCall(_self.state.imagePhone));
      }

    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  }
  renderBody() {
    const { classes, classSchedule } = this.props;
    const { review } = this.state;
    console.log("roll call");
    return (
      <Grid container style={{ overflowY: "auto" }}>
        {classSchedule.status != ClassStatus.closed ? (
          <Grid item xs={12}>
            
            {
              window.mobileAndTabletCheck() ? (
                <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                  <label style={{fontSize:"20px", border: "1px solid #F50057", borderRadius:"10px", marginTop:"15px"}}>Nhấn để <a>mở</a> máy ảnh</label>
                  <input type="file"
                        style={{opacity: 0,
                                position: "absolute"}}
                        name="image" 
                        accept="image/*" 
                        onChange={this.getImagePhone}
                        // capture="camera"
                        />
                </div>
              ) : (
                <GetImage
                  onGetImageCapture={this._onGetImageCapture}
                  onGetImageUpload={this._onGetImageUpload}
                />
              )
            }
          </Grid>
        ) : null}
        {classSchedule.status != ClassStatus.closed ? (
          <Grid item xs={12} className={classes.subTitleWrapper}>
            <Button
              onClick={this._onClickCloseClassBtn}
              color="secondary"
              variant="outlined"
              style={{ margin: "8px" }}
            >
              Đóng lớp
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={review}
                  onChange={() => {
                    this.setState({ review: !review });
                  }}
                />
              }
              label="Xem lại"
            />
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {this.loadData ? (
            <RCSTable
              data={classSchedule.class.studyings}
              head={(Cell) => (
                <React.Fragment>
                  <Cell className={classes.centerCell}>Mã số sinh viên</Cell>
                  <Cell className={classes.centerCell}>Họ và tên</Cell>
                  <Cell className={classes.centerCell}>Điểm danh</Cell>
                  <Cell className={classes.centerCell}></Cell>
                </React.Fragment>
              )}
              body={(row, Cell) => {
                return (
                  <React.Fragment>
                    <Cell className={classes.centerCell}>{row.student.id}</Cell>
                    <Cell>{row.student.name}</Cell>
                    <Cell className={classes.centerCell}>
                      <Checkbox
                        checked={classSchedule.rollCalls.some(
                          (rc) => rc.studentId == row.student.id && rc.isActive
                        )}
                        onClick={() => {
                          this._onChangeDiemDanh(row);
                        }}
                      />
                    </Cell>
                    <Cell className={classes.centerCell}>
                      {classSchedule.rollCalls.some(
                        (rc) =>
                          rc.studentId == row.student.id 
                          && rc.imageId != null 
                          && rc.type == RollCallType.auto
                          && rc.isActive
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
  subTitleWrapper: {
    borderBottom: "1px solid #ccc",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  subTitle: {
    padding: "15px 30px 10px",
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
  centerCell: {
    textAlign: "center",
  },
})(RollCall);
