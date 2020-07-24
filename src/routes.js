
// @material-ui/icons
import {
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  LibraryBooks as LibraryBookIcon,
  Notifications as NotificationIcon,
  Subject as SubjectIcon,
  Face as FaceIcon
} from "@material-ui/icons";
import ScheduleTeachPage from "views/teacher/pages/ScheduleTeachPage";
import TeacherInfoPage from "views/teacher/pages/TeacherInfoPage";
import StudentInfoPage from "views/student/pages/StudentInfoPage";
import SubjectPage from "views/student/pages/SubjectPage";
import TrainFacePage from "views/student/pages/TrainFacePage";

const teacherRoutes = [
  {
    path: "/lich-giang-day",
    name: "Lịch giảng dạy",
    rtlName: "لوحة القيادة",
    icon: DashboardIcon,
    component: ScheduleTeachPage,
    layout: "/teacher"
  },
  {
    path: "/info",
    name: "Thông tin cá nhân",
    rtlName: "ملف تعريفي للمستخدم",
    icon: PersonIcon,
    component: TeacherInfoPage,
    layout: "/teacher"
  },
];
const studentRoutes = [
  {
    path: "/information",
    name: "Thông tin cá nhân",
    rtlName: "إخطارات",
    icon: AccountIcon,
    component: StudentInfoPage,
    layout: "/student"
  },
  {
    path: "/subject",
    name: "Môn học",
    rtlName: "إخطارات",
    icon: SubjectIcon,
    component: SubjectPage,
    layout: "/student"
  },
  {
    path: "/train-face",
    name: "Train face",
    rtlName: "إخطارات",
    icon: FaceIcon,
    component: TrainFacePage,
    layout: "/student"
  },
];
export { teacherRoutes, studentRoutes };
