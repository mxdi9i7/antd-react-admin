import React from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export const loginInputs = [
	{
		name: 'email',
		rules: [{ required: true, message: 'Please enter your email!' }],
		placeholder: 'Enter student email address',
		type: 'email',
		icon: <UserOutlined className='site-form-item-icon' />,
	},
	{
		name: 'password',
		rules: [
			{
				required: true,
				message: 'Please input your Password!',
			},
		],
		type: 'password',
		placeholder: 'Enter student password',
		icon: <LockOutlined className='site-form-item-icon' />,
	},
];
