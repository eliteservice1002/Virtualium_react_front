import React, { useEffect, useState } from 'react';

/* Google Login */
import Glogin from 'react-google-login';

/* style */
import cx from 'classnames';
import style from './googleLogin.css';

/* connect */
import connect from '../../context/connect';

/* Actions */
import { setUser } from '../../actions/loginAction';

/* Config */
import { GOOGLE_CLIENT_ID } from '../../config';

const GoogleLogin = ({ setUser }) => {


	const toast = (msj) => {
		M.toast({
			html: msj,
			classes:`black-text yellow`
		});
	}

	const responseGoogle = (authResponse) => {
		const { tokenId } = authResponse

		if(tokenId) {
			setUser({
				socialLogin: {
					google: tokenId
				}
			})
		} else {
			toast('Lo sentimos! Su cuenta de Google no contiene su nombre completo o email')
		}
	};

	return(
		<Glogin
				clientId={GOOGLE_CLIENT_ID}
				render={renderProps => (
							<span
						onClick={renderProps.onClick}
						className={cx('btn', 'small', style.btnGoogle)}
					>
						Google
					</span>
				)}
				buttonText="Login"
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
		/>
	)
}

const mapStateToProps = (store) => ({});

const mapDispathToProps = (dispath) => ({
	setUser: (param) => dispath(setUser(param, dispath)),
});

export default connect(
	mapStateToProps,
	mapDispathToProps
)(GoogleLogin);