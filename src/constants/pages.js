import RegistrationPage from '../pages/Auth/Registration';
import LoginPage from '../pages/Auth/Login';
import LogoutPage from '../pages/Auth/Logout';
import ClassInfoPage from '../pages/Student/ClassInfo';
import StudentReport from '../pages/StudentReport';
import StudentClassInfoPage from '../pages/Student/ClassInfo';
import TeacherDashboardPage from '../pages/Teacher/Dashboard';
import TeacherClassPage from '../pages/Teacher/ClassInfo';
import TeacherStudentsTablePage from '../pages/Teacher/StudentsTable';
import TeacherCreateNewClassPage from '../pages/Teacher/NewClass';
import VideoPage from '../pages/Video';

const pages = [
	{
		path: '/registration',
		component: RegistrationPage,
		isExact: true,
	},
	{
		path: '/logout',
		component: LogoutPage,
		isExact: true,
	},
	{
		path: '/login',
		component: LoginPage,
		isExact: true,
	},
	{
		path: '/report/:classId/:studentId',
		component: StudentReport,
		isExact: true,
	},
	{
		path: '/student/classinfo',
		component: StudentClassInfoPage,
		isExact: true,
	},
	{
		path: '/student/classinfo/recording/:name',
		component: VideoPage,
		isExact: true,
	},
	{
		path: '/teacher/class',
		component: TeacherClassPage,
		isExact: true,
	},
	{
		path: '/teacher/recording/:name',
		component: VideoPage,
		isExact: true,
	},
	{
		path: '/teacher/dashboard',
		component: TeacherDashboardPage,
		isExact: true,
	},
	{
		path: '/teacher/students',
		component: TeacherStudentsTablePage,
		isExact: true,
	},
	{
		path: '/teacher/new/class',
		component: TeacherCreateNewClassPage,
		isExact: true,
	},
];

export default pages;
