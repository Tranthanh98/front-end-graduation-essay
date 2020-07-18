
// @material-ui/icons
import {
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  LibraryBooks as LibraryBookIcon,
  Notifications as NotificationIcon,
} from "@material-ui/icons";
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
import InfoPage from "views/student/pages/InfoPage";
import SubjectPage from "views/student/pages/SubjectPage";

// core components/views for RTL layout
import RTLPage from "views/RTLPage/RTLPage.js";
import Student from "layouts/Student";

const teacherRoutes = [
  {
    path: "/lich-giang-day",
    name: "Lịch giảng dạy",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: ScheduleTeach,
    layout: "/teacher"
  },
  {
    path: "/user",
    name: "Thông tin cá nhân",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PersonIcon,
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
    icon: LibraryBookIcon,
    component: ManagementStudent,
    layout: "/teacher"
  },
  {
    path: "/bai-tap",
    name: "Bài tập",
    rtlName: "الرموز",
    icon: NotificationIcon,
    component: HomeWorkComponent,
    layout: "/teacher"
  },
  {
    path: "/thong-bao",
    name: "Thông báo",
    rtlName: "إخطارات",
    icon: NotificationIcon,
    component: NotificationsPage,
    layout: "/teacher"
  }
];
const studentRoutes = [
  {
    path: "/information",
    name: "Thông tin học sinh",
    rtlName: "إخطارات",
    icon: AccountIcon,
    component: InfoPage,
    layout: "/student"
  },
  {
    path: "/subject",
    name: "Môn học",
    rtlName: "إخطارات",
    icon: AccountIcon,
    component: SubjectPage,
    layout: "/student"
  },
];
export { teacherRoutes, studentRoutes };
