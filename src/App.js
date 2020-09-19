import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import { Layout, message } from 'antd';

import PageNotFound from './pages/404';

import SideBar from './components/SideBar';
import Navbar from './components/NavBar';

import AuthServices from './service/auth';
import AxiosHelper from './service/config';
import pages from './constants/pages';

import './App.css';

const token = window.localStorage.getItem('token');

AxiosHelper.setAxiosHeader(token);
AxiosHelper.setAxiosBaseUrl();

function App() {
	const { Content } = Layout;
	const [user, setUser] = useState(null);
	const [role, setRole] = useState(null);
	const [classList, setClassList] = useState([]);
	const [activeClass, setActiveClass] = useState('');

	const redirectUrl = role
		? role === STUDENT
			? '/student/classinfo'
			: '/teacher/dashboard'
		: '/login';

	useEffect(() => {
		const token = window.localStorage.getItem('token');

		const getUserByToken = async () => {
			try {
				const result = await AuthServices.verifyToken({ token });

				if (result.data.success) {
					const role = result.data.data.role;
					setRole(role);
					const requestUrl =
						role === 'student'
							? StudentServices.handleGetCurrentStudent
							: TeacherServices.handleGetCurrentTeacher;

					const currentUser = await requestUrl();

					if (currentUser.data.success) {
						if (currentUser.data.success) {
							setUser({ ...currentUser.data.data });
						} else {
							message.error(currentUser.data.data.message);
						}
					} else {
						message.error('Please try to sign in again');
					}
				}
			} catch (error) {
				message.error(error.message);
			}
		};

		if (token) getUserByToken();
	}, []);

	useEffect(() => {
		const fetchClasses = async () => {
			const apiRequest =
				role === TEACHER
					? ClassServices.handleGetClassesByTeacherId
					: ClassServices.handleGetClassesByStudentId;

			const queryId = role === TEACHER ? user._id : user.studentId;

			try {
				const result = await apiRequest(queryId);
				if (result.data.success) {
					setClassList(result.data.data);
				}
			} catch (error) {
				message.error('Error fetching class data: ', error.message);
			}
		};

		if (role && user) fetchClasses();
	}, [role, user]);

	return (
		<Router>
			<Layout>
				{user && (
					<Navbar
						activeClass={activeClass}
						setActiveClass={setActiveClass}
						classList={classList}
						redirectUrl={redirectUrl}
						user={user}
					/>
				)}
				<Layout>
					{user && (
						<SideBar
							redirectUrl={redirectUrl}
							user={user}
							role={role}
							activeClass={activeClass}
						/>
					)}
					<Layout style={{ padding: user ? '24px' : '0px' }}>
						<Content
							className='site-layout-background'
							style={
								user
									? {
											padding: 24,
											margin: 0,
											minHeight: 280,
									  }
									: {}
							}
						>
							<Switch>
								<Route exact path='/'>
									{user ? (
										<Redirect to={redirectUrl} />
									) : (
										<Redirect to='/login' />
									)}
								</Route>
								{pages.map((v) => (
									<Route
										exact={v.isExact}
										render={(props) => (
											<v.component
												{...props}
												user={user}
												setUser={setUser}
												redirectUrl={redirectUrl}
												role={role}
												activeClass={activeClass}
												setActiveClass={setActiveClass}
												classList={classList}
												setClassList={setClassList}
											></v.component>
										)}
										key={v.path}
										path={v.path}
									/>
								))}
								<Route
									path='*'
									render={(props) => (
										<PageNotFound {...props} redirectUrl={redirectUrl} />
									)}
								/>
							</Switch>
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</Router>
	);
}
export default App;
