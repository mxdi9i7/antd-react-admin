import axios from 'axios';
import getAPIUrl from '../constants/apiUrl';

const setAxiosHeader = (token) => {
	axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const setAxiosBaseUrl = () => {
	axios.defaults.baseURL = getAPIUrl();
};

const AxiosHelper = {
	setAxiosHeader,
	setAxiosBaseUrl,
};

export default AxiosHelper;
