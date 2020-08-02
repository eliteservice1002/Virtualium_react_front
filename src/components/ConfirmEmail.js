import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

/* components */
import Loading from './Loading/Loading';

/* utils */
import httpClient from '../utils/axios';

const ConfirmEmail = () => {
	const { hash } = useParams();
	const history = useHistory();

	useEffect(() => {
		httpClient.apiGet(`clientes/confirmaremail/${hash}`).then(({data}) => {
			M.toast({
				html: 'Confirmando el Email',
				classes:`black-text blue`
			});
			if(data.status == 200 ) {
				setTimeout(() => {
					M.toast({
						html: 'Email confirmado',
						classes:`black-text green`
					});
				}, 2000)
			} else if(data.status == 203) {
				setTimeout(() => {
					M.toast({
						html: 'El Email ya fue verificado anteriormente',
						classes:`black-text yellow`
					});
				}, 2000)
			} else {
				setTimeout(() => {
					M.toast({
						html: 'El link es invalido',
						classes:`black-text red`
					});
				}, 2000)
			}
			history.push('/');
		})
	}, [])
	return(
		<Loading/>
	)
}

export default ConfirmEmail;