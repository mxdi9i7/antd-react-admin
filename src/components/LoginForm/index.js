import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthServices from '../../service/auth';
import { useHistory } from 'react-router-dom';
import './index.css';

export default function LoginForm({ role }) {
  let history = useHistory();
  const [loginStatus, setLoginStatus] = useState({});

  const onFinish = async (values) => {
    try {
      const { email, password } = values;
      let loginResult;
      if (role === 'Student') {
        loginResult = await AuthServices.handleStudentLogin({
          email,
          password,
        });
      } else {
        loginResult = await AuthServices.handleTeacherLogin({
          email,
          password,
        });
      }
      setLoginStatus({ ...loginResult.data });
      if (loginResult.data.success && role === 'Student') {
        window.localStorage.setItem('token', loginResult.data.data);
        window.localStorage.setItem('role', role);
        window.setTimeout(function () {
          history.push('/home/student');
        }, 1000);
      } else if (loginResult.data.success && role === 'Teacher') {
        window.localStorage.setItem('token', loginResult.data.data);
        window.localStorage.setItem('role', role);
        window.setTimeout(function () {
          history.push('/home/teacher');
        }, 1000);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      {loginStatus.success === false && (
        <Alert
          message='Error'
          description={loginStatus.data}
          type='error'
          closable
          showIcon
        />
      )}
      {loginStatus.success === true && (
        <Alert message='Login successfully!' type='success' showIcon />
      )}
      <Form name='normal_login' className='login-form' onFinish={onFinish}>
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className='site-form-item-icon' />}
            placeholder='Email'
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className='site-form-item-icon' />}
            type='password'
            placeholder='Password'
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            <p>Log in</p>
          </Button>
          {role === 'Student' && <span>Or</span>}
          {role === 'Student' && <Link to={`/registration`}>Register now!</Link>}
        </Form.Item>
      </Form>
    </div>
  );
}
