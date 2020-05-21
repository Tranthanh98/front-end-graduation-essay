/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
import Login from './layouts/Login';
// core components/views for Admin layout
import ScheduleTeach from "views/ScheduleTeach/ScheduleTeach";
import UserProfile from "views/UserProfile/UserProfile.js";
import RollCall from "views/RollCall/RollCall";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";

const dashboardRoutes = [
  {
    path: "/lich-giang-day",
    name: "Lịch giảng dạy",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: ScheduleTeach,
    layout: "/teacher"
  },
  {
    path: "/user",
    name: "Thông tin cá nhân",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/teacher"
  },
  {
    path: "/diem-danh",
    name: "Điểm danh",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: RollCall,
    layout: "/teacher"
  },
  {
    path: "/typography",
    name: "Typography",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Typography,
    layout: "/teacher"
  },
  {
    path: "/icons",
    name: "Icons",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Icons,
    layout: "/teacher"
  },
  {
    path: "/maps",
    name: "Maps",
    rtlName: "خرائط",
    icon: LocationOn,
    component: Maps,
    layout: "/teacher"
  },
  {
    path: "/notifications",
    name: "Thông báo",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/teacher"
  }
];

export default dashboardRoutes;
