import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { STUDENT, TEACHER } from '../../../../constants/roles';

import AuthServices from '../../../../service/auth';

import './index.scss';
import { loginInputs } from './constants';

const LoginForm = ({ role, redirectUrl, handleLogin}) => {
	const history = useHistory();
	const onFinish = async (values) => {
		const hide = message.loading('登录中...', 0);
		try {
			const { email, password } = values;
			const apiRequest =
				role === STUDENT
					? AuthServices.handlestudentLogin
					: AuthServices.handleteacherLogin;
			const result = await apiRequest({ email, password });
			hide();
			if (result.data.success) {
				window.localStorage.setItem('token', result.data.data);
				role === STUDENT
					? history.push("/student/classinfo")
					: history.push("/teacher/dashboard");
				window.location.reload();
			} else {
				message.warning(result.data.data);
			}
		} catch (error) {
			hide();
			message.error(error.message);
		}
	};

	return (
		<div>
			<Form className='login-form' onFinish={onFinish}>
				{loginInputs.map((v) => (
					<Form.Item key={v.name} name={v.name} rules={v.rules}>
						<Input type={v.type} prefix={v.icon} placeholder={v.placeholder} />
					</Form.Item>
				))}
				<Form.Item>
					<Button
						type='primary'
						htmlType='submit'
						className='login-form-button'
					>
						<p>Log in</p>
					</Button>
					{role === 'student' && (
						<>
							<span>Or</span>
							<Link onClick={()=>handleLogin(false)}>Register now!</Link>
						</>
					)}
				</Form.Item>
			</Form>
		</div>
	);
};

export default withRouter(LoginForm);
