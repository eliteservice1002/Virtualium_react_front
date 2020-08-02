import httpClient from '../utils/axios';
import {
	LOGOUT,
	SET_USER,
	SET_MESSAGE,
	START_LOGIN,
	HANDLE_LOGIN,
	HANDLE_REGISTER,
	SET_ERROR_LOGIN,
	SET_SUCCESS_LOGIN,
	RESTART_ERROR_SET_USER,
} from '../config.js';

/*
 * @param {Object} payload | User data
 * @param {Function} dispatch
*/
export const setUser = async ({ email, password, socialLogin }, dispatch) => {
	dispatch({
		type: START_LOGIN,
		payload: {
			isLoginLoading: true
		}
	})

	// Datos del proceso de login
	const dataLogin = {
		status: false,
		message: errorMsjGeneral
	};

	if(socialLogin) {
		const {facebook, google } = socialLogin;

		// Verificar si el usuario existe

		const formDataLogin = new FormData();
		const social = (facebook ? 'facebook' : 'google');
		formDataLogin.append('token', facebook || google);
		formDataLogin.append('social', social);

		try {
			var response = await httpClient.apiPost(`clientes/social-login`, formDataLogin)
		} catch (err) {
			console.error(err);
			M.toast({
				html: 'Error de la red social',
				classes:`black-text yellow`
			});
			dispatch({
				type: SET_ERROR_LOGIN,
				payload: {
					isLoginLoading: false
				}
			})
			return
		}

		if (!response.data || !response.data.user) {
			// ocurrio un error
			M.toast({
				html: 'No se pudo obtener los datos del usuario',
				classes:`black-text yellow`
			});
			dispatch({
				type: SET_ERROR_LOGIN,
				payload: {
					isLoginLoading: false
				}
			})
			return
		}

		if (!response.data.user.email) {
			M.toast({
				html: 'Debe tener registrado su email en su red social',
				classes:`black-text yellow`
			});
			dispatch({
				type: SET_ERROR_LOGIN,
				payload: {
					isLoginLoading: false
				}
			})
			return
		}

		if (response.data && response.data.status) {
			// el usuario existe, y se hizo login manualmente en el backend
			Object.assign(dataLogin, response.data);
		}

		if (response.data && !response.data.status) {
			// el usuario no existe en la base de datos, por eso lo registra
			try {
				const formData = new FormData();
				formData.append('email', response.data.user.email);
				formData.append('nombres', response.data.user.nombre);
				formData.append('apellidos', response.data.user.apellido);

				if(google) formData.append('google', response.data.user.google);
				if(facebook) formData.append('facebook', response.data.user.facebook);

				const { data } = await httpClient.apiPost('clientes/registrar', formData);

				if(!data.cod == 200) {
					// ocurrio un error
					M.toast({
						html: data.message,
						classes:`black-text yellow`
					});
					dispatch({
						type: SET_ERROR_LOGIN,
						payload: {
							isLoginLoading: false
						}
					})
					return
				} else {
					// registro exitoso
					password = data.password;
					email = response.data.user.email
				}
			} catch(err) {
				console.error(err);
				dispatch({
					type: SET_ERROR_LOGIN,
					payload: {
						errorMsj: 'Error al registrar usuario',
						isLoginLoading: false
					}
				})
				return
			}
		}
	}

	if(password) {
		const formData = new FormData();
		formData.append('email', email);
		formData.append('password', password);
		try {
			let response = await httpClient.apiPost('clientes/login', formData);
			Object.assign(dataLogin, response.data);
		} catch(err) {
			toastError();
		}
	}

	dispatch({
		type: START_LOGIN,
		payload: {
			isLoginLoading: false
		}
	})

	if(!dataLogin.status) {
		dispatch({
			type: SET_ERROR_LOGIN,
			payload: {
				errorMsj: dataLogin.message,
				isLoginLoading: false
			}
		})
	} else {
		dispatch({
			type: SET_SUCCESS_LOGIN,
			payload: {
				user: dataLogin.user,
				errorMsj: null,
				isLogin: true
			}
		})
	}
}

export const setUserAdmin = (user, dispatch) => {
	const dummyAdmin = {
		rol: 'admin',
		email: "gagzu.ali@gmail.com",
		estado_id: "ACTIVO",
		id: 1,
		imagen_perfil: null,
		localidad: null,
		nombres: "admin demo",
		provincia: null,
		telefono: null,
		tipo_documento: null,
		twitter: null,
	}
	return {
		type: SET_SUCCESS_LOGIN,
		payload: {
			user: dummyAdmin,
			errorMsj: null,
			isLogin: true
		}
	}
}

export const verifySession = async (dispatch) => {
	try {
		const { data: { user } } = await httpClient.apiGet('clientes/login');
		if(user) {
			return dispatch({
				type: SET_USER,
				payload: {
					user,
					isLogin: true
				}
			})
		}
	} catch(e) { console.error(e) }
}

export const restartErrorLogin = () => {
	return {
		type: RESTART_ERROR_SET_USER,
		payload: {
			errorMsj: null
		}
	}
}

export const logout =  () => {
	httpClient.apiGet('clientes/logout');
	return {
		type: LOGOUT,
		payload: {}
	}
}

/*
 * Acción para manejar el estado de cerrado o abierto del
 * formulario del login que se encuentra en el <Header/>
 * desde cualquer lugar de la App
 *
 * @param $store estado global de la App
*/
export const handleOpenLogin = (store) => {
	return {
		type: HANDLE_LOGIN,
		payload: {
			triggerOpenLogin: !store.login.triggerOpenLogin
		}
	}
}

/*
 * Acción para manejar el estado de cerrado o abierto del
 * formulario de registro que se encuentra en el <Header/>
 * desde cualquer lugar de la App
 *
 * @param $store estado global de la App
*/
export const handleOpenRegister = (store) => {
	return {
		type: HANDLE_REGISTER,
		payload: {
			triggerOpenRegister: !store.login.triggerOpenRegister
		}
	}
}

const toastError = () => {
	M.toast({
		html: errorMsjGeneral,
		classes:`black-text yellow`
	});
}

var errorMsjGeneral = 'Lo sentimos! ocurrió un fallo, por favor vuelve a intentar';