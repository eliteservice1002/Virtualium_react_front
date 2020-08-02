import {
	LOGOUT,
	SET_USER,
	START_LOGIN,
	HANDLE_LOGIN,
	HANDLE_REGISTER,
	SET_ERROR_LOGIN,
	SET_SUCCESS_LOGIN,
	RESTART_ERROR_SET_USER,
} from '../config.js';

const init = {
	user: null,
	isLogin: false,
	errorMsj: null,
	isLoginLoading: false,
	triggerOpenLogin: false,
	triggerOpenRegister: false,
};

const login = (state = init, action) => {
	switch(action.type) {
		case SET_USER:
		case START_LOGIN:
		case HANDLE_LOGIN:
		case HANDLE_REGISTER:
		case SET_ERROR_LOGIN:
		case SET_SUCCESS_LOGIN:
		case RESTART_ERROR_SET_USER:
			return { ...state, ...action.payload };
			break;
		case LOGOUT:
			return init;
			break;
		default:
			return state;
	}
};

export default login;
