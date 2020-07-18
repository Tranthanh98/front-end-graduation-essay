import React from "react";
import BaseComponent from "core/BaseComponent/BaseComponent";
import { withStyles, IconButton } from "@material-ui/core";
import RCSTable from "views/student/components/RCSTable";
import { OpenInNew as OpenIcon } from "@material-ui/icons";
import { DayOfWeek } from "core/Enum";
import { sensitiveStorage } from "core/services/SensitiveStorage";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import SubjectDetail from "views/student/components/SubjectDetail";

class SubjectPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      studyings: [],
    };
    this.studentId = sensitiveStorage.getStudentId();
  }
  _getClassOfStudent = () => {
    const { studentInfo } = this.props;
    this.ajaxGet({
      url: `/api/student/GetAllSubjectOfStudent?studentId=${this.studentId}`,
      success: (apiResult) => {
        this.setState({ studyings: apiResult.data });
      },
      unsuccess: (apiResult) => {
        console.error(apiResult.messages[0]);
      },
    });
  };
  _onClickDetailBtn = (studying) => {
    this.openModal({ content: <SubjectDetail studying={studying} /> });
  };
  componentDidMount() {
    this._getClassOfStudent();
  }
  renderBody() {
    const { studentInfo, classes } = this.props;
    const { studyings } = this.state;
    return (
      <Card profile style={{ marginTop: 0 }}>
        {/* <CardHeader color="primary">
        <Typography
          variant="h5"
          style={{ color: "#fff", textAlign: "left" }}
        >
          Hồ sơ
        </Typography>
      </CardHeader> */}
        <CardBody style={{ padding: "25px 20px 30px" }}>
          <RCSTable
            data={studyings}
            head={(Cell) => (
              <React.Fragment>
                <Cell>Mã môn học</Cell>
                <Cell>Tên môn học</Cell>
                <Cell>Lớp học</Cell>
                <Cell>Ngày học</Cell>
                <Cell>Xem chi tiết</Cell>
              </React.Fragment>
            )}
            body={(row, Cell) => (
              <React.Fragment>
                <Cell>{row.class.subject.id}</Cell>
                <Cell>{row.class.subject.name}</Cell>
                <Cell>{row.class.name}</Cell>
                <Cell>{DayOfWeek[row.class.day]}</Cell>
                <Cell className={classes.celCenter}>
                  <IconButton
                    onClick={() => {
                      this._onClickDetailBtn(row);
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
    );
  }
}

export default withStyles({
  celCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
})(SubjectPage);
