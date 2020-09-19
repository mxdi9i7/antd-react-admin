import axios from 'axios';

const handlestudentRegister = (values) => {
	return axios.post(`/auth/register/student`, values);
};

const handlestudentLogin = ({ email, password }) => {
	return axios.post(`/auth/login/student`, {
		email,
		password,
	});
};

const handleteacherLogin = ({ email, password }) => {
	return axios.post(`/auth/login/teacher`, {
		email,
		password,
	});
};

const verifyToken = ({ token }) => {
	return axios.post(`/auth/verify/token`, {
		token,
	});
};

const AuthServices = {
	handlestudentRegister,
	handlestudentLogin,
	handleteacherLogin,
	verifyToken,
};

export default AuthServices;
