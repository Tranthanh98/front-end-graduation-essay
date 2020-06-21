import React from 'react';
import BaseComponent from 'core/BaseComponent/BaseComponent';
import { withStyles, Typography, Grid } from '@material-ui/core';
import Table from "components/Table/Table.js";
import { Doughnut } from 'react-chartjs-2';

class ModalDetailStudent extends BaseComponent{
    constructor(props){
        super(props);
        this.state={
            dataChart :{
                labels: [
                  "Các buổi đã điểm danh : " + this.props.informationStudent.ListRollCall.length,
                  "Các buổi chưa điểm danh : " + this.props.informationStudent.totalBuoiHoc
                ],
                datasets: [
                  {
                    label: "Population (millions)",
                    backgroundColor: [
                      "#3e95cd",
                      "#8e5ea2"
                    ],
                    data: [this.props.informationStudent.ListRollCall.length, this.props.informationStudent.totalBuoiHoc]
                  }
                ]
            }
        }
    }
    _renderTableRow = (ListRollCall) =>{
        return ListRollCall.map((item, index)=>{
            return [
            <Typography>{this.formatDateTime(item.ngayDay)}</Typography>,
            <Typography>{item.phongHoc}</Typography>,
            <Typography>{item.tuanThu}</Typography>
            ]
        })
    }
    renderBody(){
        let {ListRollCall, course, email, imageTrained, mssv, nameStudent, isSuspended} = this.props.informationStudent;
        console.log("inf student : ", this.props.informationStudent);
        const {classes} = this.props;
        return (
            <div className={classes.container}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography>
                            Mã số SV : {mssv}
                        </Typography>
                        <Typography>
                            Tên sinh viên : {nameStudent}
                        </Typography>
                        <Typography>
                            Email : {email}
                        </Typography>
                        <Typography>
                            Khóa : {course}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>Ảnh trained</Typography>
                        <Grid container>
                        {
                            imageTrained.map((img, index) =>{
                                return (
                                    <Grid key={index} item xs={3}>
                                        <img src={img} alt=""/>
                                    </Grid>
                                )
                            })
                        }
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        {
                            isSuspended ? (<Typography color="error">Sinh viên này đã bị đình chỉ</Typography>) : null
                        }
                        <Doughnut data={this.state.dataChart} />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography>Danh sách các buổi điểm danh của sinh viên</Typography>
                        <Table
                            tableHeaderColor="primary"
                            tableHead={["Ngày", "Phòng học", "Tuần thứ"]}
                            tableData={this._renderTableRow(ListRollCall)}
                        />
                    </Grid>
                </Grid>
            </div>
        )
    }
}
const style ={
    container : {
        padding : "20px"
    }
}
export default withStyles(style)(ModalDetailStudent);