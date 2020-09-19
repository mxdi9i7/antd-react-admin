import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default function LogoutPage({ setUser, user }) {
	useEffect(() => {
		setUser(null);
		window.localStorage.removeItem('token');
	}, [setUser]);
	return <Redirect to='/login' />;
}
