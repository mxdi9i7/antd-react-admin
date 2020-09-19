const devUrl = 'http://localhost:3005'; // Needs update
const prodUrl = 'https://api.com'; // Needs update

const currentEnv = process.env.REACT_APP_ENV;

const getAPIUrl = () => {
	if (currentEnv === 'dev') {
		return devUrl;
	}
	return prodUrl;
};

export default getAPIUrl;
