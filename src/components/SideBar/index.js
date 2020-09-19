import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import getAPIUrl from '../../constants/apiUrl';
import axios from 'axios';
import { Layout, Menu, Modal, message, Form, Input } from 'antd';
import './index.scss';
import {
	DashboardOutlined,
	TableOutlined,
	AuditOutlined,
	PlusSquareOutlined,
	PieChartOutlined,
	LogoutOutlined,
	EditOutlined,
} from '@ant-design/icons';
import { STUDENT } from '../../constants/roles';

export default function SideBar({ role, user, redirectUrl, activeClass }) {
	const apiUrl = getAPIUrl();
	const { Sider } = Layout;
	const { ItemGroup, Item } = Menu;
	const [changePasswordBox, setChangePasswordBox] = useState(false);
	const [boxConfirmLoading, setBoxConfirmLoading] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [selectKey, setKey] = useState(
		role === 'student'
			? ['/student/classinfo']
			: ['/teacher/dashboard'],
	);
	const history = useHistory();
	const location = useLocation();
	const teacherGreeting = `Welcome back, ${user && user.name}`;
	const studentGreeting =
		user && `${user.firstName} ${user.lastName} #${user.studentId}`;

	useEffect(() => {
		if (role === 'student') {
			if(window.location.href.indexOf("report") !== -1){
				setKey([`/report/${activeClass}/${user.studentId}`])
			}
			else{
				setKey(['/student' + window.location.href.split('/student')[1]]);
			}
		} else {
			setKey(['/teacher' + window.location.href.split('/teacher')[1]]);
		}
	}, [location]);

	const handleOk = () => {
		setBoxConfirmLoading(true);
		if (confirmPassword !== newPassword) {
			message.warning('The two passwords that you entered do not match!');
			setBoxConfirmLoading(false);
			return false;
		}
		if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
			message.warning('Please enter all fields!');
			setBoxConfirmLoading(false);
			return false;
		}
		if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
			message.warning('Please enter all fields!');
			setBoxConfirmLoading(false);
			return false;
		}
		if (role === STUDENT) {
			axios
				.put(`${apiUrl}/students/password`, {
					oldPassword: oldPassword,
					newPassword: newPassword,
					studentId: user._id,
				})
				.then((res) => res.data)
				.then((data) => {
					if (data.success) {
						message.success('Change password success, Please login again!');
						setTimeout(() => {
							history.push('/logout');
						}, 1000);
					} else {
						message.warning(data.data);
						setBoxConfirmLoading(false);
					}
				})
				.catch((e) => {
					message.warning(e);
				});
		} else {
			axios
				.put(`${apiUrl}/teachers/password`, {
					oldPassword,
					newPassword,
					teacherId: user._id,
				})
				.then((res) => res.data)
				.then((data) => {
					if (data.success) {
						message.success('Change password success, Please login again!');
						setTimeout(() => {
							history.push('/logout');
						}, 1000);
					} else {
						message.warning(data.data);
						setBoxConfirmLoading(false);
					}
				})
				.catch((e) => {
					message.warning(e);
				});
		}
	};
	const handleCancel = () => {
		setChangePasswordBox(false);
	};
	const onFinish = (values) => {
		message.success('Success:', values);
	};
	const onFinishFailed = (errorInfo) => {
		message.error('Failed:', errorInfo);
	};

	return (
		<>
			<Sider width={200} className='site-layout-background'>
				<Menu
					mode='inline'
					selectedKeys={selectKey}
					defaultOpenKeys={[redirectUrl]}
					style={{ height: '100%', borderRight: 0 }}
					onClick={({ key }) =>
						key === 'changePassword'
							? setChangePasswordBox(true)
							: history.push(key)
					}
				>
					{role === STUDENT ? (
						<ItemGroup title={studentGreeting}>
							<Item
								icon={<PieChartOutlined />}
								key={`/student/classinfo`}
							>
								Class Info
							</Item>
							{
								activeClass ? (<Item
									icon={<PieChartOutlined />}
									key={`/report/${activeClass}/${user.studentId}`}
								>
									Student Report
								</Item>):null
							}
							<Item icon={<EditOutlined />} key='changePassword'>
								Change password
							</Item>
							<Item danger icon={<LogoutOutlined />} key='/logout'>
								Logout
							</Item>
						</ItemGroup>
					) : (
						<ItemGroup title={teacherGreeting}>
							<Item icon={<DashboardOutlined />} key='/teacher/dashboard'>
								Dashboard
							</Item>
							<Item icon={<TableOutlined />} key='/teacher/students'>
								Students Info
							</Item>
							<Item icon={<AuditOutlined />} key='/teacher/class'>
								Class Info
							</Item>
							<Item icon={<PlusSquareOutlined />} key='/teacher/new/class'>
								Create New Class
							</Item>
							<Item icon={<EditOutlined />} key='changePassword'>
								Change password
							</Item>
							<Item danger icon={<LogoutOutlined />} key='/logout'>
								Logout
							</Item>
						</ItemGroup>
					)}
				</Menu>
			</Sider>
			<Modal
				title='Change Password'
				visible={changePasswordBox}
				onOk={handleOk}
				confirmLoading={boxConfirmLoading}
				onCancel={handleCancel}
			>
				<Form
					name='basic'
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item
						label='Old Password'
						name='oldPassword'
						rules={[
							{ required: true, message: 'Please input your old password!' },
						]}
					>
						<Input.Password
							onChange={(e) => setOldPassword(e.target.value)}
							disabled={boxConfirmLoading}
						/>
					</Form.Item>

					<Form.Item
						label='New Password'
						name='newPassword'
						rules={[
							{ required: true, message: 'Please input your new password!' },
						]}
					>
						<Input.Password
							onChange={(e) => setNewPassword(e.target.value)}
							disabled={boxConfirmLoading}
						/>
					</Form.Item>
					<Form.Item
						label='Confirm Password'
						name='confirmPassword'
						rules={[
							{ required: true, message: 'Please input your new password!' },
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (!value || getFieldValue('newPassword') === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										'The two passwords that you entered do not match!',
									);
								},
							}),
						]}
					>
						<Input.Password
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={boxConfirmLoading}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
