import React, { useEffect, useState } from 'react';

/* style */
import cx from 'classnames';
import style from './facebookLogin.css';

/* customHooks */
import { useScript } from '../customHooks/';

/* connect */
import connect from '../../context/connect';

/* Actions */
import { setUser } from '../../actions/loginAction';

/* Config */
import { FACEBOOK_CLIENT_ID } from '../../config';


const FacebookLogin = ({ setUser }) => {
	const [ loadedSDK, errorSDK ] = useScript('https://connect.facebook.net/es_LA/sdk.js', 'facebook-jssdk');

	useEffect(() => {
		window.fbAsyncInit = () => {
			FB.init({
				appId      : FACEBOOK_CLIENT_ID,
				xfbml      : true,
				cookie     : true,
				version    : 'v7.0'
			});
		}
	}, [])

	useEffect(() => {
		if(loadedSDK && errorSDK) { //ocurrió un error
			// mostrar el botón de login aunque no se cargo el SDK
			// para informar al usuario de que no está disponible
		}
	}, [loadedSDK, errorSDK])

	const toast = (msj) => {
		M.toast({
			html: msj,
			classes:`black-text yellow`
		});
	}

	const checkLoginState = (response) => {
		if (response.authResponse) {
			setUser({
				socialLogin: {
					facebook: response.authResponse.accessToken,
				}
			})
		} else {
			toast('El usuario canceló el inicio de sesión o no lo autorizó por completo');
		}
	};

	const checkLoginAfterRefresh = (response) => {
		if (response.status === 'connected') {
			checkLoginState(response);
		} else {
			FB.login(loginResponse => checkLoginState(loginResponse), {
			    scope: 'email', 
			    return_scopes: true
			});
		}
	};

	const handleClick = () => {
		if(errorSDK) {
			toast('Lo sentimos, de momento no está disponible el login con Facebook');
			return;
		}
		FB.getLoginStatus(checkLoginAfterRefresh);
	}

	const logout = () => {
		window.FB.logout((res) => {
			console.log(res);
		})
	}

	return( (!loadedSDK) ? null :
		<span
			onClick={handleClick}
			className={cx('btn', 'small', style.btnFacebook)}
		>
			Facebook
		</span>
	)
}

const mapStateToProps = (store) => ({});

const mapDispathToProps = (dispath) => ({
	setUser: (param) => dispath(setUser(param, dispath)),
});

export default connect(
	mapStateToProps,
	mapDispathToProps
)(FacebookLogin);