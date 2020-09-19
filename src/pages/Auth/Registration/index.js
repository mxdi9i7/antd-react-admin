import React from 'react';
import { useHistory } from 'react-router-dom';
import AuthServices from '../../../service/auth';
import { Form, Input, Button, message } from 'antd';
import './index.scss';
import Logo from '../../../images/logo.png';
import { Link } from 'react-router-dom';

const formItemLayout = {
	labelCol: {
		xs: {
			span: 24,
		},
		sm: {
			span: 8,
		},
	},
	wrapperCol: {
		xs: {
			span: 20,
		},
		sm: {
			span: 10,
		},
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

export default function RegistrationPage() {
	let history = useHistory();
	const [form] = Form.useForm();

	const onFinish = async (values) => {
		try {
			const { password, email } = values;
			const registerResult = await AuthServices.handlestudentRegister(values);

			if (registerResult.data.success) {
				const loginResult = await AuthServices.handlestudentLogin({
					password,
					email,
				});

				if (loginResult.data.success) {
					const token = loginResult.data.data;

					window.localStorage.setItem('token', token);
					history.push('/');
				} else {
					message.error('Something went wrong during login');
				}
			} else {
				message.error('Email has already been registered');
			}
		} catch (error) {
			message.error(error.message);
		}
	};

	return (
		<div className='register-page page'>
			<div className='logo'>
				<img src={Logo} alt='' />
			</div>
			<p>Registration</p>
			<form onSubmit={(e) => e.preventDefault()} className='register-form'>
				<Form
					{...formItemLayout}
					form={form}
					name='register'
					onFinish={onFinish}
					scrollToFirstError
				>
					<Form.Item
						name='firstName'
						label={<span>First Name</span>}
						rules={[
							{
								required: true,
								message: 'Please input your First Name!',
								whitespace: true,
							},
						]}
					>
						<Input placeholder='firstName' />
					</Form.Item>

					<Form.Item
						name='lastName'
						label={<span>Last Name</span>}
						rules={[
							{
								required: true,
								message: 'Please input your Last Name!',
								whitespace: true,
							},
						]}
					>
						<Input placeholder='lastName' />
					</Form.Item>

					<Form.Item
						name='email'
						label='E-mail'
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
							},
						]}
					>
						<Input placeholder='E-mail' />
					</Form.Item>

					<Form.Item
						name='password'
						label='Password'
						rules={[
							{
								required: true,
								message: 'Please input your password!',
							},
						]}
						hasFeedback
					>
						<Input.Password placeholder='Password' />
					</Form.Item>

					<Form.Item
						name='confirm'
						label='Confirm Password'
						dependencies={['password']}
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Please confirm your password!',
							},
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}

									return Promise.reject(
										'The two passwords that you entered do not match!',
									);
								},
							}),
						]}
					>
						<Input.Password placeholder='Confirm Password' />
					</Form.Item>

					<Form.Item {...tailFormItemLayout}>
						<Button type='primary' htmlType='submit'>
							Register
						</Button>
						<span className='register-span'>Or</span>
						<Link to={`/login`}>Login</Link>
					</Form.Item>
				</Form>
			</form>
		</div>
	);
}
