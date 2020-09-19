import React, { useState } from 'react';
import { Tabs, Form, Input, Button, message } from 'antd';
import LoginForm from './LoginForm';
import BackgroundSlideshow from 'react-background-slideshow';
import { Link } from 'react-router-dom';
import Logo from '../../../images/logo.png';
import { STUDENT, TEACHER } from '../../../constants/roles';
import AuthServices from '../../../service/auth';
import ClassServices from "../../../service/class"
import './index.scss';
import { Redirect } from 'react-router-dom';
import images from '../../../constants/backgroundImages';
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs;
const { Search } = Input;

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

export default function LoginPage({ user, redirectUrl }) {
	const [role, setRole] = useState(STUDENT);
	const [isLogin, setLogin] = useState(true)
	const [reportCardStudentClasses, setClasses] = useState([])
	const [studentId, setStudentId] = useState("")

	function handleRoleChange(key) {
		setRole(key);
	}

	const formProps = {
		role,
		redirectUrl,
	};

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

	const handleLogin = e =>{
		setLogin(e)
	}

	const handleReportCardInput = e =>{
		setStudentId(e)
		setClasses([])
	}

	const getClassesByStudentId = async() =>{
		if(studentId===""){
			message.warning("please enter student ID!")
			return false
		}
		if(studentId.length !== 8){
			message.warning("Student ID is eight digits!")
			return false
		}
		try {
			const classesResult = await ClassServices.handleGetClassesByStudentId(studentId)
			if(classesResult.data.success){
				if(classesResult.data.data.length === 0){
					message.info("We do not find any student report by this id.")
				}
				else{
					setClasses(classesResult.data.data)
				}
			}
			else{
				message.error("Something went wrong.")
			}
		} catch (error) {
			message.error(error.message);
		}
	}

	return user ? (
		<Redirect to={redirectUrl} />
	) : (
		<div className='login__page'>
			<BackgroundSlideshow images={images} />
			{
				isLogin?(
					<div className='login__container'>
						<div className='logo__container'>
							<img src={Logo} alt='The Future Sphere' />
						</div>
						<Tabs defaultActiveKey={STUDENT} onTabClick={handleRoleChange}>
							<TabPane tab={STUDENT} key={STUDENT}>
								<LoginForm {...formProps} handleLogin={handleLogin}/>
							</TabPane>
							<TabPane tab={"report card"}>
								<p>Please enter student ID to get report card</p>
								<Search style={{marginBottom:"10px"}} onChange={e=>handleReportCardInput(e.target.value)} maxLength={8} type="number" placeholder="student ID" onSearch={getClassesByStudentId} enterButton/>
								{
									reportCardStudentClasses.length > 0 && reportCardStudentClasses.map(e=>(
										<Button style={{marginRight:"5px",marginBottom:"10px"}} onClick={()=>history.push(`/report/${e._id}/${studentId}`)} size="small">{e.title} cohort{e.cohort}</Button>
									))
								}
							</TabPane>
							<TabPane tab={TEACHER} key={TEACHER}>
								<LoginForm {...formProps} />
							</TabPane>
						</Tabs>
					</div>
				):(
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
									<Link onClick={()=>setLogin(true)}>Login</Link>
								</Form.Item>
							</Form>
						</form>
					</div>
				)
			}
			
		</div>	
	)
}
