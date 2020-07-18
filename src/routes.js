
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Notifications from "@material-ui/icons/Notifications";
// import HomeWorkIcon from '@material-ui/icons/HomeWork';
// import MenuBookIcon from '@material-ui/icons/MenuBook';
import BookIcon from '@material-ui/icons/Book';
// core components/views for Admin layout
import ScheduleTeach from "views/ScheduleTeach/ScheduleTeach";
import UserProfile from "views/UserProfile/UserProfile.js";
import RollCall from "views/RollCall/RollCall";
import ManagementStudent from "views/ManagementStudent/ManagementStudent";
import HomeWorkComponent from "views/HomeWork/HomeWork";
import NotificationsPage from "views/Notifications/Notifications.js";

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
    path: "/quan-ly-sinh-vien",
    name: "Quản lý sinh viên",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: ManagementStudent,
    layout: "/teacher"
  },
  // {
  //   path: "/bai-tap",
  //   name: "Bài tập",
  //   rtlName: "الرموز",
  //   icon: BookIcon,
  //   component: HomeWorkComponent,
  //   layout: "/teacher"
  // },
  // {
  //   path: "/thong-bao",
  //   name: "Thông báo",
  //   rtlName: "إخطارات",
  //   icon: Notifications,
  //   component: NotificationsPage,
  //   layout: "/teacher"
  // }
];

export default dashboardRoutes;
