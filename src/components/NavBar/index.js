import React, { useEffect } from 'react';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import './index.scss';

const { Header } = Layout;

const NavBar = ({ user, redirectUrl, role, classList, setActiveClass }) => {
	const activeClassId = classList[0] ? classList[0]._id : '';

	useEffect(() => {
		setActiveClass(activeClassId);
	}, [activeClassId, setActiveClass]);

	return (
		<Header className='header' style={{ paddingLeft: 0 }}>
			<Link to={redirectUrl} className='logo'>
				<img
					src='https://d33wubrfki0l68.cloudfront.net/881cde16dba042a14fca567a9f5c20d6a0c959cc/33933/logo.svg'
					alt='Future Sphere Logo'
				/>
			</Link>
			{activeClassId && (
				<Menu
					theme='dark'
					mode='horizontal'
					defaultSelectedKeys={[activeClassId]}
					onClick={({ key }) => setActiveClass(key)}
				>
					{classList.map((v) => (
						<Menu.Item key={v._id}>
							{v.title} {v.cohort}班
						</Menu.Item>
					))}
				</Menu>
			)}
		</Header>
	);
};

export default NavBar;
