import React from 'react';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';
import { STUDENT } from '../../constants/roles';

export default function PageNotFound({ redirectUrl }) {
	const history = useHistory();
	return (
		<Result
			status='404'
			title='404'
			subTitle='Sorry, the page you visited does not exist.'
			extra={
				<Button onClick={() => history.push(redirectUrl)} type='primary'>
					Back Home
				</Button>
			}
		/>
	);
}
