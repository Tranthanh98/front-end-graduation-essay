import React from "react";
import { withStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import { Typography, IconButton } from "@material-ui/core";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import BaseComponent from "core/BaseComponent/BaseComponent";
import RCSTable from "views/student/components/RCSTable";
import { OpenInNew as OpenIcon } from "@material-ui/icons";
import CardBody from "components/Card/CardBody";
import Card from "components/Card/Card";
import { DayOfWeek, ClassStatus } from "core/Enum";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import CardFooter from "components/Card/CardFooter";
import moment from "moment";
import { ClassStatusName } from "core/Enum";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import RollCall from "views/teacher/components/RollCall";
import { differenceInDays } from "date-fns";
import TeacherClassDetail from "views/teacher/components/TeacherClassDetail";

class ScheduleTeachPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      classesOfTeacher: [],
      date: new Date(),
    };
    this.teacherId = sensitiveStorage.getTeacherId();
    window.differenceInDays = differenceInDays;
  }
  _getAllClassOfTeacher = () => {
    this.ajaxGet({
      url: `/api/teacher/GetAllClassByTeacherId?teacherId=${this.teacherId}`,
      success: (r) => {
        this.setState({ classesOfTeacher: r.data });
      },
      unsuccess: (r) => {
        console.log(r.messages[0]);
      },
    });
  };
  _onClickClassDetailBtn = (classOfTeacher) => {
    this.openModal({
      content: <TeacherClassDetail classOfTeacher={classOfTeacher} />,
      title: `${classOfTeacher.name} - ${classOfTeacher.subject.name}`,
      fullScreen: true,
    });
  };
  _onClickClassInDateBtn = (classSchedule) => {
    this.openModal({
      content: <RollCall classSchedule={classSchedule} />,
      title: "Điểm danh",
      fullScreen: true,
    });
  };
  componentDidMount() {
    this._getAllClassOfTeacher();
  }
  _onChangeDate = (date) => {
    this.setState({ date: date });
  };
  renderBody() {
    const { classesOfTeacher, date } = this.state;
    const { classes } = this.props;
    var classInDate = 0;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Card profile style={{ marginTop: 0 }}>
              <CardHeader color="primary" className={classes.header}>
                <Typography variant="h5">Lớp học trong ngày</Typography>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem
                    xs={12}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Chọn ngày"
                        format="dd/MM/yyyy"
                        value={date}
                        onChange={this._onChangeDate}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        inputProps={{
                          style: { textAlign: "center" },
                        }}
                        color="secondary"
                        inputVariant="outlined"
                        variant="inline"
                      />
                    </MuiPickersUtilsProvider>
                  </GridItem>
                  {classesOfTeacher.map((c) => {
                    return c.classSchedules.map((cs) => {
                      if (differenceInDays(date, new Date(cs.datetime)) == 0) {
                        classInDate++;
                        const color =
                          cs.status == ClassStatus.shedule
                            ? "danger"
                            : cs.status == ClassStatus.opening
                            ? "warning"
                            : "success";
                        return (
                          <GridItem
                            xs={6}
                            sm={6}
                            md={4}
                            key={`${cs.classId}${cs.datetime}`}
                          >
                            <Card>
                              <CardHeader color={color} stats icon>
                                <CardIcon color={color}>
                                  <Typography variant="h6">
                                    {moment(cs.datetime).format("hh:mm")}
                                  </Typography>
                                </CardIcon>
                              </CardHeader>
                              <div
                                style={{ padding: "10px", textAlign: "left" }}
                              >
                                <Typography variant="h6">
                                  {c.subject.name}
                                </Typography>
                                <Typography variant="body1">
                                  Phòng: {c.room}
                                </Typography>
                                <Typography variant="body1">
                                  Trạng thái: {ClassStatusName[cs.status]}
                                </Typography>
                              </div>
                              <CardFooter stats>
                                <Typography>
                                  {cs.status == ClassStatus.shedule
                                    ? "Mở lớp và điểm danh"
                                    : cs.status == ClassStatus.opening
                                    ? "Tham gia lớp học"
                                    : "Xem chi tiết"}
                                </Typography>
                                <IconButton
                                  onClick={(e) => {
                                    this._onClickClassInDateBtn(cs);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faArrowRight}
                                    color="#00acc1"
                                  />
                                </IconButton>
                              </CardFooter>
                            </Card>
                          </GridItem>
                        );
                      }
                    });
                  })}
                  {classInDate == 0 ? (
                    <Typography
                      variant="body1"
                      style={{ fontStyle: "italic", padding: "0 10px" }}
                    >
                      Hôm nay bạn không có lớp học.
                    </Typography>
                  ) : null}
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card profile style={{ marginTop: 0 }}>
              <CardHeader color="primary" className={classes.header}>
                <Typography variant="h5">Lịch dạy trong tuần</Typography>
              </CardHeader>
              <CardBody style={{ padding: "25px 20px 30px" }}>
                <RCSTable
                  data={classesOfTeacher}
                  emptyText={"Bạn không có lịch dạy nào trong tuần."}
                  head={(Cell) => (
                    <React.Fragment>
                      <Cell>Mã Môn</Cell>
                      <Cell>Tên Môn</Cell>
                      <Cell>Lớp</Cell>
                      <Cell>Thời gian</Cell>
                      <Cell>Chi tiết</Cell>
                    </React.Fragment>
                  )}
                  body={(row, Cell) => (
                    <React.Fragment>
                      <Cell>{row.subject.id}</Cell>
                      <Cell>{row.subject.name}</Cell>
                      <Cell>{row.name}</Cell>
                      <Cell>{`${DayOfWeek[row.day]} (${
                        row.startSession
                      }-${row.startSession +
                        row.quantityOfSession -
                        1})`}</Cell>
                      <Cell>
                        <IconButton
                          onClick={() => {
                            this._onClickClassDetailBtn(row);
                          }}
                        >
                          <OpenIcon />
                        </IconButton>
                      </Cell>
                    </React.Fragment>
                  )}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}
const styleLocal = {
  card: {
    cursor: "pointer",
  },
  paddingCardContent: {
    padding: "5px",
  },
  hover: {
    cursor: "pointer",
  },
  celCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
};
export default withStyles(styleLocal)(ScheduleTeachPage);
